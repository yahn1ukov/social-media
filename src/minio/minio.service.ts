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
      const bucketName = this.configService.s3Bucket;
      const region = this.configService.s3Region;

      const bucketExists = await this.minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(bucketName, region);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to initialize MinIO bucket',
      );
    }
  }

  async uploadFile(objectName: string, file: Express.Multer.File) {
    try {
      await this.minioClient.putObject(
        this.configService.s3Bucket,
        objectName,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype },
      );
    } catch (error) {
      throw new InternalServerErrorException(`Failed to upload file`);
    }
  }

  async deleteFile(objectName: string) {
    try {
      await this.minioClient.removeObject(
        this.configService.s3Bucket,
        objectName,
      );
    } catch (error) {
      throw new InternalServerErrorException(`Failed to delete file`);
    }
  }

  async deleteFiles(objectNames: string[]) {
    try {
      await Promise.all(
        objectNames.map((objectName) => this.deleteFile(objectName)),
      );
    } catch (error) {
      throw new InternalServerErrorException(`Failed to delete files`);
    }
  }
}
