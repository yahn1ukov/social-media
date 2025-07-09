import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class CommentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    authorId: string,
    postId: string,
    data: Omit<Prisma.CommentCreateInput, 'author' | 'post'>,
  ) {
    try {
      await this.prismaService.comment.create({
        data: {
          ...data,
          author: { connect: { id: authorId } },
          post: { connect: { id: postId } },
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getAllByPostId(postId: string, limit: number, cursor?: string) {
    try {
      await this.prismaService.comment.findMany({
        where: { postId },
        select: {
          id: true,
          text: true,
          author: {
            select: {
              avatar: { select: { url: true } },
              username: true,
            },
          },
          _count: { select: { likes: true } },
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        ...(cursor && {
          cursor: { id: cursor },
          skip: 1,
        }),
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateByIdAndAuthorIdAndPostId(
    id: string,
    authorId: string,
    postId: string,
    data: Prisma.CommentUpdateInput,
  ) {
    try {
      await this.prismaService.comment.update({
        where: { id, authorId, postId },
        data,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async deleteByIdAndAuthorIdAndPostId(
    id: string,
    authorId: string,
    postId: string,
  ) {
    try {
      await this.prismaService.comment.delete({
        where: { id, authorId, postId },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          throw new NotFoundException('User or Post not found');
        default:
          throw new InternalServerErrorException('Database error occurred');
      }
    }

    throw new InternalServerErrorException('Operation failed');
  }
}
