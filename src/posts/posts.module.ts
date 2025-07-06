import { Module } from '@nestjs/common';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { ParseMediaPipe } from './pipes/parse-media.pipe';

@Module({
  controllers: [PostsController],
  providers: [PostsService, ParseMediaPipe],
})
export class PostsModule {}
