import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from './prisma.service';

@Injectable()
export abstract class BaseRepository {
  constructor(protected readonly prismaService: PrismaService) {}

  protected handlePrismaError(error: any, entityName: string = 'Entity') {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new ConflictException(`A record with this value already exists.`);
        case 'P2025':
          throw new NotFoundException(`${entityName} not found`);
        default:
          throw new InternalServerErrorException('Database error occurred');
      }
    }

    throw new InternalServerErrorException('An unexpected error occurred');
  }
}
