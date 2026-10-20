import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, verify } from 'jsonwebtoken';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { isPlatformOperator } from '../../common/platform-operator';


/**
 * Only dashboard sessions of a platform operator organisation qualify (see
 * common/platform-operator); API keys never grant platform access. Of that
 * organisation's people, only owners and admins are operators.
 */
@Injectable()
export class PlatformAdminGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly centralPrisma: CentralPrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const header: string | undefined = request.headers['authorization'];
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
    if (!token) throw new UnauthorizedException('Missing Authorization header');

    let payload: JwtPayload;
    try {
      payload = verify(token, this.config.get<string>('JWT_SECRET')!) as JwtPayload;
    } catch {
      throw new UnauthorizedException('Platform access requires a dashboard session');
    }

    const tenant = payload.sub
      ? await this.centralPrisma.client.tenant.findUnique({ where: { id: String(payload.sub) }, select: { id: true, isPlatformOperator: true } })
      : null;
    if (!tenant || !isPlatformOperator(tenant, this.config)) {
      throw new ForbiddenException('This account does not have platform access');
    }
    // Sessions from before people had their own logins belong to the owner.
    if (payload.uid) {
      const membership = await this.centralPrisma.client.membership.findUnique({
        where: { userId_tenantId: { userId: String(payload.uid), tenantId: tenant.id } },
        include: { user: { select: { isActive: true } } },
      });
      if (!membership?.user.isActive || !['OWNER', 'ADMIN'].includes(membership.role)) {
        throw new ForbiddenException('Platform access needs an owner or admin of the operator organisation');
      }
    }
    request.platformAdminId = tenant.id;
    return true;
  }
}
