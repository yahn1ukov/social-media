import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfigService } from '@/config/app-config.service';

import type { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
  ) {}

  async generateAccessToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.accessExpiresIn,
    });
  }

  async generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.refreshExpiresIn,
    });
  }

  async verify(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token);
  }
}
