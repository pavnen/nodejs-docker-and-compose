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
import type { AuthRequest } from '../auth/auth.controller';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dtos/create-wishlist.dto';
import { UpdateWishlistDto } from './dtos/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  async findAll(): Promise<Wishlist[]> {
    return await this.wishlistsService.findAll({});
  }

  @Post()
  @HttpCode(201)
  async create(
    @Req() req: AuthRequest,
    @Body() dto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const userId = req.user.id;
    return this.wishlistsService.create(dto, userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Wishlist> {
    return await this.wishlistsService.findOne({ id });
  }

  @Patch(':id')
  async update(
    @Req() req: AuthRequest,
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.update(id, updateWishlistDto, req.user.id);
  }

  @Delete(':id')
  async removeOne(
    @Req() req: AuthRequest,
    @Param('id') id: number,
  ): Promise<Wishlist> {
    return await this.wishlistsService.delete({ id }, req.user.id);
  }
}
