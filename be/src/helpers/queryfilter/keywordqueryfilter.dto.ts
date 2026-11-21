import { IsOptional, IsString } from 'class-validator';
import { QueryFilter } from './queryfilter.dto';

export class KeywordQueryFilter extends QueryFilter {
  @IsOptional()
  @IsString()
  keyword?: string;
}
