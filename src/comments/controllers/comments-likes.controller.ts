import { Controller, Delete, Param, ParseUUIDPipe, Post } from '@nestjs/common';

import { JwtAuth } from '@/auth/decorators/jwt.decorator';
import { LikesService } from '@/likes/likes.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Controller('comments/:id/likes')
@JwtAuth()
export class CommentsLikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  async likeComment(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) commentId: string) {
    return this.likesService.likeComment(userId, commentId);
  }

  @Delete()
  async unlikeComment(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) commentId: string) {
    return this.likesService.unlikeComment(userId, commentId);
  }
}
