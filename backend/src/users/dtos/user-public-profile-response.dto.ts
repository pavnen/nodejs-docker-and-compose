import { Exclude, Expose } from 'class-transformer';

export class UserPublicProfileResponseDto {
  @Expose()
  username: string;

  @Expose()
  about: string;

  @Expose()
  avatar: string;

  @Exclude()
  email: string;
}
