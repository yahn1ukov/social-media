import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import * as Minio from 'minio';

import { InjectMinio } from './decorators/inject-minio.decorator';
import { AppConfigService } from '../config/app-config.service';

@Injectable()
export class MinioRepository implements OnModuleInit {
  constructor(
    @InjectMinio() private readonly minioClient: Minio.Client,
    private readonly configService: AppConfigService,
  ) {}

  async onModuleInit() {
    try {
      const bucketExists = await this.minioClient.bucketExists(
        this.configService.s3Bucket,
      );
      if (!bucketExists) {
        await this.minioClient.makeBucket(
          this.configService.s3Bucket,
          this.configService.s3Region,
        );
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async upload(objectName: string, file: Express.Multer.File) {
    try {
      await this.minioClient.putObject(
        this.configService.s3Bucket,
        objectName,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype },
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(objectName: string) {
    try {
      await this.minioClient.removeObject(
        this.configService.s3Bucket,
        objectName,
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteMany(objectNames: string[]) {
    await Promise.all(objectNames.map((objectName) => this.delete(objectName)));
  }

  private handleError(error: any) {
    throw new InternalServerErrorException('Operation failed');
  }
}
