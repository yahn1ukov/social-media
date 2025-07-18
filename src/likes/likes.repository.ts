import { Injectable } from '@nestjs/common';

import { BaseRepository } from '@/shared/prisma/base.repository';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CreateLikeOptions } from './interfaces/create-like-options.interface';

@Injectable()
export class LikesRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

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
      this.handlePrismaError(error, 'Like');
    }
  }

  async findAllPostsByLikesUserId(userId: string, limit: number, cursor?: string) {
    try {
      return this.prismaService.like.findMany({
        where: { userId, postId: { not: null } },
        select: {
          id: true,
          post: {
            select: {
              id: true,
              text: true,
              hashtags: true,
              author: { select: { avatar: { select: { url: true } }, username: true } },
              files: { select: { id: true, contentType: true, url: true } },
              _count: { select: { likes: true, comments: true } },
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      });
    } catch (error) {
      this.handlePrismaError(error, 'Like');
    }
  }

  async deleteByUserIdAndPostId(userId: string, postId: string) {
    try {
      await this.prismaService.like.delete({ where: { userId_postId: { userId, postId } } });
    } catch (error) {
      this.handlePrismaError(error, 'Like');
    }
  }

  async deleteByUserIdAndCommentId(userId: string, commentId: string) {
    try {
      await this.prismaService.like.delete({ where: { userId_commentId: { userId, commentId } } });
    } catch (error) {
      this.handlePrismaError(error, 'Like');
    }
  }
}
