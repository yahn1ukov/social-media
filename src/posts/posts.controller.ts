import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // @Post()
  // async create(@Body() createPostDto: CreatePostDto) {
  //   return await this.postsService.create(createPostDto);
  // }

  @Get()
  async getAll() {
    return await this.postsService.getAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.postsService.getById(id);
  }

  @Patch(':id')
  async updateById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postsService.updateById(id, updatePostDto);
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.postsService.deleteById(id);
  }
}
