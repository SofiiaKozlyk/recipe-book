import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findByUsername(username: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { username } });
    }

    async findById(id: number): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async create(username: string, email: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);

        let existingUser = await this.usersRepository.findOne({ where: { username } });
        if (existingUser) {
            throw new BadRequestException('A user with this username already exists');
        }

        existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new BadRequestException('A user with this email already exists');
        }

        const user = this.usersRepository.create({ username, email, password: hashedPassword });

        return this.usersRepository.save(user);
    }

    async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<User | null> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });

        if (updateUserDto.username) {
            const existingUser = await this.usersRepository.findOne({ where: { username: updateUserDto.username } });
            if (existingUser && existingUser.id !== userId) {
                throw new BadRequestException('Username is already in use.');
            }
        }

        if (updateUserDto.email) {
            const existingUser = await this.usersRepository.findOne({ where: { email: updateUserDto.email } });
            if (existingUser && existingUser.id !== userId) {
                throw new BadRequestException('Email is already in use.');
            }
        }

        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        Object.assign(user, updateUserDto);
        await this.usersRepository.save(user);
        return user;
    }

    async deleteUser(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
