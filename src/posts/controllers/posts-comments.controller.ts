import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';

import { JwtAuth } from '@/auth/decorators/jwt.decorator';
import { CommentsService } from '@/comments/comments.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { CreateCommentDto } from '@/comments/dto/create-comment.dto';
import { Public } from '@/auth/decorators/public.decorator';
import { CursorPaginationDto } from '@/shared/dto/cursor-pagination.dto';

@Controller('posts/:id/comments')
@JwtAuth()
export class PostsCommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async createPostComment(
    @CurrentUser('id') authorId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(authorId, id, dto);
  }

  @Get()
  @Public()
  async getPostComments(@Param('id', ParseUUIDPipe) id: string, @Query() dto: CursorPaginationDto) {
    return this.commentsService.getPostComments(id, dto);
  }
}
