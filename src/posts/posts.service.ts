import { Injectable } from '@nestjs/common';

import { PostsRepository } from './posts.repository';
import { FilesService } from '@/files/files.service';
import { LikesService } from '@/likes/likes.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CursorPaginationDto } from '@/shared/dto/cursor-pagination.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly filesService: FilesService,
    private readonly likesService: LikesService,
  ) {}

  async createPost(authorId: string, dto: CreatePostDto, media?: Express.Multer.File[]) {
    const post = await this.postsRepository.create(authorId, dto);

    if (media?.length) {
      await this.filesService.uploadPostMedia(post!.id, authorId, media);
    }
  }

  async getPost(id: string) {
    return this.postsRepository.getById(id);
  }

  async getPosts(dto: CursorPaginationDto) {
    return this.postsRepository.findAll(dto.limit, dto.cursor);
  }

  async getUserPosts(authorId: string, dto: CursorPaginationDto) {
    return this.postsRepository.findAllByAuthorId(authorId, dto.limit, dto.cursor);
  }

  async getLikedPosts(authorId: string, dto: CursorPaginationDto) {
    return this.likesService.getLikedPosts(authorId, dto);
  }

  async getFeedPosts(authorId: string, dto: CursorPaginationDto) {
    return this.postsRepository.findAllByAuthorFollowersFollowerId(authorId, dto.limit, dto.cursor);
  }

  async updatePost(id: string, authorId: string, dto: UpdatePostDto, media?: Express.Multer.File[]) {
    const { deletedMediaIds, ...data } = dto;

    await this.postsRepository.updateByIdAndAuthorId(id, authorId, data);

    if (deletedMediaIds?.length) {
      await this.filesService.deletePostMediaByIds(deletedMediaIds, id);
    }

    if (media?.length) {
      await this.filesService.uploadPostMedia(id, authorId, media);
    }
  }

  async deletePost(id: string, authorId: string) {
    await this.filesService.deletePostMedia(id);
    await this.postsRepository.deleteByIdAndAuthorId(id, authorId);
  }
}
