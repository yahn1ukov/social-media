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

import { JwtAuth } from '@/auth/decorators/jwt.decorator';
import { UsersService } from './users.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseAvatarPipe } from './pipes/parse-avatar.pipe';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Controller('users')
@JwtAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getCurrentUser(@CurrentUser('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Get(':id')
  @Public()
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getProfile(id);
  }

  @Patch('me/password')
  async updateCurrentUserPassword(
    @CurrentUser('username') username: string,
    @Body() dto: UpdateUserPasswordDto,
  ) {
    return this.usersService.updatePassword(username, dto);
  }

  @Patch('me')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateCurrentUserProfile(
    @CurrentUser('id') id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile(ParseAvatarPipe) avatar?: Express.Multer.File,
  ) {
    return this.usersService.updateProfile(id, dto, avatar);
  }

  @Delete('me')
  async deleteCurrentUser(@CurrentUser('id') id: string) {
    return this.usersService.deleteProfile(id);
  }
}
