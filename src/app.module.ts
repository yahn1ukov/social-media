import { Module } from '@nestjs/common';

import { SharedModule } from './shared/shared.module';
import { FilesModule } from './files/files.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { FollowsModule } from './follows/follows.module';

@Module({
  imports: [
    SharedModule.forRoot(),
    FilesModule,
    UsersModule,
    AuthModule,
    PostsModule,
    LikesModule,
    CommentsModule,
    FollowsModule,
  ],
})
export class AppModule {}
