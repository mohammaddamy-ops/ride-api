import { IsString ,  IsEmail , MinLength } from "class-validator";


export class LoginDto {

@IsEmail()
email!: string;


@MinLength(5)
@IsString()
password!: string;

}