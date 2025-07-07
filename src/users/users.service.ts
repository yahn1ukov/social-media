import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersRepository } from './users.repository';
import { FilesService } from '@/files/files.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly filesService: FilesService,
  ) {}

  async getProfile(id: string) {
    return this.usersRepository.getById(id);
  }

  async updateProfile(
    id: string,
    dto: UpdateUserDto,
    avatar?: Express.Multer.File,
  ) {
    await this.usersRepository.updateById(id, dto);

    if (avatar) {
      await this.filesService.uploadProfileAvatar(id, avatar);
    }
  }

  async updatePassword(username: string, dto: UpdateUserPasswordDto) {
    const user = await this.usersRepository.findByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Incorrect password');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 8);

    await this.usersRepository.updateById(user.id, {
      password: hashedPassword,
    });
  }

  async deleteProfile(id: string) {
    await this.filesService.deleteProfileFiles(id);
    await this.usersRepository.deleteById(id);
  }
}
