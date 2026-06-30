import { IsEnum } from 'class-validator';
import { TripStatus } from '../trip.entity';

export class UpdateTripDto {
  @IsEnum(TripStatus)
  status!: TripStatus;
  
}