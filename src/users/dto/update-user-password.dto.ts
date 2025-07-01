import { IsNotEmpty, IsString } from 'class-validator';

import { IsNotMatch } from '../decorators/is-not-match.decorator';
import { IsMatch } from '../decorators/is-match.decorator';

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
