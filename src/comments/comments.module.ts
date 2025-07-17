import { Module } from '@nestjs/common';

import { LikesModule } from '@/likes/likes.module';
import { CommentsController } from './controllers/comments.controller';
import { CommentsLikesController } from './controllers/comments-likes.controller';
import { CommentsRepository } from './comments.repository';
import { CommentsService } from './comments.service';

@Module({
  imports: [LikesModule],
  controllers: [CommentsController, CommentsLikesController],
  providers: [CommentsRepository, CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
