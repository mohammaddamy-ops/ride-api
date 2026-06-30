import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { Trip } from './trip.entity';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Trip]),
    AuthModule, 
  ],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService], 
})
export class TripsModule {}