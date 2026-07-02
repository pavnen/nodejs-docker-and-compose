import { Controller, Req, Get, Patch, Post, Body, Param } from '@nestjs/common';
import type { AuthRequest } from '../auth/auth.controller';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FindUsersDto } from './dtos/find-user.dto';
import { UserProfileResponseDto } from './dtos/user-profile-response.dto';
import { UserPublicProfileResponseDto } from './dtos/user-public-profile-response.dto';
import { Wish } from '../wishes/entities/wish.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findOwn(@Req() req: AuthRequest) {
    return this.usersService.findOne({ id: req.user.id });
  }

  @Patch('me')
  update(
    @Req() req: AuthRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  async getOwnWishes(@Req() req: AuthRequest): Promise<Wish[]> {
    return await this.usersService.getWishesByUserId(req.user.id);
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    return this.usersService.findOne({ username });
  }

  @Get(':username/wishes')
  async getWishes(@Param('username') username: string) {
    return this.usersService.getWishesByUsername(username);
  }

  @Post('find')
  findMany(@Body() dto: FindUsersDto): Promise<UserPublicProfileResponseDto[]> {
    return this.usersService.findMany(dto.query);
  }
}
