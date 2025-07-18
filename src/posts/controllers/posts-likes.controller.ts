import { Controller, Delete, Post } from '@nestjs/common';

import { JwtAuth } from '@/auth/decorators/jwt.decorator';
import { LikesService } from '@/likes/likes.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { ParamUUID } from '@/shared/decorators/param-uuid.decorator';

@Controller('posts/:id/likes')
@JwtAuth()
export class PostsLikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  async likePost(@CurrentUser('id') userId: string, @ParamUUID('id') postId: string) {
    return this.likesService.likePost(userId, postId);
  }

  @Delete()
  async unlikePost(@CurrentUser('id') userId: string, @ParamUUID('id') postId: string) {
    return this.likesService.unlikePost(userId, postId);
  }
}
