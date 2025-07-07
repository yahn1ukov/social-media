import { IsNotEmpty, IsString } from 'class-validator';

import { IsMatch } from '@/shared/decorators/is-match.decorator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsMatch('password')
  confirmPassword: string;
}
