import { IsNotEmpty, IsString } from 'class-validator';

import { IsNotMatch } from '@/shared/decorators/is-not-match.decorator';
import { IsMatch } from '@/shared/decorators/is-match.decorator';

export class UpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @IsNotMatch('oldPassword')
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @IsMatch('newPassword')
  confirmNewPassword: string;
}
