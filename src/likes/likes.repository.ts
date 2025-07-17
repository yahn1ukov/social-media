import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/shared/prisma/prisma.service';
import { CreateLikeOptions } from './interfaces/create-like-options.interface';

@Injectable()
export class LikesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, options: CreateLikeOptions) {
    const { postId, commentId } = options;

    try {
      await this.prismaService.like.create({
        data: {
          user: { connect: { id: userId } },
          ...(postId && { post: { connect: { id: postId } } }),
          ...(commentId && { comment: { connect: { id: commentId } } }),
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async deleteByUserIdAndPostId(userId: string, postId: string) {
    try {
      await this.prismaService.like.delete({ where: { userId_postId: { userId, postId } } });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async deleteByUserIdAndCommentId(userId: string, commentId: string) {
    try {
      await this.prismaService.like.delete({ where: { userId_commentId: { userId, commentId } } });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new ConflictException('Post or Comment already liked or unliked');
        case 'P2025':
          throw new NotFoundException('User/Post/Comment not found');
        default:
          throw new InternalServerErrorException('Database error occurred');
      }
    }

    throw new InternalServerErrorException('Operation failed');
  }
}
