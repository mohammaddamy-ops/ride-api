import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip, TripStatus } from './trip.entity';
import  { TripActivity , TripAction} from './trip-activity.entity'
import { User, DriverStatus } from '../users/user.entity';
import { CreateTripDto } from './dtos/create-trip.dto';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripsRepository: Repository<Trip>,
    @InjectRepository(TripActivity)
    private activitiesRepository: Repository<TripActivity>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createTripDto: CreateTripDto, passengerId: number): Promise<Trip> {
    const trip = this.tripsRepository.create({
      ...createTripDto,
      passenger: { id: passengerId } as any,
      status: TripStatus.LOOKING_FOR_DRIVER,
    });
    
    const savedTrip = await this.tripsRepository.save(trip);

    await this.logActivity(savedTrip, TripAction.CREATED, passengerId);
    
    return savedTrip;
  }

  async findAvailableTrips(): Promise<Trip[]> {
    return this.tripsRepository.find({
      where: { status: TripStatus.LOOKING_FOR_DRIVER },
      relations: { passenger: true }, 
    });
  }

  async acceptTrip(tripId: number, driverId: number): Promise<Trip> {
    const trip = await this.tripsRepository.findOne({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.status !== TripStatus.LOOKING_FOR_DRIVER) {
      throw new BadRequestException('Trip is no longer available');
    }

    const driver = await this.usersRepository.findOne({ where: { id: driverId } });
    if (!driver || driver.driverStatus !== DriverStatus.ONLINE) {
      throw new BadRequestException('Driver must be online to accept trips');
    }

    trip.status = TripStatus.ACCEPTED;
    trip.driver = { id: driverId } as any;
    driver.driverStatus = DriverStatus.IN_TRIP;

    await this.usersRepository.save(driver);
    const savedTrip = await this.tripsRepository.save(trip);
    
    await this.logActivity(savedTrip, TripAction.ACCEPTED, driverId);
    return savedTrip;
  }

  async startTrip(tripId: number, driverId: number): Promise<Trip> {
    const trip = await this.tripsRepository.findOne({ where: { id: tripId, driver: { id: driverId } } });
    if (!trip) throw new NotFoundException('Trip not found or you are not the assigned driver');
    
    trip.status = TripStatus.IN_PROGRESS;
    const savedTrip = await this.tripsRepository.save(trip);
    
    await this.logActivity(savedTrip, TripAction.STARTED, driverId);
    return savedTrip;
  }

  async completeTrip(tripId: number, driverId: number, price: number): Promise<Trip> {
    const trip = await this.tripsRepository.findOne({ where: { id: tripId, driver: { id: driverId } } });
    if (!trip) throw new NotFoundException('Trip not found or you are not the assigned driver');
    
    trip.status = TripStatus.COMPLETED;
    trip.price = price;

    const driver = await this.usersRepository.findOne({ where: { id: driverId } });
    if (driver) {
      driver.driverStatus = DriverStatus.ONLINE;
      await this.usersRepository.save(driver);
    }

    const savedTrip = await this.tripsRepository.save(trip);
    await this.logActivity(savedTrip, TripAction.COMPLETED, driverId);
    return savedTrip;
  }

  async cancelTrip(tripId: number, userId: number): Promise<Trip> {
    const trip = await this.tripsRepository.findOne({ where: { id: tripId }, relations: { driver: true } });
    if (!trip) throw new NotFoundException('Trip not found');

    trip.status = TripStatus.CANCELLED;

    if (trip.driver) {
      const driver = await this.usersRepository.findOne({ where: { id: trip.driver.id } });
      if (driver) {
        driver.driverStatus = DriverStatus.ONLINE;
        await this.usersRepository.save(driver);
      }
    }

    const savedTrip = await this.tripsRepository.save(trip);
    await this.logActivity(savedTrip, TripAction.CANCELLED, userId);
    return savedTrip;
  }
async findAll(): Promise<Trip[]> {
  return this.tripsRepository.find({
    relations: {
      passenger: true,
      driver: true,
    },
  });
}
  private async logActivity(trip: Trip, action: TripAction, userId: number) {
    const activity = this.activitiesRepository.create({
      trip,
      action,
      performedBy: { id: userId } as any,
    });
    await this.activitiesRepository.save(activity);
  }
}