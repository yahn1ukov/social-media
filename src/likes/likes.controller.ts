import { Controller, Delete, Param, ParseUUIDPipe, Post } from '@nestjs/common';

import { JwtAuth } from '@/auth/decorators/jwt.decorator';
import { LikesService } from './likes.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Controller('likes')
@JwtAuth()
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':postId')
  async likePost(
    @CurrentUser('id') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    return this.likesService.likePost(userId, postId);
  }

  @Delete(':postId')
  async unlikePost(
    @CurrentUser('id') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    return this.likesService.unlikePost(userId, postId);
  }
}
