import { Injectable } from '@nestjs/common';

import { PostsRepository } from './posts.repository';
import { FilesService } from '@/files/files.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly filesService: FilesService,
  ) {}

  async createPost(
    authorId: string,
    dto: CreatePostDto,
    media?: Express.Multer.File[],
  ) {
    const post = await this.postsRepository.create(authorId, dto);

    if (media?.length) {
      await this.filesService.uploadPostMedia(post!.id, authorId, media);
    }
  }

  async getPosts(authorId?: string) {
    return this.postsRepository.getAll(authorId);
  }

  async getPost(id: string) {
    return this.postsRepository.getById(id);
  }

  async updatePost(
    id: string,
    authorId: string,
    dto: UpdatePostDto,
    media?: Express.Multer.File[],
  ) {
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
