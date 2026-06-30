import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip, TripStatus } from './trip.entity';
import { CreateTripDto } from './dtos/create-trip.dto';
import { UpdateTripDto } from './dtos/update-trip.dto';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripsRepository: Repository<Trip>,
  ) {}

  async create(createTripDto: CreateTripDto, passengerId: number): Promise<Trip> {
    const trip = this.tripsRepository.create({
      ...createTripDto,
      passenger: { id: passengerId } as any,
      status: TripStatus.PENDING,
    });
    return this.tripsRepository.save(trip);
  }

  async updateStatus(id: number, updateTripDto: UpdateTripDto, driverId: number): Promise<Trip> {
    const trip = await this.tripsRepository.findOne({ where: { id } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    trip.status = updateTripDto.status;
    if (driverId) {
      trip.driver = { id: driverId } as any;
    }

    return this.tripsRepository.save(trip);
  }

  async findAll(): Promise<Trip[]> {
    return this.tripsRepository.find({
      relations: {
        passenger: true,
        driver: true,
      },
    });
  }
}