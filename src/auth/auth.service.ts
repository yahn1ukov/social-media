import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

import { UsersRepository } from '@/users/users.repository';
import { TokenService } from './services/token.service';
import { AppConfigService } from '@/shared/config/app-config.service';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly tokenService: TokenService,
    private readonly configService: AppConfigService,
  ) {}

  async register(res: Response, dto: RegisterDto) {
    const { confirmPassword, ...data } = dto;

    const hashedPassword = await bcrypt.hash(data.password, 8);
    const user = await this.usersRepository.create({ ...data, password: hashedPassword });

    return this.authenticate(res, user!.id, user!.username);
  }

  async login(req: Request, res: Response) {
    const user = req.user as JwtPayload;
    return this.authenticate(res, user.id, user.username);
  }

  async refresh(req: Request, res: Response) {
    const user = req.user as JwtPayload;
    return this.authenticate(res, user.id, user.username);
  }

  async logout(res: Response, userId: string) {
    await this.usersRepository.updateById(userId, { refreshToken: null });
    this.clearRefreshTokenCookie(res);
  }

  private async authenticate(res: Response, userId: string, username: string) {
    const { accessToken, refreshToken } = await this.tokenService.generateJwtTokens(userId, username);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 8);
    await this.usersRepository.updateById(userId, { refreshToken: hashedRefreshToken });

    this.setRefreshTokenCookie(res, refreshToken);

    return {
      tokenType: this.configService.jwtTokenType,
      accessToken,
      expiresIn: this.configService.jwtAccessExpiresIn,
    };
  }

  private get cookieOptions() {
    return {
      httpOnly: true,
      domain: this.configService.cookieDomain,
      secure: !this.configService.isDev,
      sameSite: !this.configService.isDev ? 'strict' : 'none',
    } as const;
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      ...this.cookieOptions,
      maxAge: this.configService.jwtRefreshExpiresIn * 1000,
    });
  }

  private clearRefreshTokenCookie(res: Response) {
    res.clearCookie('refreshToken', this.cookieOptions);
  }
}
