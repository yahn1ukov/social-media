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
import { ParseMediaPipe } from './pipes/parse-media.pipe';
import { Public } from '@/auth/decorators/public.decorator';
import { UpdatePostDto } from './dto/update-post.dto';

@JwtAuth()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('media', 10))
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePostDto,
    @UploadedFiles(ParseMediaPipe) media?: Array<Express.Multer.File>,
  ) {
    return await this.postsService.create(userId, dto, media);
  }

  @Public()
  @Get()
  async getAll() {
    return await this.postsService.getAll();
  }

  @Get('me')
  async getAllByUserId(@CurrentUser('id') userId: string) {
    return await this.postsService.getAll(userId);
  }

  @Public()
  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.postsService.getById(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('media', 10))
  async updateById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdatePostDto,
    @UploadedFiles(ParseMediaPipe) media?: Array<Express.Multer.File>,
  ) {
    const { deletedMediaIds, ...updatedPost } = dto;

    return await this.postsService.updateById(
      id,
      userId,
      updatedPost,
      media,
      deletedMediaIds,
    );
  }

  @Delete(':id')
  async deleteById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return await this.postsService.deleteById(id, userId);
  }
}
