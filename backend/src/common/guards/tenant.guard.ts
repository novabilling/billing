import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { can, Permission, PERMISSION_KEY } from '../auth/permissions';
import { verify, JwtPayload } from 'jsonwebtoken';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { TenantDatabaseService } from '../../database/tenant-database.service';
import { isPlatformOperator } from '../platform-operator';
import { assertTenantAccess } from './tenant-access';

@Injectable()
export class TenantGuard implements CanActivate {
  private readonly logger = new Logger(TenantGuard.name);
  private readonly jwtSecret: string;

  constructor(
    private readonly centralPrisma: CentralPrismaService,
    private readonly tenantDb: TenantDatabaseService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
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
    const session = await this.resolveFromJwt(token);
    const sessionTenant = session?.tenant ?? null;
    const tenant = sessionTenant ?? (await this.resolveFromApiKey(token));

    if (!tenant) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!tenant.isActive) {
      throw new UnauthorizedException('Tenant account is deactivated');
    }

    if (!isPlatformOperator(tenant, this.configService)) {
      assertTenantAccess(tenant, request.method, request.originalUrl ?? request.url ?? '');
    }

    const tenantDbClient = await this.tenantDb.getTenantClient(tenant.id);

    request.tenant = tenant;
    request.tenantDb = tenantDbClient;
    request.authMethod = sessionTenant ? 'session' : 'api_key';
    if (session) {
      request.member = session.member;
      this.authorize(context, request.method, session.member.role);
    }

    return true;
  }

  /**
   * People act within their role. A route's own permission wins; otherwise
   * reads need `read` and writes need the controller's permission, or
   * `billing.write`. API keys are not people and keep full access.
   */
  private authorize(context: ExecutionContext, method: string, role: Parameters<typeof can>[0]) {
    const own = this.reflector.get<Permission | undefined>(PERMISSION_KEY, context.getHandler());
    const isRead = ['GET', 'HEAD', 'OPTIONS'].includes(method);
    const needed: Permission = own ?? (isRead ? 'read' : (this.reflector.get<Permission | undefined>(PERMISSION_KEY, context.getClass()) ?? 'billing.write'));
    if (!can(role, needed)) {
      throw new ForbiddenException(`Your role (${role.toLowerCase()}) cannot do this. Ask an owner or admin.`);
    }
  }

  /**
   * A dashboard session: the organisation, and the person with their current
   * role, read fresh so a removed member or changed role takes effect at once.
   * Sessions from before people had their own logins act as the owner.
   */
  private async resolveFromJwt(token: string) {
    let payload: JwtPayload;
    try {
      payload = verify(token, this.jwtSecret) as JwtPayload;
    } catch {
      // Not a valid JWT — fall through to API key resolution
      return null;
    }
    if (!payload.sub) return null;
    const tenant = await this.centralPrisma.client.tenant.findUnique({ where: { id: payload.sub } });
    if (!tenant) return null;

    const membership = await this.centralPrisma.client.membership.findFirst({
      where: payload.uid ? { tenantId: tenant.id, userId: String(payload.uid) } : { tenantId: tenant.id, role: 'OWNER' },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
    if (!membership || !membership.user.isActive) {
      throw new UnauthorizedException('You are no longer a member of this organisation');
    }
    return {
      tenant,
      member: { userId: membership.userId, email: membership.user.email, name: membership.user.name, role: membership.role },
    };
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
