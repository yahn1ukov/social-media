import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CursorPaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number = 4;

  @IsOptional()
  @IsUUID()
  cursor?: string;
}
