import { Controller, Post, Body, Res, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Successful authorization, returns a JWT token and username' })
  @ApiResponse({ status: 401, description: 'Invalid username or password' })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res) {

    if (!loginDto.username || !loginDto.password) {
      throw new BadRequestException('Invalid data provided');
    }

    const user = await this.authService.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new BadRequestException('Invalid username or password');
    }

    const { access_token } = await this.authService.login(user);

    const response = {
      access_token,
      userName: loginDto.username,
      userRole: user.role,
      userId: user.id,
    };

    return res.status(HttpStatus.OK).json(response);
  }
}