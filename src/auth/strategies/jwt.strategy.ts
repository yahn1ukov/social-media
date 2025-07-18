import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfigService } from '@/shared/config/app-config.service';
import { UsersService } from '@/users/users.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: AppConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecretKey,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return { id: user.id, username: user.username } as JwtPayload;
  }
}
