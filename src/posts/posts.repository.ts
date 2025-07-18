import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { BaseRepository } from '@/shared/prisma/base.repository';
import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class PostsRepository extends BaseRepository {
  private readonly selectOptions = {
    id: true,
    text: true,
    hashtags: true,
    author: { select: { avatar: { select: { url: true } }, username: true } },
    files: { select: { id: true, contentType: true, url: true } },
    _count: { select: { likes: true, comments: true } },
    createdAt: true,
  };

  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async create(authorId: string, data: Omit<Prisma.PostCreateInput, 'author'>) {
    try {
      return await this.prismaService.post.create({
        data: { ...data, author: { connect: { id: authorId } } },
        select: { id: true },
      });
    } catch (error) {
      this.handlePrismaError(error, 'Post');
    }
  }

  async getById(id: string) {
    try {
      return await this.prismaService.post.findUniqueOrThrow({ where: { id }, select: this.selectOptions });
    } catch (error) {
      this.handlePrismaError(error, 'Post');
    }
  }

  async findAll(limit: number, cursor?: string) {
    return this.findManyWithCursor(limit, cursor);
  }

  async findAllByAuthorId(authorId: string, limit: number, cursor?: string) {
    return this.findManyWithCursor(limit, cursor, { authorId });
  }

  async findAllByAuthorFollowersFollowerId(userId: string, limit: number, cursor?: string) {
    return this.findManyWithCursor(limit, cursor, { author: { followers: { some: { followerId: userId } } } });
  }

  async updateByIdAndAuthorId(id: string, authorId: string, data: Prisma.PostUpdateInput) {
    try {
      await this.prismaService.post.update({ where: { id, authorId }, data });
    } catch (error) {
      this.handlePrismaError(error, 'Post');
    }
  }

  async deleteByIdAndAuthorId(id: string, authorId: string) {
    try {
      await this.prismaService.post.delete({ where: { id, authorId } });
    } catch (error) {
      this.handlePrismaError(error, 'Post');
    }
  }

  private async findManyWithCursor(limit: number, cursor?: string, where: Prisma.PostWhereInput = {}) {
    try {
      return await this.prismaService.post.findMany({
        where,
        select: this.selectOptions,
        orderBy: { createdAt: 'desc' },
        take: limit,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      });
    } catch (error) {
      this.handlePrismaError(error, 'Post');
    }
  }
}
