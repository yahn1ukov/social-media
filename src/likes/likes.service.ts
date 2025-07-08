import { Injectable } from '@nestjs/common';

import { LikesRepository } from './likes.repository';

@Injectable()
export class LikesService {
  constructor(private readonly likesRepository: LikesRepository) {}

  async likePost(userId: string, postId: string) {
    return this.likesRepository.create(userId, postId);
  }

  async unlikePost(userId: string, postId: string) {
    return this.likesRepository.delete(userId, postId);
  }
}
