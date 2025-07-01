import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [PrismaService, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
