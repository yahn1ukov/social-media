import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class FilesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByUserId(userId: string) {
    return this.prismaService.file.findUnique({
      where: { userId },
      select: { id: true, url: true },
    });
  }

  async findManyByUserId(userId: string) {
    return this.prismaService.file.findMany({
      where: { OR: [{ userId }, { post: { authorId: userId } }] },
      select: { url: true },
    });
  }

  async findManyByPostId(postId: string) {
    return this.prismaService.file.findMany({
      where: { postId },
      select: { url: true },
    });
  }

  async findManyByIdsAndPostId(ids: string[], postId: string) {
    return this.prismaService.file.findMany({
      where: { id: { in: ids }, postId },
      select: { url: true },
    });
  }

  async create(data: Prisma.FileCreateInput) {
    try {
      await this.prismaService.file.create({ data });
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteById(id: string) {
    try {
      await this.prismaService.file.delete({ where: { id } });
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteManyByIds(ids: string[]) {
    try {
      await this.prismaService.file.deleteMany({ where: { id: { in: ids } } });
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    throw new InternalServerErrorException('Operation failed');
  }
}
