import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';

import { JwtAuth } from '@/auth/decorators/jwt.decorator';
import { UsersService } from './users.service';
import { Public } from '@/auth/decorators/public.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
  async updateById(@CurrentUser('id') id: string, @Body() dto: UpdateUserDto) {
    return await this.usersService.updateById(id, dto);
  }

  @Delete('me')
  async deleteById(@CurrentUser('id') id: string) {
    return await this.usersService.deleteById(id);
  }
}
