import { Injectable } from '@nestjs/common';

import { FollowsRepository } from './follows.repository';
import { CursorPaginationDto } from '@/shared/dto/cursor-pagination.dto';

@Injectable()
export class FollowsService {
  constructor(private readonly followsRepository: FollowsRepository) {}

  async followUser(followerId: string, followingId: string) {
    return this.followsRepository.create(followerId, followingId);
  }

  async getFollowers(followerId: string, dto: CursorPaginationDto) {
    return this.followsRepository.findAllByFollowerId(followerId, dto.limit, dto.cursor);
  }

  async getFollowing(followingId: string, dto: CursorPaginationDto) {
    return this.followsRepository.findAllByFollowingId(followingId, dto.limit, dto.cursor);
  }

  async unfollowUser(followerId: string, followingId: string) {
    return this.followsRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
  }
}
