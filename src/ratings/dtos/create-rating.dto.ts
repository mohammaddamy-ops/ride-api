import { IsNumber, IsString, IsOptional, Max, Min } from 'class-validator';

export class CreateRatingDto {
  @IsNumber()
  tripId!: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  stars!: number;

  @IsString()
  @IsOptional()
  comment?: string;
}