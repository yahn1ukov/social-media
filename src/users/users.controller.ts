import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuth } from '@/auth/decorators/jwt.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { ParseAvatarPipe } from './pipes/parse-avatar.pipe';
import { UsersService } from './users.service';

@Controller('users')
@JwtAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getCurrentUser(@CurrentUser('sub') userId: string) {
    return await this.usersService.getUserProfile(userId);
  }

  @Public()
  @Get(':userId')
  async getUserById(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.usersService.getUserProfile(userId);
  }

  @Patch('me/password')
  async updateCurrentUserPassword(
    @CurrentUser('sub') userId: string,
    @Body() passwordDto: UpdateUserPasswordDto,
  ) {
    return await this.usersService.updateUserPassword(userId, passwordDto);
  }

  @Patch('me')
  @UseInterceptors(FileInterceptor('avatarFile'))
  async updateCurrentUserProfile(
    @CurrentUser('sub') userId: string,
    @Body() updateDto: UpdateUserDto,
    @UploadedFile(ParseAvatarPipe) avatarFile?: Express.Multer.File,
  ) {
    return await this.usersService.updateUserProfile(
      userId,
      updateDto,
      avatarFile,
    );
  }

  @Delete('me')
  async deleteCurrentUser(@CurrentUser('sub') userId: string) {
    return await this.usersService.deleteUser(userId);
  }
}
