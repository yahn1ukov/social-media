import { Module } from '@nestjs/common';

import { AppConfigModule } from './config/app-config.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    AppConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    PostsModule,
  ],
})
export class AppModule {}
