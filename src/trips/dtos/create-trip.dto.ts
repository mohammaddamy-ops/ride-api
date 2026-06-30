import { IsString } from 'class-validator';

export class CreateTripDto {
  
  @IsString()
  startLocation!: string;

  @IsString()
  endLocation!: string;
}