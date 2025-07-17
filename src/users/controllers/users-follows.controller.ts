import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';

import { FollowsService } from '@/follows/follows.service';
import { CursorPaginationDto } from '@/shared/dto/cursor-pagination.dto';

@Controller('users/:id/follows')
export class UsersFollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Get('/followers')
  async getUserFollowers(@Param('id', ParseUUIDPipe) id: string, @Query() dto: CursorPaginationDto) {
    return this.followsService.getFollowers(id, dto);
  }

  @Get('/following')
  async getUserFollowing(@Param('id', ParseUUIDPipe) id: string, @Query() dto: CursorPaginationDto) {
    return this.followsService.getFollowing(id, dto);
  }
}
