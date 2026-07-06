import { IsDate, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateProfileDto {
    @IsOptional()
    @IsString({ message: 'First Name must be a string' })
    @MaxLength(50, { message: 'Name is too long' })
    @MinLength(3, { message: 'Name is too short' })
    firstName?: string;

    @IsOptional()
    @IsString({ message: 'Last Name must be a string' })
    @MaxLength(50, { message: 'Name is too long' })
    @MinLength(3, { message: 'Name is too short' })
    lastName?: string;
    
    @IsString()
    @IsOptional()
    @MaxLength(10)
    gender?: string;
    
    @IsDate()
    @IsOptional()
    dateOfBirth?: string;
    
    @IsString()
    @IsOptional()
    bio?: string;
    
    @IsString()
    @IsOptional()
    profileImage?: string;
}