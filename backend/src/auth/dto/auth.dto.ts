import { IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}
