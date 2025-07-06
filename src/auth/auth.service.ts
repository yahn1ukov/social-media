import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async register(registerDto: RegisterDto, res: Response) {
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const user = await this.usersService.createUser({
        username: registerDto.username,
        password: hashedPassword,
      });

      return this.authenticateUser(res, user!.id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async login(req: Request, res: Response) {
    const user = req.user as JwtPayload;
    return this.authenticateUser(res, user.sub);
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'] as string;
    if (!refreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const payload =
        await this.tokenService.verifyJwtRefreshToken(refreshToken);

      const user = await this.usersService.findUserById(payload.sub);
      if (!user?.refreshToken) {
        throw new UnauthorizedException('Unauthorized');
      }

      const isRefreshTokenMatch = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (!isRefreshTokenMatch) {
        throw new UnauthorizedException('Unauthorized');
      }

      return this.authenticateUser(res, user.id);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to refresh token');
    }
  }

  async logout(userId: string, res: Response) {
    try {
      await this.usersService.updateRefreshToken(userId, null);
      this.clearRefreshTokenCookie(res);
    } catch (error) {
      throw new InternalServerErrorException('Failed to logout');
    }
  }

  private async authenticateUser(res: Response, userId: string) {
    try {
      const { accessToken, refreshToken } =
        await this.tokenService.generateTokens(userId);

      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      await this.usersService.updateRefreshToken(userId, hashedRefreshToken);

      this.setRefreshTokenCookie(res, refreshToken);

      return { accessToken };
    } catch (error) {
      throw new InternalServerErrorException('Failed to authenticate user');
    }
  }

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
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
