import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { MinioService } from '@/minio/minio.service';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly minioService: MinioService,
    private readonly prismaService: PrismaService,
  ) {}

  async uploadUserAvatar(userId: string, avatarFile: Express.Multer.File) {
    const filePath = `users/${userId}/avatars/${Date.now()}-${avatarFile.originalname}`;

    try {
      const avatar = await this.prismaService.file.findUnique({
        where: { userId },
        select: { id: true, url: true },
      });

      await this.minioService.uploadFile(filePath, avatarFile);
      await this.prismaService.file.create({
        data: {
          name: avatarFile.originalname,
          size: avatarFile.size,
          contentType: avatarFile.mimetype,
          url: filePath,
          user: { connect: { id: userId } },
        },
      });

      if (avatar) {
        await this.minioService.deleteFile(avatar.url);
        await this.prismaService.file.delete({
          where: { id: avatar.id },
        });
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload avatar');
    }
  }

  async uploadPostMedia(
    postId: string,
    userId: string,
    mediaFiles: Express.Multer.File[],
  ) {
    try {
      await Promise.all(
        mediaFiles.map(async (file) => {
          const filePath = `users/${userId}/posts/${postId}/media/${Date.now()}-${file.originalname}`;

          await this.minioService.uploadFile(filePath, file);
          await this.prismaService.file.create({
            data: {
              name: file.originalname,
              size: file.size,
              contentType: file.mimetype,
              url: filePath,
              post: { connect: { id: postId } },
            },
          });
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload media files');
    }
  }

  async deleteMediaFiles(postId: string, fileIds: string[]) {
    if (!fileIds.length) return;

    try {
      const files = await this.prismaService.file.findMany({
        where: {
          id: { in: fileIds },
          postId: postId,
        },
        select: { url: true },
      });

      if (!files.length) return;

      const urls = files.map((file) => file.url);

      await this.deleteFiles(urls);
      await this.prismaService.file.deleteMany({
        where: { id: { in: fileIds } },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete media files');
    }
  }

  async deleteFiles(urls: string[]) {
    if (!urls.length) return;

    try {
      await this.minioService.deleteFiles(urls);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete files');
    }
  }
}
