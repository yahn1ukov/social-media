import { Injectable } from '@nestjs/common';

import { LikesRepository } from './likes.repository';

@Injectable()
export class LikesService {
  constructor(private readonly likesRepository: LikesRepository) {}

  async likePost(userId: string, postId: string) {
    return this.likesRepository.create(userId, postId);
  }

  async likeComment(userId: string, commentId: string) {
    return this.likesRepository.create(userId, commentId);
  }

  async unlikePost(userId: string, postId: string) {
    return this.likesRepository.deleteByUserIdAndPostId(userId, postId);
  }

  async unlikeComment(userId: string, commentId: string) {
    return this.likesRepository.deleteByUserIdAndCommentId(userId, commentId);
  }
}
