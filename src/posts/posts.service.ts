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

  async create(data: Prisma.PostCreateInput) {
    try {
      await this.prismaService.post.create({ data });
    } catch (error) {
      throw new InternalServerErrorException('Error creating a post');
    }
  }

  async getAll() {
    try {
      return await this.prismaService.post.findMany({
        select: {
          id: true,
          text: true,
          hashtags: true,
          createdAt: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error getting all posts');
    }
  }

  async getById(id: string) {
    try {
      return await this.prismaService.post.findUnique({
        where: { id },
        select: {
          id: true,
          text: true,
          hashtags: true,
          createdAt: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Post not found`);
        }
      }

      throw new InternalServerErrorException('Error getting the post');
    }
  }

  async updateById(id: string, data: Prisma.PostUpdateInput) {
    try {
      await this.prismaService.post.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Post not found`);
        }
      }

      throw new InternalServerErrorException('Error updating post');
    }
  }

  async deleteById(id: string) {
    try {
      await this.prismaService.post.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Post not found`);
        }
      }

      throw new InternalServerErrorException('Error deleting post');
    }
  }
}
