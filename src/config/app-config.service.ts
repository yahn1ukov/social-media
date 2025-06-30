import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get isDev() {
    const env = this.configService.get<string>('NODE_ENV', 'development');
    return env === 'development';
  }

  get port() {
    return this.configService.get<number>('PORT', 3000);
  }

  get secretKey() {
    return this.configService.get<string>('JWT_SECRET_KEY', '');
  }

  get accessExpiresIn() {
    return this.configService.get<number>('JWT_ACCESS_EXPIRES_IN', 0);
  }

  get refreshExpiresIn() {
    return this.configService.get<number>('JWT_REFRESH_EXPIRES_IN', 0);
  }

  get cookieDomain() {
    return this.configService.get<string>('COOKIE_DOMAIN', 'localhost');
  }
}
