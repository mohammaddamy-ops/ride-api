import { Controller, Post, Body, Patch, Param, ParseIntPipe, Get, UseGuards, SetMetadata, Req } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dtos/create-rating.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/user.entity';

@Controller('ratings')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.PASSENGER]) 
  createRating(@Body() body: CreateRatingDto, @Req() req: any) {
    const passengerId = req.user.sub; 
    return this.ratingsService.create(body, passengerId);
  }

  @Patch('/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.ADMIN])
  approveRating(@Param('id', ParseIntPipe) id: number) {
    return this.ratingsService.approveRating(id);
  }

  @Get('/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.ADMIN])
  getPendingRatings() {
    return this.ratingsService.getPendingRatings();
  }
}