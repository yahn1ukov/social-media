import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { FilesService } from '@/files/files.service';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PostsService {
  private readonly postSelectOptions = {
    id: true,
    text: true,
    hashtags: true,
    author: {
      select: {
        avatar: { select: { url: true } },
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
  };

  constructor(
    private readonly filesService: FilesService,
    private readonly prismaService: PrismaService,
  ) {}

  async createPost(
    userId: string,
    postData: Omit<Prisma.PostCreateInput, 'author'>,
    mediaFiles?: Express.Multer.File[],
  ) {
    try {
      const post = await this.prismaService.post.create({
        data: {
          ...postData,
          author: { connect: { id: userId } },
        },
        select: { id: true },
      });

      if (mediaFiles?.length) {
        await this.filesService.uploadPostMedia(post.id, userId, mediaFiles);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async getAllPosts(authorId?: string) {
    try {
      return await this.prismaService.post.findMany({
        where: authorId ? { authorId } : {},
        select: this.postSelectOptions,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async getPostById(postId: string) {
    try {
      return await this.prismaService.post.findUniqueOrThrow({
        where: { id: postId },
        select: this.postSelectOptions,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async updatePost(
    postId: string,
    authorId: string,
    updateData: Prisma.PostUpdateInput,
    newMedia?: Express.Multer.File[],
    deletedMediaIds?: string[],
  ) {
    try {
      await this.prismaService.post.update({
        where: { id: postId, authorId },
        data: updateData,
      });

      if (deletedMediaIds?.length) {
        await this.filesService.deleteMediaFiles(postId, deletedMediaIds);
      }

      if (newMedia?.length) {
        await this.filesService.uploadPostMedia(postId, authorId, newMedia);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async deletePost(postId: string, authorId: string) {
    try {
      const postFiles = await this.prismaService.file.findMany({
        where: { postId },
        select: { url: true },
      });

      if (postFiles.length) {
        const fileUrls = postFiles.map((file) => file.url);
        await this.filesService.deleteFiles(fileUrls);
      }

      await this.prismaService.post.delete({
        where: { id: postId, authorId },
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

    throw new InternalServerErrorException('Operation failed');
  }
}
