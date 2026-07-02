import {
  IsString,
  IsEmail,
  MaxLength,
  MinLength,
  IsOptional,
  Allow,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Allow()
  @MinLength(1)
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
