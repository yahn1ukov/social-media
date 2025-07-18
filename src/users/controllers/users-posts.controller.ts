import { Controller, Get, Query } from '@nestjs/common';

import { PostsService } from '@/posts/posts.service';
import { ParamUUID } from '@/shared/decorators/param-uuid.decorator';
import { CursorPaginationDto } from '@/shared/dto/cursor-pagination.dto';

@Controller('users/:id/posts')
export class UsersPostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getUserPosts(@ParamUUID('id') id: string, @Query() dto: CursorPaginationDto) {
    return this.postsService.getUserPosts(id, dto);
  }
}
