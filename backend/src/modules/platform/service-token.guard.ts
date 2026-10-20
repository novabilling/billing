import { CanActivate, Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'crypto';

/**
 * A control plane run by the platform operator (for example a hosted
 * offering's billing service), by the PLATFORM_SERVICE_TOKEN shared secret.
 * Unset, the service API is off.
 */
@Injectable()
export class ServiceTokenGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const expected = this.config.get<string>('PLATFORM_SERVICE_TOKEN');
    const header: string | undefined = context.switchToHttp().getRequest().headers['authorization'];
    const token = header?.startsWith('Bearer ') ? header.slice(7).trim() : '';
    if (!expected || expected.length < 32 || !token) throw new UnauthorizedException();
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) throw new UnauthorizedException();
    return true;
  }
}
