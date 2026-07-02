import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { UserPublicProfileResponseDto } from './dtos/user-public-profile-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(where: FindOptionsWhere<User>): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where,
    });
    if (!user) {
      throw new NotFoundException('User не найден');
    }
    return user;
  }

  async findWithPassword(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User не найден');
    }

    return user;
  }

  async create(dto: CreateUserDto): Promise<User | void> {
    const password = await bcrypt.hash(dto.password, 10);

    const { email, username } = dto;

    const testExistingUser = await this.userRepository.find({
      where: [{ email }, { username }],
    });

    if (testExistingUser.length !== 0) {
      throw new ConflictException(
        'User с таким email или username уже существует',
      );
    }

    const user = this.userRepository.create({
      ...dto,
      password,
    });

    console.log({
      ...dto,
      password,
    });
    return await this.userRepository.save(user);
  }

  async update(id: number, updatedUser: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('User не найден');
    }
    if (updatedUser.password) {
      updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
    }

    return this.userRepository.save({ ...user, ...updatedUser });
  }

  async getWishesByUserId(id: number): Promise<Wish[]> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['wishes'],
    });
    if (!user) {
      throw new NotFoundException('User не найден');
    }
    return user.wishes;
  }

  async getWishesByUsername(username: string): Promise<Wish[]> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['wishes'],
    });
    if (!user) {
      throw new NotFoundException('User не найден');
    }
    return user.wishes;
  }

  async findMany(query: string): Promise<UserPublicProfileResponseDto[]> {
    if (!query || query.length === 0) {
      return [];
    }

    const users = await this.userRepository.find({
      where: [
        { username: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
      ],
    });

    return users.map((user) =>
      plainToClass(UserPublicProfileResponseDto, user, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
