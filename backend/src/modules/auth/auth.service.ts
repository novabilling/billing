import {
  Injectable,
  Logger,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { TenantDatabaseService } from '../../database/tenant-database.service';
import { EncryptionService } from '../../services/encryption.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly centralPrisma: CentralPrismaService,
    private readonly tenantDb: TenantDatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.centralPrisma.client.tenant.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    let slug = dto.companyName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const existingSlug = await this.centralPrisma.client.tenant.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const hashedPassword = await argon2.hash(dto.password);
    const apiKey = this.encryptionService.generateApiKey();
    const webhookSecret = this.encryptionService.generateWebhookSecret();

    const tenant = await this.centralPrisma.client.tenant.create({
      data: {
        name: dto.companyName,
        slug,
        email: dto.email,
        password: hashedPassword,
        apiKey,
        webhookSecret,
        settings: { ownerName: dto.name },
      },
    });

    await this.centralPrisma.client.tenantBilling.create({
      data: {
        tenantId: tenant.id,
        status: 'active',
      },
    });

    try {
      await this.tenantDb.createTenantDatabase(tenant.id);
    } catch (error) {
      this.logger.error(`Failed to create tenant database, cleaning up`, error);
      await this.centralPrisma.client.tenant.delete({ where: { id: tenant.id } });
      throw error;
    }

    const tokens = this.generateTokens(tenant.id, tenant.email);

    const { password: _, ...tenantWithoutPassword } = tenant;

    return {
      tenant: tenantWithoutPassword,
      apiKey,
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const tenant = await this.centralPrisma.client.tenant.findUnique({
      where: { email: dto.email },
    });

    if (!tenant) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await argon2.verify(tenant.password, dto.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!tenant.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    await this.centralPrisma.client.tenant.update({
      where: { id: tenant.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = this.generateTokens(tenant.id, tenant.email);
    const { password: _, ...tenantWithoutPassword } = tenant;

    return {
      tenant: tenantWithoutPassword,
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const tenant = await this.centralPrisma.client.tenant.findUnique({
        where: { id: payload.sub },
      });

      if (!tenant || !tenant.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(tenant.id, tenant.email);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const tenant = await this.centralPrisma.client.tenant.findUnique({
      where: { email },
    });

    if (!tenant) {
      // Don't reveal whether the email exists
      return;
    }

    const resetToken = this.jwtService.sign(
      { sub: tenant.id, type: 'password-reset' },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1h',
      },
    );

    this.logger.log(`Password reset token generated for tenant ${tenant.id}: ${resetToken}`);
    // In production, send email with reset link
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (payload.type !== 'password-reset') {
        throw new BadRequestException('Invalid reset token');
      }

      const hashedPassword = await argon2.hash(newPassword);

      await this.centralPrisma.client.tenant.update({
        where: { id: payload.sub },
        data: { password: hashedPassword },
      });
    } catch {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  private generateTokens(tenantId: string, email: string): TokenPair {
    const payload = { sub: tenantId, email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION', '1h') as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d') as any,
    });

    return { accessToken, refreshToken };
  }
}
