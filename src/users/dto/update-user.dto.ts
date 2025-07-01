import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  bio?: string;
}
