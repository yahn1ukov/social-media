import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { FilesModule } from '@/files/files.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ParseAvatarPipe } from './pipes/parse-avatar.pipe';

@Module({
  imports: [PrismaModule, FilesModule],
  controllers: [UsersController],
  providers: [UsersService, ParseAvatarPipe],
  exports: [UsersService],
})
export class UsersModule {}
