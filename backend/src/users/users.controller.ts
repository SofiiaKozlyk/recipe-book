import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

const MinLoginLength = 4;
const MinPasswordLength = 6;

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOperation({ summary: 'Get an user by ID or username' })
  @ApiQuery({ name: 'id', required: false, description: 'ID of the user' })
  @ApiQuery({ name: 'username', required: false, description: 'Username of the user' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(
    @Query('id') id?: number,
    @Query('username') username?: string,
  ) {
    if (!id && !username) {
      throw new NotFoundException('Either ID or username must be provided');
    }

    const user = id ?
      await this.usersService.findById(id) :
      await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return plainToInstance(User, user, { excludeExtraneousValues: true });
  }

  @ApiOperation({ summary: 'Registration of a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Invalid data provided' })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    if (
      (!createUserDto.username || !createUserDto.email || !createUserDto.password) ||
      (createUserDto.username.length < MinLoginLength) || (createUserDto.password.length < MinPasswordLength) ||
      !/^\S+@\S+\.\S+$/.test(createUserDto.email.trim())
    ) {
      throw new BadRequestException(`Username must be at least ${MinLoginLength} characters long, password must be at least ${MinPasswordLength} characters long, and a valid email must be provided.`);
    }

    const user = this.usersService.create(createUserDto.username, createUserDto.email, createUserDto.password);

    return plainToInstance(User, user, { excludeExtraneousValues: true });
  }


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update user information' })
  @ApiParam({ name: 'id', description: 'User id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'User information updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid email format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: You can only update your own account unless you are an admin' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('You must be logged in to perform this action.');
    }
    
    const authenticatedUser = req.user as { id: number; isAdmin: boolean };

    if (!authenticatedUser.isAdmin && authenticatedUser.id !== id) {
      throw new ForbiddenException('You can only update your own account unless you are an admin.');
    }

    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (updateUserDto.email !== undefined) {
      const trimmedEmail = updateUserDto.email.trim();
  
      if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
        throw new BadRequestException('Invalid email format.');
      }
  
      updateUserDto.email = trimmedEmail;
    }

    if (updateUserDto.username && (updateUserDto.username.length < MinLoginLength)) {
      throw new BadRequestException(`Username must be at least ${MinLoginLength} characters long.`);
    }

    if (updateUserDto.password && (updateUserDto.password.length < MinPasswordLength)) {
      throw new BadRequestException(`password must be at least ${MinPasswordLength} characters long.`);
    }

    const updatedUser = await this.usersService.updateUser(id, updateUserDto);
    return { message: 'User information updated successfully', user: plainToInstance(User, updatedUser, { excludeExtraneousValues: true }) };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: You can only delete your own account unless you are an admin' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('You must be logged in to perform this action.');
    }

    const authenticatedUser = req.user as { id: number; isAdmin: boolean };
    if (!authenticatedUser.isAdmin && authenticatedUser.id !== id) {
      throw new ForbiddenException('You can only delete your own account unless you are an admin.');
    }

    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    
    await this.usersService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}
