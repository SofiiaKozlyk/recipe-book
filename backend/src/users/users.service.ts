import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

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
}
