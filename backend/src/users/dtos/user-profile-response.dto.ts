import { User } from '../entities/user.entity';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class UserProfileResponseDto extends PartialType(
  OmitType(User, ['password', 'wishes', 'offers', 'wishlists']),
) {}
