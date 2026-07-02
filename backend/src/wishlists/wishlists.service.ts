import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { CreateWishlistDto } from './dtos/create-wishlist.dto';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(where: FindOptionsWhere<Wishlist>): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      where,
      relations: ['owner', 'items'],
    });
  }

  async findOne(query: FindOptionsWhere<Wishlist>): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: query,
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist не найден');
    }

    return wishlist;
  }

  async create(dto: CreateWishlistDto, userId: number): Promise<Wishlist> {
    const owner = (await this.usersService.findOne({ id: userId })) as User;
    if (!owner) {
      throw new NotFoundException('User не найден');
    }
    const wishlist = this.wishlistRepository.create({
      ...dto,
      owner,
    });

    return await this.wishlistRepository.save(wishlist);
  }

  async update(
    id: number,
    updateData: Partial<Wishlist>,
    userId: number,
  ): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!wishlist) {
      throw new NotFoundException('Wishlist не найден');
    }
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Запрещено редактировать чужой Wishlist');
    }
    return this.wishlistRepository.save({ ...wishlist, ...updateData });
  }

  async delete(
    query: FindOptionsWhere<Wishlist>,
    userId: number,
  ): Promise<Wishlist> {
    const wishlist = await this.findOne(query);

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Нельзя удалять чужой Wishlist');
    }

    return this.wishlistRepository.remove(wishlist);
  }
}
