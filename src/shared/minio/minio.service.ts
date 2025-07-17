import { Injectable } from '@nestjs/common';

import { MinioRepository } from './minio.repository';

@Injectable()
export class MinioService {
  constructor(private readonly minioRepository: MinioRepository) {}

  async upload(objectName: string, file: Express.Multer.File) {
    return this.minioRepository.upload(objectName, file);
  }

  async remove(objectName: string) {
    return this.minioRepository.remove(objectName);
  }

  async removeMany(objectNames: string[]) {
    return this.minioRepository.removeMany(objectNames);
  }
}
