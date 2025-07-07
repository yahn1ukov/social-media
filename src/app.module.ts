import { Module } from '@nestjs/common';

import { SharedModule } from './shared/shared.module';
import { FilesModule } from './files/files.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    SharedModule.forRoot(),
    FilesModule,
    UsersModule,
    AuthModule,
    PostsModule,
  ],
})
export class AppModule {}
