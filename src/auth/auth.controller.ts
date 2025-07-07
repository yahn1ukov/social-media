import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuth } from './decorators/local.decorator';
import { JwtAuth } from './decorators/jwt.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterDto,
  ) {
    return this.authService.register(res, dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @LocalAuth()
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req, res);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @JwtAuth()
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(req, res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @JwtAuth()
  async logout(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser('id') userId: string,
  ) {
    return this.authService.logout(res, userId);
  }
}
