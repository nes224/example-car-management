import {
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
  IsIn,
  Min,
  Max,
} from 'class-validator';
import { KeywordQueryFilter } from '../../helpers/queryfilter/keywordqueryfilter.dto';
import { Type } from 'class-transformer';

export class CarWhereDTO {
  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsInt()
  year?: number;
}

export class SearchCarDto extends KeywordQueryFilter {
  @IsOptional()
  @ValidateNested()
  @Type(() => CarWhereDTO)
  where?: CarWhereDTO;
}
