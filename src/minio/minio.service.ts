import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import * as Minio from 'minio';

import { AppConfigService } from '@/config/app-config.service';
import { InjectMinio } from './decorators/inject-minio.decorator';

@Injectable()
export class MinioService implements OnModuleInit {
  constructor(
    private readonly configService: AppConfigService,
    @InjectMinio() private readonly minioClient: Minio.Client,
  ) {}

  async onModuleInit() {
    try {
      const isBucketExists = await this.minioClient.bucketExists(
        this.configService.s3Bucket,
      );
      if (!isBucketExists) {
        await this.minioClient.makeBucket(
          this.configService.s3Bucket,
          this.configService.s3Region,
        );
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to make MinIO bucket');
    }
  }

  async upload(filename: string, file: Express.Multer.File) {
    try {
      await this.minioClient.putObject(
        this.configService.s3Bucket,
        filename,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype },
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async remove(filename: string) {
    try {
      await this.minioClient.removeObject(
        this.configService.s3Bucket,
        filename,
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete file');
    }
  }
}
