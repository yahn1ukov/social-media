import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    const hashedPassword = await bcrypt.hash(dto.password, 8);

    const user = await this.usersRepository.create({
      username: dto.username,
      password: hashedPassword,
    });

    return this.authenticate(res, user!.id, user!.username);
  }

  async login(req: Request, res: Response) {
    const user = req.user as JwtPayload;
    return this.authenticate(res, user.id, user.username);
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'] as string;
    if (!refreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    const payload = await this.tokenService.verifyJwtRefreshToken(refreshToken);

    const user = await this.usersRepository.findById(payload.id);
    if (!user?.refreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.authenticate(res, user.id, user.username);
  }

  async logout(res: Response, userId: string) {
    await this.usersRepository.updateById(userId, {
      refreshToken: null,
    });
    this.clearRefreshTokenCookie(res);
  }

  private async authenticate(res: Response, userId: string, username: string) {
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(userId, username);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 8);
    await this.usersRepository.updateById(userId, {
      refreshToken: hashedRefreshToken,
    });

    this.setRefreshTokenCookie(res, refreshToken);

    return { accessToken };
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      maxAge: this.configService.jwtRefreshExpiresIn,
      httpOnly: true,
      domain: this.configService.cookieDomain,
      secure: !this.configService.isDev,
      sameSite: !this.configService.isDev ? 'strict' : 'none',
    });
  }

  private clearRefreshTokenCookie(res: Response) {
    res.clearCookie('refreshToken', {
      domain: this.configService.cookieDomain,
      secure: !this.configService.isDev,
      sameSite: !this.configService.isDev ? 'strict' : 'none',
    });
  }
}
