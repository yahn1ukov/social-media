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

import { JwtAuth } from '@/auth/decorators/jwt.decorator';
import { PostsService } from './posts.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { Public } from '@/auth/decorators/public.decorator';
import { UpdatePostDto } from './dto/update-post.dto';
import { ParseMediaPipe } from './pipes/parse-media.pipe';

@Controller('posts')
@JwtAuth()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('media', 10))
  async createPost(
    @CurrentUser('id') authorId: string,
    @Body() dto: CreatePostDto,
    @UploadedFiles(ParseMediaPipe) media?: Express.Multer.File[],
  ) {
    return this.postsService.createPost(authorId, dto, media);
  }

  @Get()
  @Public()
  async getPosts() {
    return this.postsService.getPosts();
  }

  @Get('me')
  async getCurrentUserPosts(@CurrentUser('id') authorId: string) {
    return this.postsService.getPosts(authorId);
  }

  @Get(':id')
  @Public()
  async getPostById(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.getPost(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('media', 10))
  async updatePost(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') authorId: string,
    @Body() dto: UpdatePostDto,
    @UploadedFiles(ParseMediaPipe) media?: Express.Multer.File[],
  ) {
    return this.postsService.updatePost(id, authorId, dto, media);
  }

  @Delete(':id')
  async deletePost(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') authorId: string,
  ) {
    return this.postsService.deletePost(id, authorId);
  }
}
