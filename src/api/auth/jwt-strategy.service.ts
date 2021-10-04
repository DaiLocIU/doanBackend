import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { InjectAuthConfig } from '../configuration/auth.configuration';
import { AuthConfig } from '../types/index';
import { AuthService } from './auth.service';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    @InjectAuthConfig() readonly authConfig: AuthConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.jwtSecret,
    });
  }

  async validate(payload: JwtPayload, done: VerifiedCallback): Promise<void> {
    const user = await this.authService.validateUser(payload);
    console.log(user);
    if (user == null) {
      return done(new UnauthorizedException(), null);
    }

    return done(null, user);
  }
}
