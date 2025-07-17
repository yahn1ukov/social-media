import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

import { AppConfigService } from '@/shared/config/app-config.service';
import { UsersService } from '@/users/users.service';
import { TokenService } from '../services/token.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    configService: AppConfigService,
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => req.cookies['refreshToken'] as string]),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecretKey,
      passReqToCallback: true,
    });
  }

  async validate(req: Request) {
    const refreshToken = req.cookies['refreshToken'] as string;
    if (!refreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    const payload = await this.tokenService.verifyJwtRefreshToken(refreshToken);

    const user = await this.usersService.findById(payload.id);
    if (!user?.refreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Unauthorized');
    }

    return { id: user.id, username: user.username } as JwtPayload;
  }
}
