import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export class QueryFilter {
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order_by?: 'asc' | 'desc' = 'desc';


  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
