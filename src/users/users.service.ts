import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { FilesService } from '@/files/files.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly filesService: FilesService,
    private readonly prismaService: PrismaService,
  ) {}

  async findUserById(userId: string) {
    return await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { id: true, refreshToken: true },
    });
  }

  async findUserByUsername(username: string) {
    return await this.prismaService.user.findUnique({
      where: { username },
      select: { id: true, password: true },
    });
  }

  async createUser(userData: Prisma.UserCreateInput) {
    try {
      return await this.prismaService.user.create({
        data: userData,
        select: { id: true },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async getUserProfile(userId: string) {
    try {
      return await this.prismaService.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          id: true,
          avatar: { select: { url: true } },
          displayName: true,
          username: true,
          bio: true,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateUserProfile(
    userId: string,
    updateData: Prisma.UserUpdateInput,
    avatarFile?: Express.Multer.File,
  ) {
    try {
      await this.prismaService.user.update({
        where: { id: userId },
        data: updateData,
      });

      if (avatarFile) {
        await this.filesService.uploadUserAvatar(userId, avatarFile);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateUserPassword(userId: string, passwordDto: UpdateUserPasswordDto) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
        select: { password: true },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(
        passwordDto.oldPassword,
        user.password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException('Incorrect password');
      }

      const hashedPassword = await bcrypt.hash(passwordDto.newPassword, 10);

      await this.prismaService.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    try {
      await this.prismaService.user.update({
        where: { id: userId },
        data: { refreshToken },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteUser(userId: string) {
    try {
      const userFiles = await this.prismaService.file.findMany({
        where: { OR: [{ userId: userId }, { post: { authorId: userId } }] },
        select: { url: true },
      });

      if (userFiles.length) {
        const fileUrls = userFiles.map((file) => file.url);
        await this.filesService.deleteFiles(fileUrls);
      }

      await this.prismaService.user.delete({ where: { id: userId } });
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

    if (error instanceof NotFoundException || BadRequestException) {
      throw error;
    }

    throw new InternalServerErrorException('Operation failed');
  }
}
