import { IsNumber, IsBoolean, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOfferDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hidden?: boolean;

  @IsInt()
  @Type(() => Number)
  itemId: number;
}
