import { Module } from '@nestjs/common';

import { FilesModule } from '@/files/files.module';
import { PostsModule } from '@/posts/posts.module';
import { FollowsModule } from '@/follows/follows.module';
import { UsersController } from './controllers/users.controller';
import { CurrentUsersController } from './controllers/current-users.controller';
import { UsersPostsController } from './controllers/users-posts.controller';
import { CurrentUsersPostsController } from './controllers/current-users-posts.controller';
import { UsersFollowsController } from './controllers/users-follows.controller';
import { CurrentUsersFollowsController } from './controllers/current-users-follows.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { ParseAvatarPipe } from './pipes/parse-avatar.pipe';

@Module({
  imports: [FilesModule, PostsModule, FollowsModule],
  controllers: [
    UsersController,
    CurrentUsersController,
    UsersPostsController,
    CurrentUsersPostsController,
    UsersFollowsController,
    CurrentUsersFollowsController,
  ],
  providers: [UsersRepository, UsersService, ParseAvatarPipe],
  exports: [UsersService],
})
export class UsersModule {}
