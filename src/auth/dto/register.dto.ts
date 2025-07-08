import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

import { IsMatch } from '@/shared/decorators/is-match.decorator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsMatch('password')
  confirmPassword: string;
}
