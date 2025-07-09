import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { JwtAuth } from '@/auth/decorators/jwt.decorator';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import { ParseOptionalUUIDPipe } from '@/shared/pipes/parse-optional-uuid.pipe';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
@JwtAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('posts/:postId')
  async createComment(
    @CurrentUser('id') authorId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(authorId, postId, dto);
  }

  @Get('posts/:postId')
  @Public()
  async getComments(
    @Param('postId') postId: string,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('cursor', ParseOptionalUUIDPipe) cursor?: string,
  ) {
    return this.commentsService.getComments(postId, limit, cursor);
  }

  @Patch(':id/posts/:postId')
  async updateComment(
    @CurrentUser('id') authorId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(id, authorId, postId, dto);
  }

  @Delete(':id/posts/:postId')
  async deleteComment(
    @CurrentUser('id') authorId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    return this.commentsService.deleteComment(id, authorId, postId);
  }
}
