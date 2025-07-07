import { Module } from '@nestjs/common';

import { FilesModule } from '@/files/files.module';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { ParseAvatarPipe } from './pipes/parse-avatar.pipe';

@Module({
  imports: [FilesModule],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService, ParseAvatarPipe],
  exports: [UsersRepository],
})
export class UsersModule {}
