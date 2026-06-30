import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity'; 
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  create(userDto: CreateUserDto) {
    const user = this.repo.create(userDto); 
    return this.repo.save(user);
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  findAll() {
    return this.repo.find();
  }

  findAllDrivers() {
    return this.repo.find({ where: { role: UserRole.DRIVER } });
  }

  async findByEmail(email: string): Promise<User | null> {
  return this.repo.findOneBy({ email });
}
} 