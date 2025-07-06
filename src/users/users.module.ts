import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ParseAvatarPipe } from './pipes/parse-avatar.pipe';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ParseAvatarPipe],
  exports: [UsersService],
})
export class UsersModule {}
