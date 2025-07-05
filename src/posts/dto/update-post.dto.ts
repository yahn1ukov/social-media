import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  text?: string;

  @IsArray()
  @IsOptional()
  hashtags?: string[];

  @IsArray()
  @IsOptional()
  deletedMediaIds?: string[];
}
