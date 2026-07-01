import { Controller, Post, Body, Patch, Param, ParseIntPipe, UseGuards, SetMetadata, Req, Get } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dtos/create-trip.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/user.entity';

@Controller('trips')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TripsController {
  constructor(private tripsService: TripsService) {
    
  }

  @Post()
  @SetMetadata('roles', [UserRole.PASSENGER])
  createTrip(@Body() body: CreateTripDto, @Req() req: any) {
    const passengerId = req.user.sub; 
    return this.tripsService.create(body, passengerId);
  }

  @Get('available')
  @SetMetadata('roles', [UserRole.DRIVER])
  getAvailableTrips() {
    return this.tripsService.findAvailableTrips();
  }

  @Patch('/:id/accept')
  @SetMetadata('roles', [UserRole.DRIVER])
  acceptTrip(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const driverId = req.user.sub; 
    return this.tripsService.acceptTrip(id, driverId);
  }

  @Patch('/:id/start')
  @SetMetadata('roles', [UserRole.DRIVER])
  startTrip(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const driverId = req.user.sub; 
    return this.tripsService.startTrip(id, driverId);
  }

  @Patch('/:id/complete')
  @SetMetadata('roles', [UserRole.DRIVER])
  completeTrip(
    @Param('id', ParseIntPipe) id: number, 
    @Body('price') price: number,
    @Req() req: any
  ) {
    const driverId = req.user.sub; 
    return this.tripsService.completeTrip(id, driverId, price);
  }

  @Patch('/:id/cancel')
  @SetMetadata('roles', [UserRole.PASSENGER, UserRole.DRIVER]) 
  cancelTrip(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req.user.sub; 
    return this.tripsService.cancelTrip(id, userId);
  }

  @Get()
  @SetMetadata('roles', [UserRole.ADMIN])
  getAllTrips() {
    return this.tripsService.findAll();
  }
}