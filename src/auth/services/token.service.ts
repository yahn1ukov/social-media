import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfigService } from '@/config/app-config.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
  ) {}

  async generateTokens(userId: string) {
    const payload: JwtPayload = { sub: userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateJwtAccessToken(payload),
      this.generateJwtRefreshToken(payload),
    ]);

    return { accessToken, refreshToken };
  }

  async verifyJwtRefreshToken(token: string): Promise<JwtPayload> {
    return await this.jwtService.verifyAsync(token);
  }

  private async generateJwtAccessToken(payload: JwtPayload) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.jwtAccessExpiresIn,
    });
  }

  private async generateJwtRefreshToken(payload: JwtPayload) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.jwtRefreshExpiresIn,
    });
  }
}
