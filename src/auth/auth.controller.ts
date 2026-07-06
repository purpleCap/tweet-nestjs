import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AllowAnonymous } from './decorators/allow-anonymous.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @AllowAnonymous()
    login(@Body() payload : UserLoginDto) {
        return this.authService.login(payload.username, payload.password);
    }

    @Post('signup')
    @AllowAnonymous()
    signup(@Body() createUserDto: CreateUserDto) {
        return this.authService.signup(createUserDto);
    }

}
