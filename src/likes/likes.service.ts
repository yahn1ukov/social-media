import { Injectable } from '@nestjs/common';

import { LikesRepository } from './likes.repository';
import { CursorPaginationDto } from '@/shared/dto/cursor-pagination.dto';

@Injectable()
export class LikesService {
  constructor(private readonly likesRepository: LikesRepository) {}

  async likePost(userId: string, postId: string) {
    return this.likesRepository.create(userId, { postId });
  }

  async likeComment(userId: string, commentId: string) {
    return this.likesRepository.create(userId, { commentId });
  }

  async getLikedPosts(userId: string, dto: CursorPaginationDto) {
    return this.likesRepository.findAllPostsByLikesUserId(userId, dto.limit, dto.cursor);
  }

  async unlikePost(userId: string, postId: string) {
    return this.likesRepository.deleteByUserIdAndPostId(userId, postId);
  }

  async unlikeComment(userId: string, commentId: string) {
    return this.likesRepository.deleteByUserIdAndCommentId(userId, commentId);
  }
}
