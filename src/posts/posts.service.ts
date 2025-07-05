import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { FilesService } from '@/files/files.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly filesService: FilesService,
  ) {}

  async create(
    userId: string,
    data: Omit<Prisma.PostCreateInput, 'author'>,
    media?: Array<Express.Multer.File>,
  ) {
    try {
      const post = await this.prismaService.post.create({
        data: {
          ...data,
          author: {
            connect: { id: userId },
          },
        },
        select: { id: true },
      });

      if (media?.length) {
        await Promise.all(
          media.map((file) =>
            this.filesService.uploadMediaByPostIdAndUserId(
              post.id,
              userId,
              file,
            ),
          ),
        );
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async getAll(userId?: string) {
    const where: Prisma.PostWhereInput = userId ? { authorId: userId } : {};

    try {
      return await this.prismaService.post.findMany({
        where,
        select: {
          id: true,
          text: true,
          hashtags: true,
          author: {
            select: {
              avatar: {
                select: { url: true },
              },
              username: true,
            },
          },
          files: {
            select: {
              id: true,
              contentType: true,
              url: true,
            },
          },
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async getById(id: string) {
    try {
      return await this.prismaService.post.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          text: true,
          hashtags: true,
          author: {
            select: {
              avatar: {
                select: { url: true },
              },
              username: true,
            },
          },
          files: {
            select: {
              id: true,
              contentType: true,
              url: true,
            },
          },
          createdAt: true,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateById(
    id: string,
    userId: string,
    data: Prisma.PostUpdateInput,
    media?: Array<Express.Multer.File>,
    deletedMediaIds?: string[],
  ) {
    try {
      await this.prismaService.post.update({
        where: {
          id,
          authorId: userId,
        },
        data,
      });

      if (deletedMediaIds?.length) {
        await this.filesService.deleteMediaByIds(id, deletedMediaIds);
      }

      if (media?.length) {
        await Promise.all(
          media.map((file) =>
            this.filesService.uploadMediaByPostIdAndUserId(id, userId, file),
          ),
        );
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteById(id: string, userId: string) {
    try {
      const files = await this.prismaService.file.findMany({
        where: { postId: id },
        select: { url: true },
      });

      if (files.length) {
        await Promise.all(
          files.map((file) => {
            return this.filesService.deleteMediaByUrl(file.url);
          }),
        );
      }

      await this.prismaService.post.delete({
        where: {
          id,
          authorId: userId,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          throw new NotFoundException('Post not found');
        default:
          throw new InternalServerErrorException('Database error occurred');
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequestException('Invalid data provided');
    }

    if (
      error instanceof BadRequestException ||
      error instanceof ConflictException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }

    throw new InternalServerErrorException('Failed to process Post');
  }
}
