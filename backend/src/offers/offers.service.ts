import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { CreateOfferDto } from './dtos/create-offer.dto';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async find(where: FindOptionsWhere<Offer>): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where,
      relations: ['user', 'wish'],
    });

    if (!offer) {
      throw new NotFoundException('Offer не найден');
    }

    return offer;
  }

  async findAll(where: FindOptionsWhere<Wish>): Promise<Offer[]> {
    return this.offerRepository.find({ where });
  }

  async update(id: number, updatedOffer: Partial<Offer>): Promise<Offer> {
    const offer = await this.offerRepository.findOne({ where: { id } });
    if (offer === null) {
      throw new NotFoundException('Offer не найден');
    }
    return this.offerRepository.save({ ...offer, updatedOffer });
  }

  async delete(id: number): Promise<void> {
    const result = await this.offerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Offer не найден');
    }
  }

  async create(dto: CreateOfferDto, userId: number): Promise<Offer> {
    const user = (await this.usersService.findOne({ id: userId })) as User;
    const wish = await this.wishesService.findOne({ id: dto.itemId });

    wish.raised = wish.offers.reduce(
      (acc, { amount }) => acc + Number(amount) || 0,
      0,
    );

    if (wish.raised > wish.price || wish.raised + dto.amount > wish.price) {
      throw new ForbiddenException(
        'Нельзя превышать стоимость подарка и скидываться на полностью оплаченный подарок',
      );
    }

    if (wish.owner.id === user.id) {
      throw new ForbiddenException('Нельзя скидываться на свой подарок');
    }

    await this.wishesRepository.save({
      ...wish,
      raised: wish.raised + dto.amount,
    });

    const offer = this.offerRepository.create({
      ...dto,
      user,
      wish,
    });

    return await this.offerRepository.save(offer);
  }
}
