import { Controller, Delete, Param, ParseUUIDPipe, Post } from '@nestjs/common';

import { JwtAuth } from '@/auth/decorators/jwt.decorator';
import { LikesService } from './likes.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Controller('likes')
@JwtAuth()
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('posts/:postId')
  async likePost(
    @CurrentUser('id') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    return this.likesService.likePost(userId, postId);
  }

  @Post('comments/:commentId')
  async likeComment(
    @CurrentUser('id') userId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    return this.likesService.likeComment(userId, commentId);
  }

  @Delete('posts/:postId')
  async unlikePost(
    @CurrentUser('id') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    return this.likesService.unlikePost(userId, postId);
  }

  @Delete('comments/:commentId')
  async unlikeComment(
    @CurrentUser('id') userId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    return this.likesService.unlikeComment(userId, commentId);
  }
}
