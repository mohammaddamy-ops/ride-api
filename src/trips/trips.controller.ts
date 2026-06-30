import { Controller, Post, Body, Patch, Param, ParseIntPipe, UseGuards, SetMetadata, Req, Get } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dtos/create-trip.dto';
import { UpdateTripDto } from './dtos/update-trip.dto'; 
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/user.entity';

@Controller('trips')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Post()
  @SetMetadata('roles', [UserRole.PASSENGER])
  createTrip(@Body() body: CreateTripDto, @Req() req: any) {
    const passengerId = req.user.sub; 
    return this.tripsService.create(body, passengerId);
  }

  @Patch('/:id')
  @SetMetadata('roles', [UserRole.DRIVER])
  updateTripStatus(
    @Param('id', ParseIntPipe) id: number, 
    @Body() body: UpdateTripDto, 
    @Req() req: any
  ) {
    const driverId = req.user.sub; 
    return this.tripsService.updateStatus(id, body, driverId);
  }

  @Get()
  @SetMetadata('roles', [UserRole.ADMIN])
  getAllTrips() {
    return this.tripsService.findAll();
  }
}