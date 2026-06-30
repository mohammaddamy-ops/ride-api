import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { Rating } from './rating.entity';
import { User } from '../users/user.entity';
import { Trip } from '../trips/trip.entity';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Rating, User, Trip]), 
    AuthModule, 
  ],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}