import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { MinioService } from '@/minio/minio.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly minioService: MinioService,
  ) {}

  async uploadAvatarByUserId(userId: string, file: Express.Multer.File) {
    try {
      const oldFile = await this.prismaService.file.findUnique({
        where: { userId },
        select: {
          id: true,
          url: true,
        },
      });

      const filename = `users/${userId}/avatars/${Date.now()}-${file.originalname}`;

      await this.minioService.upload(filename, file);

      await this.prismaService.file.create({
        data: {
          name: file.originalname,
          size: file.size,
          contentType: file.mimetype,
          url: filename,
          user: {
            connect: { id: userId },
          },
        },
      });

      if (oldFile) {
        await this.minioService.remove(oldFile.url);
        await this.prismaService.file.delete({
          where: { id: oldFile.id },
        });
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload avatar');
    }
  }

  async uploadMediaByPostIdAndUserId(
    postId: string,
    userId: string,
    file: Express.Multer.File,
  ) {
    try {
      const filename = `users/${userId}/posts/${postId}/media/${Date.now()}-${file.originalname}`;

      await this.minioService.upload(filename, file);

      await this.prismaService.file.create({
        data: {
          name: file.originalname,
          size: file.size,
          contentType: file.mimetype,
          url: filename,
          post: {
            connect: { id: postId },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload media');
    }
  }

  async deleteMediaByIds(postId: string, fileIds: string[]) {
    if (!fileIds.length) {
      return;
    }

    try {
      const files = await this.prismaService.file.findMany({
        where: {
          id: { in: fileIds },
          postId: postId,
        },
        select: {
          id: true,
          url: true,
        },
      });

      if (files.length) {
        await Promise.all(
          files.map((file) => this.minioService.remove(file.url)),
        );

        await this.prismaService.file.deleteMany({
          where: {
            id: {
              in: files.map((f) => f.id),
            },
          },
        });
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete media files');
    }
  }

  async deleteMediaByUrl(filename: string) {
    try {
      await this.minioService.remove(filename);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete media files');
    }
  }
}
