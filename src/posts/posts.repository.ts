import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class PostsRepository {
  private readonly selectOptions = {
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
    _count: { select: { likes: true } },
    createdAt: true,
  };

  constructor(private readonly prismaService: PrismaService) {}

  async create(authorId: string, data: Omit<Prisma.PostCreateInput, 'author'>) {
    try {
      return await this.prismaService.post.create({
        data: {
          ...data,
          author: { connect: { id: authorId } },
        },
        select: { id: true },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async getAll(limit: number, cursor?: string, authorId?: string) {
    try {
      return await this.prismaService.post.findMany({
        where: authorId ? { authorId } : {},
        select: this.selectOptions,
        orderBy: { createdAt: 'desc' },
        take: limit,
        ...(cursor && {
          cursor: { id: cursor },
          skip: 1,
        }),
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async getById(id: string) {
    try {
      return await this.prismaService.post.findUniqueOrThrow({
        where: { id },
        select: this.selectOptions,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateByIdAndAuthorId(
    id: string,
    authorId: string,
    data: Prisma.PostUpdateInput,
  ) {
    try {
      await this.prismaService.post.update({ where: { id, authorId }, data });
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteByIdAndAuthorId(id: string, authorId: string) {
    try {
      await this.prismaService.post.delete({ where: { id, authorId } });
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
