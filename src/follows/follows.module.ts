import { Module } from '@nestjs/common';

import { FollowsService } from './follows.service';
import { FollowsRepository } from './follows.repository';

@Module({
  providers: [FollowsRepository, FollowsService],
  exports: [FollowsService],
})
export class FollowsModule {}
