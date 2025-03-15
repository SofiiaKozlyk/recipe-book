import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ILike, Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(User) private usersRepository: Repository<User>
    ) { }

    async getAllProducts(): Promise<Product[]> {
        return this.productRepository.find();
    }

    async createProduct(name: string, calories: number, userId: number) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const product = this.productRepository.create({ name, calories, user });
        return await this.productRepository.save(product);
    }

    async getProductById(id: number): Promise<Product | undefined> {
        const product = await this.productRepository.findOne({ where: { id } });
        return product;
    }

    async updateProduct(id: number, name: string, calories: number) {
        const product = await this.productRepository.findOne({ where: { id } });

        if (name !== undefined) {
            if (typeof name !== 'string' || name.trim().length < 1) {
                throw new BadRequestException('Name must be a non-empty string');
            }
            product.name = name;
        }

        if (calories !== undefined) {
            if (typeof calories !== 'number' || isNaN(calories)) {
                throw new BadRequestException('Calories must be a valid number');
            }
            product.calories = calories;
        }

        return this.productRepository.save(product);
    }

    async searchProducts(name: string): Promise<Product[]> {
        if (typeof name !== 'string' || name.trim().length === 0) {
            throw new BadRequestException('Name must be a non-empty string');
        }

        return await this.productRepository.find({ where: { name: ILike(`%${name}%`) } });
    }

    async deleteProduct(id: number): Promise<void> {
        await this.productRepository.delete(id);
    }
}
