import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import { AppConfigService } from '@/config/app-config.service';
import { UsersService } from '@/users/users.service';
import { TokenService } from './services/token.service';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: AppConfigService,
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async register(res: Response, dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 8);
    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    return this.auth(res, user!.id);
  }

  async login(req: Request, res: Response) {
    const user = req.user as JwtPayload;

    return this.auth(res, user.id);
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'] as string;
    if (!refreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    const payload = await this.tokenService.verify(refreshToken);

    const user = await this.usersService.findById(payload.id);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    const isRefreshTokenMatch = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!isRefreshTokenMatch) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.auth(res, user.id);
  }

  async logout(res: Response, id: string) {
    await this.usersService.updateRefreshTokenById(id, null);

    this.setCookie(res, '', 0);
  }

  private async auth(res: Response, id: string) {
    const { accessToken, refreshToken } = await this.generateTokens(id);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 8);
    await this.usersService.updateRefreshTokenById(id, hashedRefreshToken);

    this.setCookie(res, refreshToken, this.configService.refreshExpiresIn);

    return { accessToken };
  }

  private async generateTokens(id: string) {
    const payload: JwtPayload = { id };

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(payload),
      this.tokenService.generateRefreshToken(payload),
    ]);

    return { accessToken, refreshToken };
  }

  private setCookie(res: Response, refreshToken: string, maxAge: number) {
    res.cookie('refreshToken', refreshToken, {
      maxAge,
      httpOnly: true,
      domain: this.configService.cookieDomain,
      secure: !this.configService.isDev,
      sameSite: !this.configService.isDev ? 'lax' : 'none',
    });
  }
}
