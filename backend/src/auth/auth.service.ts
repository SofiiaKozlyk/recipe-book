import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
  * Validates user credentials.
  * 
  * @param {string} username - The username of the user.
  * @param {string} password - The password of the user.
  * @returns {Promise<User | null>} - A promise resolving to the user object if validation is successful, otherwise `null`.
  * @throws {UnauthorizedException} - If the username is incorrect.
  */
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user && (await this.comparePasswords(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  /**
  * Logs in a user by generating a JWT token.
  * 
  * @param {User} user - The authenticated user object.
  * @returns {Promise<{ accessToken: string }>} - A promise resolving to an object containing the JWT token.
  */
  async login(user: User) {
    const payload = { username: user.username, sub: user.id };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    return {
      access_token: accessToken,
    };
  }

  /**
  * Compares a plain text password with a hashed password.
  * 
  * @param {string} plainText - The plain text password.
  * @param {string} hashed - The hashed password.
  * @returns {Promise<boolean>} - A promise resolving to `true` if passwords match, otherwise `false`.
  */
  private async comparePasswords(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }
}