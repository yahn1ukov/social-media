import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuth } from '@/auth/decorators/jwt.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ParseMediaPipe } from './pipes/parse-media.pipe';
import { PostsService } from './posts.service';

@Controller('posts')
@JwtAuth()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('media', 10))
  async createPost(
    @CurrentUser('sub') authorId: string,
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles(ParseMediaPipe) mediaFiles?: Express.Multer.File[],
  ) {
    return await this.postsService.createPost(
      authorId,
      createPostDto,
      mediaFiles,
    );
  }

  @Public()
  @Get()
  async getAllPosts() {
    return await this.postsService.getAllPosts();
  }

  @Get('me')
  async getCurrentUserPosts(@CurrentUser('sub') authorId: string) {
    return await this.postsService.getAllPosts(authorId);
  }

  @Public()
  @Get(':postId')
  async getPostById(@Param('postId', ParseUUIDPipe) postId: string) {
    return await this.postsService.getPostById(postId);
  }

  @Patch(':postId')
  @UseInterceptors(FilesInterceptor('media', 10))
  async updatePost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser('sub') authorId: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles(ParseMediaPipe) mediaFiles?: Express.Multer.File[],
  ) {
    const { deletedMediaIds, ...updateData } = updatePostDto;

    return await this.postsService.updatePost(
      postId,
      authorId,
      updateData,
      mediaFiles,
      deletedMediaIds,
    );
  }

  @Delete(':postId')
  async deletePost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser('sub') authorId: string,
  ) {
    return await this.postsService.deletePost(postId, authorId);
  }
}
