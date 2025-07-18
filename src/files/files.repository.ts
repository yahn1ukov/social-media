import { Injectable } from '@nestjs/common';

import { BaseRepository } from '@/shared/prisma/base.repository';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CreateFileOptions } from './interfaces/create-file-options.interface';

@Injectable()
export class FilesRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async create(filePath: string, file: Express.Multer.File, options: CreateFileOptions) {
    const { userId, postId } = options;

    try {
      await this.prismaService.file.create({
        data: {
          name: file.originalname,
          size: file.size,
          contentType: file.mimetype,
          url: filePath,
          ...(userId && { user: { connect: { id: userId } } }),
          ...(postId && { post: { connect: { id: postId } } }),
        },
      });
    } catch (error) {
      this.handlePrismaError(error, 'File');
    }
  }

  async findByUserId(userId: string) {
    return this.prismaService.file.findUnique({ where: { userId }, select: { id: true, url: true } });
  }

  async findAllByPostId(postId: string) {
    return this.prismaService.file.findMany({ where: { postId }, select: { url: true } });
  }

  async findAllByUserIdOrPostAuthorId(userId: string) {
    return this.prismaService.file.findMany({
      where: { OR: [{ userId }, { post: { authorId: userId } }] },
      select: { url: true },
    });
  }

  async findAllByIdsAndPostId(ids: string[], postId: string) {
    return this.prismaService.file.findMany({ where: { id: { in: ids }, postId }, select: { url: true } });
  }

  async deleteById(id: string) {
    try {
      await this.prismaService.file.delete({ where: { id } });
    } catch (error) {
      this.handlePrismaError(error, 'File');
    }
  }

  async deleteAllByIds(ids: string[]) {
    try {
      await this.prismaService.file.deleteMany({ where: { id: { in: ids } } });
    } catch (error) {
      this.handlePrismaError(error, 'File');
    }
  }
}
