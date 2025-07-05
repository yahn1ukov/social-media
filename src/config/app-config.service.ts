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

  get s3AccessKey() {
    return this.configService.get<string>('S3_ACCESS_KEY', '');
  }

  get s3SecretKey() {
    return this.configService.get<string>('S3_SECRET_KEY', '');
  }

  get s3Endpoint() {
    return this.configService.get<string>('S3_ENDPOINT', 'localhost');
  }

  get s3Port() {
    return this.configService.get<number>('S3_PORT', 9000);
  }

  get s3Bucket() {
    return this.configService.get<string>('S3_BUCKET', '');
  }

  get s3Region() {
    return this.configService.get<string>('S3_REGION', '');
  }

  get s3UseSSL() {
    const isUseSSL = this.configService.get<string>('S3_USE_SSL', 'false');
    return isUseSSL === 'true';
  }
}
