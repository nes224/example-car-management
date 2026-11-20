import { IsString, IsNotEmpty, MaxLength, Min, Max, IsInt, IsOptional} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCarDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    licensePlate: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    province: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    brand: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    model: string

    @IsInt()
    @Min(1980)
    @Max(new Date().getFullYear() + 1)
    year: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    color: string;

    @IsOptional()
    @IsString()
    remark?: string;
}
