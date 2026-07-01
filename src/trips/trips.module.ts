import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { Trip } from './trip.entity';
import { AuthModule } from '../auth/auth.module'; 
import { TripActivity } from './trip-activity.entity';
import { User } from 'src/users/user.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Trip , TripActivity , User]),
    AuthModule, 
  ],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService], 
  
})
export class TripsModule {}