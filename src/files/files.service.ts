import { Injectable } from '@nestjs/common';

import { FilesRepository } from './files.repository';
import { MinioService } from '@/shared/minio/minio.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly filesRepository: FilesRepository,
    private readonly minioService: MinioService,
  ) {}

  async uploadProfileAvatar(userId: string, avatar: Express.Multer.File) {
    const filePath = `users/${userId}/avatars/${Date.now()}-${avatar.originalname}`;

    const oldAvatar = await this.filesRepository.findByUserId(userId);
    if (oldAvatar) {
      await this.minioService.remove(oldAvatar.url);
      await this.filesRepository.deleteById(oldAvatar.id);
    }

    await this.minioService.upload(filePath, avatar);
    await this.filesRepository.create(filePath, avatar, { userId });
  }

  async uploadPostMedia(postId: string, userId: string, media: Express.Multer.File[]) {
    await Promise.all(
      media.map(async (file) => {
        const filePath = `users/${userId}/posts/${postId}/media/${Date.now()}-${file.originalname}`;

        await this.minioService.upload(filePath, file);
        await this.filesRepository.create(filePath, file, { postId });
      }),
    );
  }

  async deleteProfileFiles(userId: string) {
    const files = await this.filesRepository.findAllByUserIdOrPostAuthorId(userId);
    if (!files.length) return;

    const urls = files.map((file) => file.url);

    await this.minioService.removeMany(urls);
  }

  async deletePostMedia(postId: string) {
    const files = await this.filesRepository.findAllByPostId(postId);
    if (!files.length) return;

    const urls = files.map((file) => file.url);

    await this.minioService.removeMany(urls);
  }

  async deletePostMediaByIds(ids: string[], postId: string) {
    if (!ids.length) return;

    const files = await this.filesRepository.findAllByIdsAndPostId(ids, postId);
    if (!files.length) return;

    const urls = files.map((file) => file.url);

    await this.minioService.removeMany(urls);
    await this.filesRepository.deleteAllByIds(ids);
  }
}
