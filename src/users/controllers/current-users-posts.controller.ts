import { Controller, Get, Query } from '@nestjs/common';

import { JwtAuth } from '@/auth/decorators/jwt.decorator';
import { PostsService } from '@/posts/posts.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { CursorPaginationDto } from '@/shared/dto/cursor-pagination.dto';

@Controller('users/me/posts')
@JwtAuth()
export class CurrentUsersPostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/feed')
  async getCurrentUserFeed(@CurrentUser('id') id: string, @Query() dto: CursorPaginationDto) {
    return this.postsService.getFeedPosts(id, dto);
  }

  @Get('/likes')
  async getCurrentUserLikedPosts(@CurrentUser('id') id: string, @Query() dto: CursorPaginationDto) {
    return this.postsService.getLikedPosts(id, dto);
  }

  @Get()
  async getCurrentUserPosts(@CurrentUser('id') id: string, @Query() dto: CursorPaginationDto) {
    return this.postsService.getUserPosts(id, dto);
  }
}
