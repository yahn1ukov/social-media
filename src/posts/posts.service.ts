import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, data: Omit<Prisma.PostCreateInput, 'author'>) {
    try {
      await this.prismaService.post.create({
        data: {
          ...data,
          author: {
            connect: { id: userId },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Author not found');
        }
      }

      throw new InternalServerErrorException('Error creating a post');
    }
  }

  async getAll(userId?: string) {
    const where: Prisma.PostWhereInput = userId ? { authorId: userId } : {};

    return await this.prismaService.post.findMany({
      where,
      select: {
        id: true,
        text: true,
        hashtags: true,
        author: {
          select: {
            id: true,
            avatarUrl: true,
            username: true,
          },
        },
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
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
              id: true,
              avatarUrl: true,
              username: true,
            },
          },
          createdAt: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Post not found');
        }
      }

      throw new InternalServerErrorException('Error getting the post');
    }
  }

  async updateById(id: string, userId: string, data: Prisma.PostUpdateInput) {
    try {
      await this.prismaService.post.update({
        where: { id, authorId: userId },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Post not found');
        }
      }

      throw new InternalServerErrorException('Error updating post');
    }
  }

  async deleteById(id: string, userId: string) {
    try {
      await this.prismaService.post.delete({
        where: { id, authorId: userId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Post not found');
        }
      }

      throw new InternalServerErrorException('Error deleting post');
    }
  }
}
