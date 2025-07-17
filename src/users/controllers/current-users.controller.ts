import { Controller, Get, Patch, Delete, Body, UseInterceptors, UploadedFile } from '@nestjs/common';

import { JwtAuth } from '@/auth/decorators/jwt.decorator';
import { UsersService } from '../users.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { UpdateUserPasswordDto } from '../dto/update-user-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ParseAvatarPipe } from '../pipes/parse-avatar.pipe';

@Controller('users/me')
@JwtAuth()
export class CurrentUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getCurrentUserProfile(@CurrentUser('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Patch('password')
  async updateCurrentUserPassword(@CurrentUser('username') username: string, @Body() dto: UpdateUserPasswordDto) {
    return this.usersService.updatePassword(username, dto);
  }

  @Patch()
  @UseInterceptors(FileInterceptor('avatar'))
  async updateCurrentUserProfile(
    @CurrentUser('id') id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile(ParseAvatarPipe) avatar?: Express.Multer.File,
  ) {
    return this.usersService.updateProfile(id, dto, avatar);
  }

  @Delete()
  async deleteCurrentUserProfile(@CurrentUser('id') id: string) {
    return this.usersService.deleteProfile(id);
  }
}
