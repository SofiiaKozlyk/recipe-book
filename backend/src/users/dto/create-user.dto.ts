import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'username123', description: 'Username for registration' })
  @IsNotEmpty()
  @IsString()
  @MinLength(4, { message: 'Username must be at least 4 characters long' })
  username: string;

  @ApiProperty({ example: 'ipz@example.com', description: 'Email користувача' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}