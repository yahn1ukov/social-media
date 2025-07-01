import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { JwtAuth } from '@/auth/decorators/jwt.decorator';
import { PostsService } from './posts.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Public } from '@/auth/decorators/public.decorator';

@JwtAuth()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(
    @CurrentUser('id') userId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return await this.postsService.create(userId, createPostDto);
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
  async updateById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postsService.updateById(id, userId, updatePostDto);
  }

  @Delete(':id')
  async deleteById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return await this.postsService.deleteById(id, userId);
  }
}
