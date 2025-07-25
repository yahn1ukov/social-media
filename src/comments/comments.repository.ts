import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { BaseRepository } from '@/shared/prisma/base.repository';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CreateCommentOptions } from './interfaces/create-comment-options.interface';

@Injectable()
export class CommentsRepository extends BaseRepository {
  private readonly selectOptions = {
    id: true,
    text: true,
    author: { select: { id: true, username: true, avatar: { select: { url: true } } } },
    _count: { select: { replies: true, likes: true } },
    createdAt: true,
  };

  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async create(authorId: string, data: Omit<Prisma.CommentCreateInput, 'author'>, options: CreateCommentOptions) {
    const { postId, parentId } = options;

    try {
      await this.prismaService.comment.create({
        data: {
          ...data,
          author: { connect: { id: authorId } },
          ...(postId && { post: { connect: { id: postId } } }),
          ...(parentId && { parent: { connect: { id: parentId } } }),
        },
      });
    } catch (error) {
      this.handlePrismaError(error, 'Comment');
    }
  }

  async getById(id: string) {
    try {
      return await this.prismaService.comment.findUniqueOrThrow({ where: { id }, select: this.selectOptions });
    } catch (error) {
      this.handlePrismaError(error, 'Comment');
    }
  }

  async findAllByPostId(postId: string, limit: number, cursor?: string) {
    return this.findManyWithCursor({ postId }, limit, cursor);
  }

  async findAllByParentId(parentId: string, limit: number, cursor?: string) {
    return this.findManyWithCursor({ parentId }, limit, cursor);
  }

  async updateByIdAndAuthorId(id: string, authorId: string, data: Prisma.CommentUpdateInput) {
    try {
      await this.prismaService.comment.update({ where: { id, authorId }, data });
    } catch (error) {
      this.handlePrismaError(error, 'Comment');
    }
  }

  async deleteByIdAndAuthorId(id: string, authorId: string) {
    try {
      await this.prismaService.comment.delete({ where: { id, OR: [{ authorId }, { post: { authorId } }] } });
    } catch (error) {
      this.handlePrismaError(error, 'Comment');
    }
  }

  private async findManyWithCursor(where: Prisma.CommentWhereInput, limit: number, cursor?: string) {
    try {
      return await this.prismaService.comment.findMany({
        where,
        select: this.selectOptions,
        orderBy: { createdAt: 'desc' },
        take: limit,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      });
    } catch (error) {
      this.handlePrismaError(error, 'Comment');
    }
  }
}
