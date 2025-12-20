import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, SignInDto, UpdatePasswordDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async signIn(data: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { username: data.username },
    });
    const password = await bcrypt.hash(data.password, 10);
    data.password = password;
    if (!user) {
      throw new NotFoundException('Username does not exist');
    } else if (user && user.password === data.password) {
      return user;
    } else if (user.password !== data.password) {
      throw new ConflictException('Password is incorrect');
    }
  }
  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
    return user;
  }

  async changePassword(id: string, updatePassword: UpdatePasswordDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.password = await bcrypt.hash(updatePassword.password, 10);
    await this.userRepository.save(user);
    return user;
  }

  async remove(id: string) {
    return this.userRepository.delete(id);
  }
}
