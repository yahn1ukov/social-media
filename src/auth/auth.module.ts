import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AppConfigService } from '@/shared/config/app-config.service';
import { UsersModule } from '@/users/users.module';
import { AuthController } from './auth.controller';
import { TokenService } from './services/token.service';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: AppConfigService) => ({ secret: configService.jwtSecretKey }),
      inject: [AppConfigService],
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    TokenService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    LocalAuthGuard,
    JwtAuthGuard,
    JwtRefreshAuthGuard,
  ],
})
export class AuthModule {}
