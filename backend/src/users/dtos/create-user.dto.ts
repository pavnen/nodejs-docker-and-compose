import {
  IsString,
  IsEmail,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  username: string;

  @IsString()
  @MaxLength(200)
  about: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatar: string;

  @IsEmail()
  @MinLength(1)
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
