import { Controller, Delete, Param, ParseUUIDPipe, Post } from '@nestjs/common';

import { JwtAuth } from '@/auth/decorators/jwt.decorator';
import { LikesService } from '@/likes/likes.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Controller('posts/:id/likes')
@JwtAuth()
export class PostsLikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  async likePost(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) postId: string) {
    return this.likesService.likePost(userId, postId);
  }

  @Delete()
  async unlikePost(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) postId: string) {
    return this.likesService.unlikePost(userId, postId);
  }
}
