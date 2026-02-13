import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify, JwtPayload } from 'jsonwebtoken';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { TenantDatabaseService } from '../../database/tenant-database.service';

@Injectable()
export class TenantGuard implements CanActivate {
  private readonly logger = new Logger(TenantGuard.name);
  private readonly jwtSecret: string;

  constructor(
    private readonly centralPrisma: CentralPrismaService,
    private readonly tenantDb: TenantDatabaseService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET')!;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    if (!token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    // Try JWT first — dashboard sessions use this path
    const tenant = (await this.resolveFromJwt(token)) ?? (await this.resolveFromApiKey(token));

    if (!tenant) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!tenant.isActive) {
      throw new UnauthorizedException('Tenant account is deactivated');
    }

    const tenantDbClient = await this.tenantDb.getTenantClient(tenant.id);

    request.tenant = tenant;
    request.tenantDb = tenantDbClient;

    return true;
  }

  private async resolveFromJwt(token: string) {
    try {
      const payload = verify(token, this.jwtSecret) as JwtPayload;
      if (!payload.sub) return null;

      return await this.centralPrisma.client.tenant.findUnique({
        where: { id: payload.sub },
      });
    } catch {
      // Not a valid JWT — fall through to API key resolution
      return null;
    }
  }

  private async resolveFromApiKey(apiKey: string) {
    // Try finding by ApiKey table first
    const apiKeyRecord = await this.centralPrisma.client.apiKey.findUnique({
      where: { key: apiKey },
      include: { tenant: true },
    });

    if (apiKeyRecord) {
      if (apiKeyRecord.expiresAt && apiKeyRecord.expiresAt < new Date()) {
        throw new UnauthorizedException('API key has expired');
      }

      // Update lastUsed
      await this.centralPrisma.client.apiKey
        .update({
          where: { id: apiKeyRecord.id },
          data: { lastUsed: new Date() },
        })
        .catch((err: any) => {
          this.logger.warn(`Failed to update API key lastUsed: ${err.message}`);
        });

      return apiKeyRecord.tenant;
    }

    // Fallback: check Tenant.apiKey directly
    return await this.centralPrisma.client.tenant.findUnique({
      where: { apiKey },
    });
  }
}
