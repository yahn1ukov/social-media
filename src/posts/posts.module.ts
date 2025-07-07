import { Module } from '@nestjs/common';

import { FilesModule } from '@/files/files.module';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { ParseMediaPipe } from './pipes/parse-media.pipe';

@Module({
  imports: [FilesModule],
  controllers: [PostsController],
  providers: [PostsRepository, PostsService, ParseMediaPipe],
})
export class PostsModule {}
