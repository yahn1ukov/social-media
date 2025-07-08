import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class LikesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, postId: string) {
    try {
      await this.prismaService.like.create({
        data: {
          user: { connect: { id: userId } },
          post: { connect: { id: postId } },
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(userId: string, postId: string) {
    try {
      await this.prismaService.like.delete({
        where: { userId_postId: { userId, postId } },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new ConflictException('Post already liked or unliked');
        case 'P2025':
          throw new NotFoundException('User or Post not found');
        default:
          throw new InternalServerErrorException('Database error occurred');
      }
    }

    throw new InternalServerErrorException('Operation failed');
  }
}
