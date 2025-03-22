import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  /**
  * The unique username for the user.
  * @example 'username123'
  */
  @ApiProperty({ example: 'username123', description: 'Username of the user' })
  username: string;

  /**
   * The password of the user.
   */
  @ApiProperty({ example: 'password123', description: 'User password' })
  password: string;
}