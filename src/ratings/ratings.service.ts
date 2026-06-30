import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating, RatingStatus } from './rating.entity';
import { User } from '../users/user.entity';
import { Trip } from '../trips/trip.entity';
import { CreateRatingDto } from './dtos/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating) private ratingRepo: Repository<Rating>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Trip) private tripsRepository: Repository<Trip>, 
  ) {}

  async create(dto: CreateRatingDto, passengerId: number) {
    const trip = await this.tripsRepository.findOne({
      where: { id: dto.tripId },
      relations: { driver: true },
    });

    if (!trip || !trip.driver) {
      throw new NotFoundException('Trip or assigned driver not found');
    }

    const rating = this.ratingRepo.create({
      stars: dto.stars,
      comment: dto.comment || '',
      trip: { id: dto.tripId },
      passenger: { id: passengerId },
      driver: { id: trip.driver.id }, 
    });

    if (dto.stars >= 4) {
      rating.status = RatingStatus.APPROVED;
      await this.ratingRepo.save(rating);
      await this.updateDriverAverageRating(trip.driver.id);
    } else {
      rating.status = RatingStatus.PENDING;
      await this.ratingRepo.save(rating);
    }

    return rating;
  }

  async approveRating(id: number) {
    const rating = await this.ratingRepo.findOne({
      where: { id },
      relations: { driver: true },
    });
    if (!rating) throw new NotFoundException('التقييم غير موجود');

    rating.status = RatingStatus.APPROVED;
    await this.ratingRepo.save(rating);

    await this.updateDriverAverageRating(rating.driver.id);
    return rating;
  }

  private async updateDriverAverageRating(driverId: number) {
    const approvedRatings = await this.ratingRepo.find({
      where: { driver: { id: driverId }, status: RatingStatus.APPROVED },
    });

    if (approvedRatings.length === 0) return;

    const sum = approvedRatings.reduce((acc, item) => acc + item.stars, 0);
    const average = sum / approvedRatings.length;

    await this.userRepo.update(driverId, { averageRating: parseFloat(average.toFixed(2)) });
  }

  getPendingRatings() {
    return this.ratingRepo.find({
      where: { status: RatingStatus.PENDING },
      relations: { passenger: true, driver: true },
    });
  }
}