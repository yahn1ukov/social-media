import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';

import { JwtAuth } from '@/auth/decorators/jwt.decorator';
import { CommentsService } from '../comments.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Public } from '@/auth/decorators/public.decorator';
import { CursorPaginationDto } from '@/shared/dto/cursor-pagination.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Controller('comments')
@JwtAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':id/replies')
  async createCommentReply(
    @CurrentUser('id') authorId: string,
    @Param('id', ParseUUIDPipe) parentId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.createReply(parentId, authorId, dto);
  }

  @Get(':id/replies')
  @Public()
  async getCommentReplies(@Param('id', ParseUUIDPipe) parentId: string, @Query() dto: CursorPaginationDto) {
    return this.commentsService.getCommentReplies(parentId, dto);
  }

  @Get(':id')
  @Public()
  async getComment(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.getComment(id);
  }

  @Patch(':id')
  async updateComment(
    @CurrentUser('id') authorId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(id, authorId, dto);
  }

  @Delete(':id')
  async deleteComment(@CurrentUser('id') authorId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.deleteComment(id, authorId);
  }
}
