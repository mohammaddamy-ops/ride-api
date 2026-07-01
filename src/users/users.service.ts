import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, DriverStatus } from './user.entity'; 
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

  async updateDriverStatus(driverId: number, status: DriverStatus) {
    if (status === DriverStatus.IN_TRIP) {
      throw new BadRequestException('You cannot manually set the status to IN_TRIP; the system does this when the trip is accepted.');
    }

    const driver = await this.repo.findOne({ where: { id: driverId } });
    if (!driver || driver.role !== UserRole.DRIVER) {
      throw new NotFoundException('The driver is not available, or the user is not a driver.');
    }

    if (driver.driverStatus === DriverStatus.IN_TRIP) {
      throw new BadRequestException('You cannot change your status while on an active trip.');
    }

    driver.driverStatus = status;
    return this.repo.save(driver);
  }
}