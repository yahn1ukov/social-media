import { IsNotEmpty, IsString } from 'class-validator';

import { IsUsernameOrEmail } from '@/shared/decorators/is-username-or-email.decorator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsUsernameOrEmail()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
