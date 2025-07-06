import { Module } from '@nestjs/common';
import * as Minio from 'minio';

import { MINIO_TOKEN } from './decorators/inject-minio.decorator';
import { AppConfigService } from '@/config/app-config.service';
import { MinioService } from './minio.service';

@Module({
  providers: [
    {
      provide: MINIO_TOKEN,
      useFactory: (configService: AppConfigService) =>
        new Minio.Client({
          accessKey: configService.s3AccessKey,
          secretKey: configService.s3SecretKey,
          endPoint: configService.s3Endpoint,
          port: configService.s3Port,
          region: configService.s3Region,
          useSSL: configService.s3UseSSL,
        }),
      inject: [AppConfigService],
    },
    MinioService,
  ],
  exports: [MinioService],
})
export class MinioModule {}
