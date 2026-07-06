import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {
    // @Type(() => Number) // since the limit will be red from query parameter the will bw string, so we need to convert it to number using class-transformer
    @IsOptional()
    @IsPositive()
    limit?: number = 10;

    // @Type(() => Number)
    @IsOptional()
    @IsPositive()
    page?: number = 1;
}