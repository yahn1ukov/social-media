import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfigService } from '@/shared/config/app-config.service';
import { UsersRepository } from '@/users/users.repository';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: AppConfigService,
    private readonly usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecretKey,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersRepository.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return { id: user.id, username: user.username } as JwtPayload;
  }
}
