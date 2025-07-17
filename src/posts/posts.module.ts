import { Module } from '@nestjs/common';

import { FilesModule } from '@/files/files.module';
import { CommentsModule } from '@/comments/comments.module';
import { LikesModule } from '@/likes/likes.module';
import { PostsController } from './controllers/posts.controller';
import { PostsCommentsController } from './controllers/posts-comments.controller';
import { PostsLikesController } from './controllers/posts-likes.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { ParseMediaPipe } from './pipes/parse-media.pipe';

@Module({
  imports: [FilesModule, CommentsModule, LikesModule],
  controllers: [PostsController, PostsCommentsController, PostsLikesController],
  providers: [PostsRepository, PostsService, ParseMediaPipe],
  exports: [PostsService],
})
export class PostsModule {}
