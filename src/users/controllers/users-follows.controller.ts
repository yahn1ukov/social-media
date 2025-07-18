import { Controller, Get, Query } from '@nestjs/common';

import { FollowsService } from '@/follows/follows.service';
import { ParamUUID } from '@/shared/decorators/param-uuid.decorator';
import { CursorPaginationDto } from '@/shared/dto/cursor-pagination.dto';

@Controller('users/:id/follows')
export class UsersFollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Get('/followers')
  async getUserFollowers(@ParamUUID('id') id: string, @Query() dto: CursorPaginationDto) {
    return this.followsService.getFollowers(id, dto);
  }

  @Get('/following')
  async getUserFollowing(@ParamUUID('id') id: string, @Query() dto: CursorPaginationDto) {
    return this.followsService.getFollowing(id, dto);
  }
}
