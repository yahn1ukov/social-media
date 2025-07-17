import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersRepository } from './users.repository';
import { FilesService } from '@/files/files.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateRefreshTokenDto } from './dto/update-refresh-token.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly filesService: FilesService,
  ) {}

  async createProfile(dto: CreateUserDto) {
    return this.usersRepository.create(dto);
  }

  async getProfile(id: string) {
    return this.usersRepository.getById(id);
  }

  async findById(id: string) {
    return this.usersRepository.findById(id);
  }

  async findByUsernameOrEmail(identifier: string) {
    return this.usersRepository.findByUsernameOrEmail(identifier);
  }

  async updateProfile(id: string, dto: UpdateUserDto, avatar?: Express.Multer.File) {
    await this.usersRepository.updateById(id, dto);

    if (avatar) {
      await this.filesService.uploadProfileAvatar(id, avatar);
    }
  }

  async updateRefreshToken(id: string, dto: UpdateRefreshTokenDto) {
    await this.usersRepository.updateById(id, dto);
  }

  async updatePassword(username: string, dto: UpdateUserPasswordDto) {
    const user = await this.usersRepository.findByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Incorrect password');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 8);
    await this.usersRepository.updateById(user.id, { password: hashedPassword });
  }

  async deleteProfile(id: string) {
    await this.filesService.deleteProfileFiles(id);
    await this.usersRepository.deleteById(id);
  }
}
