import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '@/prisma/prisma.service';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string) {
    return await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        refreshToken: true,
        password: true,
      },
    });
  }

  async findByUsername(username: string) {
    return await this.prismaService.user.findUnique({
      where: { username },
      select: {
        id: true,
        password: true,
      },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    try {
      return await this.prismaService.user.create({
        data,
        select: { id: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('User already exists');
        }
      }

      throw new InternalServerErrorException('Error creating user');
    }
  }

  async getById(id: string) {
    try {
      return await this.prismaService.user.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          avatarUrl: true,
          displayName: true,
          username: true,
          bio: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
      }

      throw new InternalServerErrorException('Error getting user');
    }
  }

  async updateById(id: string, data: Prisma.UserUpdateInput) {
    try {
      await this.prismaService.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('User already exists');
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
      }

      throw new InternalServerErrorException('Error updating user');
    }
  }

  async updatePasswordById(id: string, dto: UpdateUserPasswordDto) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Incorrect password');
    }

    const hashed = await bcrypt.hash(dto.newPassword, 8);

    try {
      await this.prismaService.user.update({
        where: { id },
        data: { password: hashed },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update password');
    }
  }

  async updateRefreshTokenById(id: string, refreshToken: string | null) {
    try {
      await this.prismaService.user.update({
        where: { id },
        data: { refreshToken },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
      }

      throw new InternalServerErrorException('Error updating refresh token');
    }
  }

  async deleteById(id: string) {
    try {
      await this.prismaService.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
      }

      throw new InternalServerErrorException('Error deleting user');
    }
  }
}
