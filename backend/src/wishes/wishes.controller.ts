import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dtos/create-wish.dto';
import { UpdateWishDto } from './dtos/update-wish.dto';
import { Wish } from './entities/wish.entity';
import type { AuthRequest } from '../auth/auth.controller';
import { Public } from '../common/decorators/public.decorator';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Req() req: AuthRequest,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    const userId = req.user.id;
    return this.wishesService.create(createWishDto, userId);
  }

  @Public()
  @Get('last')
  async findLast(): Promise<Wish[]> {
    return this.wishesService.findLast(40);
  }

  @Public()
  @Get('top')
  async findTop(): Promise<Wish[]> {
    return this.wishesService.findTop(20);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Wish> {
    return this.wishesService.findOne({ id });
  }

  @Patch(':id')
  async update(
    @Req() req: AuthRequest,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    return this.wishesService.update(id, updateWishDto, req.user.id);
  }

  @Delete(':id')
  async remove(
    @Req() req: AuthRequest,
    @Param('id') id: number,
  ): Promise<object> {
    await this.wishesService.delete(id, req.user.id);
    return {
      success: true,
      message: 'Wish успешно удален',
    };
  }

  @Post(':id/copy')
  @HttpCode(201)
  async copyWish(
    @Param('id') id: number,
    @Req() req: AuthRequest,
  ): Promise<Wish> {
    const userId = req.user.id;
    return await this.wishesService.copyWish(id, userId);
  }
}
