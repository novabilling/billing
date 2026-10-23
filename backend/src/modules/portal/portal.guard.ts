import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { TenantDatabaseService } from '../../database/tenant-database.service';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { assertTenantAccess } from '../../common/guards/tenant-access';
import { isPlatformOperator } from '../../common/platform-operator';
import { verifyPortalToken } from '../../common/auth/tokens';

/**
 * The customer portal accepts either the organisation's own credentials
 * (server to server, as before) or a portal token: short-lived, issued by
 * POST /portal/customers/:externalId/sessions, and good only for that one
 * customer's portal routes. Portal tokens are what belong in links handed to
 * customers; API keys never do.
 */
@Injectable()
export class PortalGuard implements CanActivate {
  constructor(
    private readonly tenantGuard: TenantGuard,
    private readonly centralPrisma: CentralPrismaService,
    private readonly tenantDb: TenantDatabaseService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const header: string | undefined = request.headers['authorization'];
    const token = header?.startsWith('Bearer ') ? header.slice(7) : header;
    const portal = token ? verifyPortalToken(token, this.config.get<string>('JWT_SECRET')!) : null;
    if (!portal) return this.tenantGuard.canActivate(context);

    if (request.params?.externalId !== portal.cid) {
      throw new ForbiddenException('This portal link is for a different customer');
    }
    if (context.getHandler().name === 'createSession') {
      throw new ForbiddenException('Portal links cannot create other portal links');
    }
    const tenant = await this.centralPrisma.client.tenant.findUnique({ where: { id: portal.sub } });
    if (!tenant || !tenant.isActive) throw new UnauthorizedException('This portal link is no longer valid');
    if (!isPlatformOperator(tenant, this.config)) {
      // Paying an invoice is a write, but one a read-only organisation should still allow.
      assertTenantAccess(tenant, 'GET', request.originalUrl ?? request.url ?? '');
    }
    request.tenant = tenant;
    request.tenantDb = await this.tenantDb.getTenantClient(tenant.id);
    request.authMethod = 'portal';
    return true;
  }
}
