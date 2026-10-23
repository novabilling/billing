import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  sub: string;
  email: string;
  typ?: string;
  type?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
      algorithms: ['HS256'],
    });
  }

  validate(payload: JwtPayload) {
    // Only session tokens; anything issued for another purpose is refused.
    if ((payload.typ !== undefined && payload.typ !== 'access') || payload.type !== undefined) {
      throw new UnauthorizedException();
    }
    return { tenantId: payload.sub, email: payload.email };
  }
}
