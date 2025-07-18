import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { BaseRepository } from '@/shared/prisma/base.repository';
import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class UsersRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async create(data: Prisma.UserCreateInput) {
    try {
      return await this.prismaService.user.create({ data, select: { id: true, username: true } });
    } catch (error) {
      this.handlePrismaError(error, 'User');
    }
  }

  async getById(id: string) {
    try {
      return await this.prismaService.user.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          avatar: { select: { url: true } },
          displayName: true,
          username: true,
          email: true,
          bio: true,
          phoneNumber: true,
          _count: { select: { posts: true, followers: true, following: true } },
        },
      });
    } catch (error) {
      this.handlePrismaError(error, 'User');
    }
  }

  async findById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
      select: { id: true, username: true, refreshToken: true },
    });
  }

  async findByUsername(username: string) {
    return this.prismaService.user.findUnique({
      where: { username },
      select: { id: true, username: true, password: true },
    });
  }

  async findByUsernameOrEmail(identifier: string) {
    return this.prismaService.user.findFirst({
      where: { OR: [{ username: identifier }, { email: identifier }] },
      select: { id: true, username: true, password: true },
    });
  }

  async updateById(id: string, data: Prisma.UserUpdateInput) {
    try {
      await this.prismaService.user.update({ where: { id }, data });
    } catch (error) {
      this.handlePrismaError(error, 'User');
    }
  }

  async deleteById(id: string) {
    try {
      await this.prismaService.user.delete({ where: { id } });
    } catch (error) {
      this.handlePrismaError(error, 'User');
    }
  }
}
