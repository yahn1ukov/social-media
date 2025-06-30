import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string) {
    return await this.prismaService.user.findUnique({
      where: { id },
      select: { id: true, refreshToken: true },
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

  async updateRefreshToken(id: string, refreshToken: string | null) {
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
}
