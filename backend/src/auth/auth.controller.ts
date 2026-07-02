import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { User } from '../users/entities/user.entity';
import { LocalGuard } from './guards/local.guard';

export interface AuthRequest extends Request {
  user: User;
}

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalGuard)
  @Public()
  @Post('signin')
  signin(@Req() req: AuthRequest) {
    return this.authService.auth(req.user);
  }

  @Public()
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    console.log('dto.constructor.name:', createUserDto.constructor.name); // должно вывести "CreateUserDto"
    console.log('dto:', createUserDto);

    return this.usersService.create(createUserDto);
  }
}
