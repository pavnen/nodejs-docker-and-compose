import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import type { AuthRequest } from '../auth/auth.controller';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dtos/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Req() req: AuthRequest,
    @Body() createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    const userId = req.user.id;
    return this.offersService.create(createOfferDto, userId);
  }

  @Get()
  async findAll(): Promise<Offer[]> {
    return this.offersService.findAll({});
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Offer> {
    return this.offersService.find({ id });
  }
}
