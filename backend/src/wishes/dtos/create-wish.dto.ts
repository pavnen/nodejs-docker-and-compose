import { IsString, IsNumber, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWishDto {
  @IsString()
  @MaxLength(250)
  name: string;

  @IsString()
  @MaxLength(1024)
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Type(() => Number)
  price: number;

  @IsString()
  @MaxLength(500)
  link: string;

  @IsString()
  @MaxLength(500)
  image: string;
}
