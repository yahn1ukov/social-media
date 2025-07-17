import { Module } from '@nestjs/common';

import { LikesRepository } from './likes.repository';
import { LikesService } from './likes.service';

@Module({
  providers: [LikesRepository, LikesService],
  exports: [LikesService],
})
export class LikesModule {}
