import { Injectable } from '@nestjs/common';

import { FilesRepository } from './files.repository';
import { MinioRepository } from '@/shared/minio/minio.repository';

@Injectable()
export class FilesService {
  constructor(
    private readonly filesRepository: FilesRepository,
    private readonly minioRepository: MinioRepository,
  ) {}

  async uploadProfileAvatar(userId: string, avatar: Express.Multer.File) {
    const filePath = `users/${userId}/avatars/${Date.now()}-${avatar.originalname}`;

    const oldAvatar = await this.filesRepository.findByUserId(userId);
    if (oldAvatar) {
      await this.minioRepository.delete(oldAvatar.url);
      await this.filesRepository.deleteById(oldAvatar.id);
    }

    await this.minioRepository.upload(filePath, avatar);
    await this.filesRepository.create({
      name: avatar.originalname,
      size: avatar.size,
      contentType: avatar.mimetype,
      url: filePath,
      user: { connect: { id: userId } },
    });
  }

  async uploadPostMedia(
    postId: string,
    userId: string,
    media: Express.Multer.File[],
  ) {
    await Promise.all(
      media.map(async (file) => {
        const filePath = `users/${userId}/posts/${postId}/media/${Date.now()}-${file.originalname}`;

        await this.minioRepository.upload(filePath, file);
        await this.filesRepository.create({
          name: file.originalname,
          size: file.size,
          contentType: file.mimetype,
          url: filePath,
          post: { connect: { id: postId } },
        });
      }),
    );
  }

  async deleteProfileFiles(userId: string) {
    const files = await this.filesRepository.findManyByUserId(userId);
    if (!files.length) return;

    const urls = files.map((file) => file.url);

    await this.minioRepository.deleteMany(urls);
  }

  async deletePostMedia(postId: string) {
    const files = await this.filesRepository.findManyByPostId(postId);
    if (!files.length) return;

    const urls = files.map((file) => file.url);

    await this.minioRepository.deleteMany(urls);
  }

  async deletePostMediaByIds(ids: string[], postId: string) {
    if (!ids.length) return;

    const files = await this.filesRepository.findManyByIdsAndPostId(
      ids,
      postId,
    );
    if (!files.length) return;

    const urls = files.map((file) => file.url);

    await this.minioRepository.deleteMany(urls);
    await this.filesRepository.deleteManyByIds(ids);
  }
}
