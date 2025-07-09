import { Injectable } from '@nestjs/common';

import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async createComment(authorId: string, postId: string, dto: CreateCommentDto) {
    return this.commentsRepository.create(authorId, postId, dto);
  }

  async getComments(postId: string, limit: number, cursor?: string) {
    limit = limit > 0 ? limit : 12;

    return this.commentsRepository.getAllByPostId(postId, limit, cursor);
  }

  async updateComment(
    id: string,
    authorId: string,
    postId: string,
    dto: UpdateCommentDto,
  ) {
    return this.commentsRepository.updateByIdAndAuthorIdAndPostId(
      id,
      authorId,
      postId,
      dto,
    );
  }

  async deleteComment(id: string, authorId: string, postId: string) {
    return this.commentsRepository.deleteByIdAndAuthorIdAndPostId(
      id,
      authorId,
      postId,
    );
  }
}
