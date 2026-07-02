import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository, FindOptionsWhere, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateWishDto } from './dtos/create-wish.dto';
import { UpdateWishDto } from './dtos/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private readonly usersService: UsersService,
  ) {}

  async findOne(query: FindOptionsWhere<Wish>): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: query,
      relations: ['owner', 'offers', 'wishlists'],
    });

    if (!wish) {
      throw new NotFoundException('Wish не найден');
    }

    wish.offers = wish.offers.filter((offer) => !offer.hidden);

    return wish;
  }

  async findLast(limit: number): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findTop(limit: number): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { copied: 'DESC' },
      take: limit,
    });
  }

  async create(dto: CreateWishDto, userId: number): Promise<Wish> {
    const owner = (await this.usersService.findOne({ id: userId })) as User;
    if (!owner) {
      throw new NotFoundException('User не найден');
    }
    return this.wishRepository.save({ ...dto, owner });
  }

  async update(id: number, dto: UpdateWishDto, userId: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!wish) {
      throw new NotFoundException('Wish не найден');
    }

    if (wish.offers.length !== 0 && wish.raised !== 0) {
      throw new ForbiddenException('Редактирование запрещено, уже есть заявки');
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Запрещено редактировать чужой Wish');
    }

    return this.wishRepository.save({ ...wish, ...dto });
  }

  async delete(id: number, userId: number): Promise<DeleteResult> {
    const wish = await this.wishRepository.findOne({
      where: { id, owner: { id: userId } },
    });

    if (!wish) {
      throw new NotFoundException('Wish или User не найден ');
    }

    return await this.wishRepository.delete(id);
  }

  async copyWish(wishId: number, userId: number): Promise<Wish> {
    const wish = await this.findOne({ id: wishId });
    const owner = (await this.usersService.findOne({ id: userId })) as User;

    if (!owner) {
      throw new NotFoundException('Owner не найден');
    }

    const { name, link, image, price, description, wishlists } = wish;

    await this.wishRepository.save({ ...wish, copied: wish.copied + 1 });

    const newWish = this.wishRepository.create({
      name,
      link,
      image,
      price,
      description,
      wishlists,
      owner,
    });

    return await this.wishRepository.save(newWish);
  }
}
