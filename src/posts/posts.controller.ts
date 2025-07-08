import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
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
import { ParseOptionalUUIDPipe } from '@/shared/pipes/parse-optional-uuid.pipe';

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
  async getPosts(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('cursor', ParseOptionalUUIDPipe) cursor?: string,
  ) {
    return this.postsService.getPosts(limit, cursor);
  }

  @Get('me')
  async getCurrentUserPosts(
    @CurrentUser('id') authorId: string,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('cursor', ParseOptionalUUIDPipe) cursor?: string,
  ) {
    return this.postsService.getPosts(limit, cursor, authorId);
  }

  @Get(':authorId')
  @Public()
  async getUserPosts(
    @Param('authorId', ParseUUIDPipe) authorId: string,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('cursor', ParseOptionalUUIDPipe) cursor?: string,
  ) {
    return this.postsService.getPosts(limit, cursor, authorId);
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
