import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TripsModule } from './trips/trips.module';
import { RatingsModule } from './ratings/ratings.module'; 
import { User } from './users/user.entity';
import { Trip } from './trips/trip.entity';
import { Rating } from './ratings/rating.entity'; 
import {  AuthModule } from './auth/auth.module'
import { TripActivity } from './trips/trip-activity.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'db',
        port: 5432,
      username: 'postgres', 
      password: 'postgres',
      database: 'ride_sharing',
      entities: [User, Trip, Rating, TripActivity], 
      synchronize: true,
    }),
    UsersModule,
    TripsModule,
    RatingsModule, 
    AuthModule,
  ],
})
export class AppModule {}