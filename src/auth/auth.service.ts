import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { HashingProvider } from './provider/hashing.provider';
import authConfig from './config/auth.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        
        @Inject(authConfig.KEY)
        private readonly authConfiguration: ConfigType<typeof authConfig>,

        private readonly hashingProvider: HashingProvider,

        private readonly jwtService: JwtService
    ) {}

    public async login(username: string, password: string) {
        const user = await this.userService.getUsersByUsername(username);
        
        const isPasswordValid: boolean = await this.hashingProvider.comparePassword(password, user.password);
        if(!isPasswordValid) {
            throw new UnauthorizedException("Password is incorrect");
        }

        // GENERATE JWT AND SEND IT IN THE RESPONSE

        const token = await this.jwtService.signAsync({ sub: user.id, email: user.email }, {
            secret: this.authConfiguration.secret,
            expiresIn: this.authConfiguration.expiresIn,
            audience: this.authConfiguration.audience,
            issuer: this.authConfiguration.issuer
        });
        return {
            success: true,
            message: "User logged in successfully",
            data: { ...user, password: undefined },
            token
        };
    }

    public async signup(createUserDto: CreateUserDto) {
        return await this.userService.createUser(createUserDto);
    }
}
