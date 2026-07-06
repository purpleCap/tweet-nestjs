import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { CreateProfileDto } from "src/profile/dto/create-profile.dto";

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(50)
    email!: string;

    @IsNotEmpty()
    @IsString({ message: 'First Name must be a string' })
    @MaxLength(24, { message: 'Name is too long' })
    @MinLength(3, { message: 'Name is too short' })
    username!: string;


    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    password!: string;

    @IsOptional()
    profile? : CreateProfileDto;
}