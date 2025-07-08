import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

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

  async create(data: Prisma.UserCreateInput) {
    try {
      return await this.prismaService.user.create({
        data,
        select: { id: true, username: true },
      });
    } catch (error) {
      this.handlePrismaError(error);
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
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateById(id: string, data: Prisma.UserUpdateInput) {
    try {
      await this.prismaService.user.update({ where: { id }, data });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async deleteById(id: string) {
    try {
      await this.prismaService.user.delete({ where: { id } });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new ConflictException('Username or email already exists');
        case 'P2025':
          throw new NotFoundException('User not found');
        default:
          throw new InternalServerErrorException('Database error occurred');
      }
    }

    throw new InternalServerErrorException('Operation failed');
  }
}
