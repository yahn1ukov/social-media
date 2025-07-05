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
import { Public } from '@/auth/decorators/public.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseAvatarPipe } from './pipes/parse-avatar.pipe';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@JwtAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getById(@CurrentUser('id') id: string) {
    return await this.usersService.getById(id);
  }

  @Public()
  @Get(':id')
  async getByUserId(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.getById(id);
  }

  @Patch('me/password')
  async updatePasswordById(
    @CurrentUser('id') id: string,
    @Body() dto: UpdateUserPasswordDto,
  ) {
    return await this.usersService.updatePasswordById(id, dto);
  }

  @Patch('me')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateById(
    @CurrentUser('id') id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile(ParseAvatarPipe) avatar?: Express.Multer.File,
  ) {
    return await this.usersService.updateById(id, dto, avatar);
  }

  @Delete('me')
  async deleteById(@CurrentUser('id') id: string) {
    return await this.usersService.deleteById(id);
  }
}
