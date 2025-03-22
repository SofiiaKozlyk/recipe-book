import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  /**
  * The unique username for the user.
  * @example 'username123'
  */
  @ApiProperty({ example: 'username123', description: 'Username for registration' })
  @IsNotEmpty()
  @IsString()
  @MinLength(4, { message: 'Username must be at least 4 characters long' })
  username: string;

  /**
   * The email of the user.
   * @example 'user@example.com'
   */
  @ApiProperty({ example: 'user@example.com', description: 'Email користувача' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * The hashed password of the user.
   */
  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}