import { Injectable } from '@nestjs/common';

import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CursorPaginationDto } from '@/shared/dto/cursor-pagination.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async createComment(authorId: string, postId: string, dto: CreateCommentDto) {
    return this.commentsRepository.create(authorId, dto, { postId });
  }

  async createReply(parentId: string, authorId: string, dto: CreateCommentDto) {
    return this.commentsRepository.create(authorId, dto, { parentId });
  }

  async getComment(id: string) {
    return this.commentsRepository.getById(id);
  }

  async getPostComments(postId: string, dto: CursorPaginationDto) {
    return this.commentsRepository.findAllByPostId(postId, dto.limit, dto.cursor);
  }

  async getCommentReplies(parentId: string, dto: CursorPaginationDto) {
    return this.commentsRepository.findAllByParentId(parentId, dto.limit, dto.cursor);
  }

  async updateComment(id: string, authorId: string, dto: UpdateCommentDto) {
    return this.commentsRepository.updateByIdAndAuthorId(id, authorId, dto);
  }

  async deleteComment(id: string, authorId: string) {
    return this.commentsRepository.deleteByIdAndAuthorId(id, authorId);
  }
}
