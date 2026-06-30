import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { CreateUserDto } from '../users/dtos/create-user.dto';



@Injectable()
export class AuthService{
constructor(
private usersService : UsersService,
private jwtservice :JwtService,

){}
async register(dto:CreateUserDto){
    const hashedPassword = await bcrypt.hash(dto.password,10);
return this.usersService.create({ ...dto, password: hashedPassword });
}
async login(dto: LoginDto){
    const user = await this.usersService.findByEmail(dto.email);
    
    if (!user) throw new UnauthorizedException ('the password or email is incorrect');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException ('the password or email is incorrect');


    const payload ={ sub: user.id , email : user.email, role: user.role};
    return {
        access_token: this.jwtservice.sign(payload),
    };
}


}