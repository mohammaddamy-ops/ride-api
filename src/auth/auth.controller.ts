import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { CreateUserDto } from '../users/dtos/create-user.dto';

@Controller('auth') 
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}