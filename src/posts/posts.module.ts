import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { FilesModule } from '@/files/files.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { ParseMediaPipe } from './pipes/parse-media.pipe';

@Module({
  imports: [PrismaModule, FilesModule],
  controllers: [PostsController],
  providers: [PostsService, ParseMediaPipe],
})
export class PostsModule {}
