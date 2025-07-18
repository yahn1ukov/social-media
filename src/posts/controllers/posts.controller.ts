import { Body, Controller, Delete, Get, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { JwtAuth } from '@/auth/decorators/jwt.decorator';
import { PostsService } from '../posts.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { CreatePostDto } from '../dto/create-post.dto';
import { ParseMediaPipe } from '../pipes/parse-media.pipe';
import { Public } from '@/auth/decorators/public.decorator';
import { CursorPaginationDto } from '@/shared/dto/cursor-pagination.dto';
import { ParamUUID } from '@/shared/decorators/param-uuid.decorator';
import { UpdatePostDto } from '../dto/update-post.dto';

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
  async getPosts(@Query() dto: CursorPaginationDto) {
    return this.postsService.getPosts(dto);
  }

  @Get(':id')
  @Public()
  async getPost(@ParamUUID('id') id: string) {
    return this.postsService.getPost(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('media', 10))
  async updatePost(
    @CurrentUser('id') authorId: string,
    @ParamUUID('id') id: string,
    @Body() dto: UpdatePostDto,
    @UploadedFiles(ParseMediaPipe) media?: Express.Multer.File[],
  ) {
    return this.postsService.updatePost(id, authorId, dto, media);
  }

  @Delete(':id')
  async deletePost(@CurrentUser('id') authorId: string, @ParamUUID('id') id: string) {
    return this.postsService.deletePost(id, authorId);
  }
}
