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
import { FilesService } from '@/files/files.service';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly filesService: FilesService,
  ) {}

  async findById(id: string) {
    return await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        refreshToken: true,
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
      this.handleError(error);
    }
  }

  async getById(id: string) {
    try {
      return await this.prismaService.user.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          avatar: {
            select: { url: true },
          },
          displayName: true,
          username: true,
          bio: true,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateById(
    id: string,
    data: Prisma.UserUpdateInput,
    avatar?: Express.Multer.File,
  ) {
    try {
      await this.prismaService.user.update({
        where: { id },
        data,
      });

      if (avatar) {
        await this.filesService.uploadAvatarByUserId(id, avatar);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async updatePasswordById(id: string, dto: UpdateUserPasswordDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: { password: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatch = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new BadRequestException('Incorrect password');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 8);

    try {
      await this.prismaService.user.update({
        where: { id },
        data: { password: hashedPassword },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateRefreshTokenById(id: string, refreshToken: string | null) {
    try {
      await this.prismaService.user.update({
        where: { id },
        data: { refreshToken },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteById(id: string) {
    try {
      const files = await this.prismaService.file.findMany({
        where: {
          OR: [{ userId: id }, { post: { authorId: id } }],
        },
        select: { url: true },
      });

      if (files.length) {
        await Promise.all(
          files.map((file) => {
            return this.filesService.deleteMediaByUrl(file.url);
          }),
        );
      }

      await this.prismaService.user.delete({
        where: { id },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new ConflictException('User already exists');
        case 'P2025':
          throw new NotFoundException('User not found');
        default:
          throw new InternalServerErrorException('Database error occurred');
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequestException('Invalid data provided');
    }

    if (
      error instanceof BadRequestException ||
      error instanceof ConflictException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }

    throw new InternalServerErrorException('Failed to process User');
  }
}
