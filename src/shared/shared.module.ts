import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Minio from 'minio';

import { AppConfigService } from './config/app-config.service';
import { PrismaService } from './prisma/prisma.service';
import { MINIO_TOKEN } from './minio/decorators/inject-minio.decorator';
import { MinioRepository } from './minio/minio.repository';

@Module({})
export class SharedModule {
  static forRoot(): DynamicModule {
    return {
      module: SharedModule,
      imports: [ConfigModule.forRoot({ cache: true })],
      providers: [
        AppConfigService,
        PrismaService,
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
        MinioRepository,
      ],
      exports: [AppConfigService, PrismaService, MinioRepository],
      global: true,
    };
  }
}
