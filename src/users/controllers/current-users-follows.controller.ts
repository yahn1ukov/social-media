import { Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';

import { JwtAuth } from '@/auth/decorators/jwt.decorator';
import { FollowsService } from '@/follows/follows.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { CursorPaginationDto } from '@/shared/dto/cursor-pagination.dto';

@Controller('users/me/follows')
@JwtAuth()
export class CurrentUsersFollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post()
  async followUser(@CurrentUser('id') id: string, @Param('id', ParseUUIDPipe) userId: string) {
    return this.followsService.followUser(id, userId);
  }

  @Get('/followers')
  async getCurrentUserFollowers(@CurrentUser('id') id: string, @Query() dto: CursorPaginationDto) {
    return this.followsService.getFollowers(id, dto);
  }

  @Get('/following')
  async getCurrentUserFollowing(@CurrentUser('id') id: string, @Query() dto: CursorPaginationDto) {
    return this.followsService.getFollowing(id, dto);
  }

  @Delete()
  async unfollowUser(@CurrentUser('id') id: string, @Param('id', ParseUUIDPipe) userId: string) {
    return this.followsService.unfollowUser(id, userId);
  }
}
