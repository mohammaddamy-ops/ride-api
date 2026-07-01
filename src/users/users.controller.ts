import { Controller, Post, Body, Get, Param, ParseIntPipe, UseGuards, SetMetadata, Patch, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole, DriverStatus } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.ADMIN])
  findAllUsers() {
    return this.usersService.findAll();
  }

  @Get('/drivers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.ADMIN])
  findAllDrivers() {
    return this.usersService.findAllDrivers();
  }

  @Patch('/driver-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.DRIVER])
  updateStatus(@Req() req: any, @Body('status') status: DriverStatus) {
    const driverId = req.user.sub; 
    return this.usersService.updateDriverStatus(driverId, status);
  }

  @Get('/:id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
}