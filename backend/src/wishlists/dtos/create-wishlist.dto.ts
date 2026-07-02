import { IsString, Length, IsOptional } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsString()
  @IsOptional()
  @Length(1, 1500)
  description: string;

  @IsString()
  @Length(1, 500)
  image: string;

  /*
  itemsId:
          type: array
          items:
            type: number
          example: [1]

   */
}
