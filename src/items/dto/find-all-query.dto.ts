import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString, IsEnum } from 'class-validator';

enum SortKey {
  NAME = 'name',
  PRICE = 'price',
}

export class FindAllQuery {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  count: number;

  @IsOptional()
  @IsString()
  @IsEnum(SortKey)
  sortkey: SortKey;
}
