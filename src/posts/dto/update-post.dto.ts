import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  text?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  hashtags?: string[];

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  deletedMediaIds?: string[];
}
