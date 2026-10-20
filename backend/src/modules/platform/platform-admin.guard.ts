import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, verify } from 'jsonwebtoken';
import { CentralPrismaService } from '../../database/central-prisma.service';

/**
 * Platform operators are tenant accounts whose ids are listed in
 * PLATFORM_ADMIN_TENANT_IDS. Ids rather than emails, because ids are generated
 * at registration and cannot be claimed by signing up with someone's address.
 * Only dashboard sessions qualify; API keys never grant platform access. Of
 * that organisation's people, only owners and admins are operators.
 */
export function platformAdminIds(config: ConfigService): Set<string> {
  return new Set(
    (config.get<string>('PLATFORM_ADMIN_TENANT_IDS') ?? '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean),
  );
}

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

    if (!payload.sub || !platformAdminIds(this.config).has(payload.sub)) {
      throw new ForbiddenException('This account does not have platform access');
    }
    // Sessions from before people had their own logins belong to the owner.
    if (payload.uid) {
      const membership = await this.centralPrisma.client.membership.findUnique({
        where: { userId_tenantId: { userId: String(payload.uid), tenantId: payload.sub } },
        include: { user: { select: { isActive: true } } },
      });
      if (!membership?.user.isActive || !['OWNER', 'ADMIN'].includes(membership.role)) {
        throw new ForbiddenException('Platform access needs an owner or admin of the operator organisation');
      }
    }
    request.platformAdminId = payload.sub;
    return true;
  }
}
