import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get isDev(): boolean {
    return this.configService.get('NODE_ENV', '') === 'development';
  }

  get port(): number {
    return +this.configService.get('PORT', 0);
  }

  get jwtTokenType(): string {
    return this.configService.get('JWT_TOKEN_TYPE', '');
  }

  get jwtSecretKey(): string {
    return this.configService.get('JWT_SECRET_KEY', '');
  }

  get jwtAccessExpiresIn(): number {
    return +this.configService.get('JWT_ACCESS_EXPIRES_IN', 0);
  }

  get jwtRefreshExpiresIn(): number {
    return +this.configService.get('JWT_REFRESH_EXPIRES_IN', 0);
  }

  get cookieDomain(): string {
    return this.configService.get('COOKIE_DOMAIN', '');
  }

  get s3AccessKey(): string {
    return this.configService.get('S3_ACCESS_KEY', '');
  }

  get s3SecretKey(): string {
    return this.configService.get('S3_SECRET_KEY', '');
  }

  get s3Endpoint(): string {
    return this.configService.get('S3_ENDPOINT', '');
  }

  get s3Port(): number {
    return +this.configService.get('S3_PORT', 0);
  }

  get s3Bucket(): string {
    return this.configService.get('S3_BUCKET', '');
  }

  get s3Region(): string {
    return this.configService.get('S3_REGION', '');
  }

  get s3UseSSL(): boolean {
    return this.configService.get<string>('S3_USE_SSL', '') === 'true';
  }
}
