import { Module } from '@nestjs/common';

import { PostsController } from './posts.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostsController],
  providers: [PrismaService, PostsService],
})
export class PostsModule {}
