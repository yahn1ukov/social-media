import { Controller, Get } from '@nestjs/common';

import { UsersService } from '../users.service';
import { ParamUUID } from '@/shared/decorators/param-uuid.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUserProfile(@ParamUUID('id') id: string) {
    return this.usersService.getProfile(id);
  }
}
