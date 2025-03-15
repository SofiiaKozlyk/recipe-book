import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEmail, MinLength, IsString } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({ example: 'username123', description: 'Username for registration' })
    @IsOptional()
    @IsString()
    @MinLength(4, { message: 'Username must be at least 4 characters long' })
    username?: string;

    @ApiProperty({ example: 'ipz@example.com', description: 'Email користувача' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ example: 'password123', description: 'User password' })
    @IsOptional()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password?: string;
}