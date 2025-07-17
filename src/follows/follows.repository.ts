import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class FollowsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(followerId: string, followingId: string) {
    try {
      await this.prismaService.follow.create({
        data: {
          follower: { connect: { id: followerId } },
          following: { connect: { id: followingId } },
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAllByFollowerId(followerId: string, limit: number, cursor?: string) {
    return this.findFollowConnectionsWithCursor({ followerId }, 'following', limit, cursor);
  }

  async findAllByFollowingId(followingId: string, limit: number, cursor?: string) {
    return this.findFollowConnectionsWithCursor({ followingId }, 'follower', limit, cursor);
  }

  async deleteByFollowerIdAndFollowingId(followerId: string, followingId: string) {
    try {
      await this.prismaService.follow.delete({
        where: { followerId_followingId: { followerId, followingId } },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private async findFollowConnectionsWithCursor(
    where: Prisma.FollowWhereInput,
    key: 'follower' | 'following',
    limit: number,
    cursor?: string,
  ) {
    try {
      return await this.prismaService.follow.findMany({
        where,
        select: {
          [key]: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: { select: { url: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          throw new NotFoundException('User not found');
        default:
          throw new InternalServerErrorException('Database error occurred');
      }
    }

    throw new InternalServerErrorException('Operation failed');
  }
}
