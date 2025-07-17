import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';

import { PostsService } from '@/posts/posts.service';
import { CursorPaginationDto } from '@/shared/dto/cursor-pagination.dto';

@Controller('users/:id/posts')
export class UsersPostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getUserPosts(@Param('id', ParseUUIDPipe) id: string, @Query() dto: CursorPaginationDto) {
    return this.postsService.getUserPosts(id, dto);
  }
}
