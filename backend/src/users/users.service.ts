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

    /**
    * Finds a user by their username.
    * 
    * @param username - The username to search for.
    * @returns {Promise<User | undefined>} - The user if found, or `undefined` if no user exists with the given username.
    */
    async findByUsername(username: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { username } });
    }

    /**
    * Finds a user by their unique ID.
    * 
    * @param id - The unique identifier of the user.
    * @returns {Promise<User | undefined>} - The user if found, or `undefined` if no user exists with the given ID.
    */
    async findById(id: number): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { id } });
    }

    /**
    * Creates a new user with the provided data.
    * 
    * @param username - The username for the new user account.
    * @param email - The email address of the new user.
    * @param password - The password for the new user account.
    * @returns {Promise<User>} - The newly created user.
    */
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

    /**
    * Updates the information of an existing user.
    * 
    * @param userId - The ID of the user to be updated.
    * @param updateUserDto - The data to update the user with.
    * @returns {Promise<User | null>} - The updated user or `null` if the user does not exist.
    */
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

    /**
    * Deletes a user by their ID.
    * 
    * @param id - The ID of the user to be deleted.
    * @returns {Promise<void>} - No return value, operation is complete.
    */
    async deleteUser(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
