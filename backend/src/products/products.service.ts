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

    /**
    * Retrieves all products from the database.
    * 
    * @returns {Promise<Product[]>} - A list of products.
    */
    async getAllProducts(): Promise<Product[]> {
        return this.productRepository.find();
    }

    /**
    * Creates a new product.
    * 
    * @param {string} name - The name of the product.
    * @param {number} calories - The calorie content of the product.
    * @param {number} userId - The ID of the user creating the product.
    * @returns {Promise<Product>} - The newly created product.
    * @throws {NotFoundException} - If a referenced product does not exist.
    */
    async createProduct(name: string, calories: number, userId: number) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const product = this.productRepository.create({ name, calories, user });
        return await this.productRepository.save(product);
    }

    /**
    * Retrieves a product by its ID.
    * 
    * @param {number} id - The ID of the product.
    * @returns {Promise<Product | undefined>} The recipe with the specified ID or undefined if not found.
    */
    async getProductById(id: number): Promise<Product | undefined> {
        const product = await this.productRepository.findOne({ where: { id } });
        return product;
    }

    /**
    * Updates an existing product by its ID.
    * 
    * @param {number} id - The ID of the product to update.
    * @param {string} name - The updated name of the product.
    * @param {number} calories - The updated calorie content of the product.
    * @returns {Promise<Product>} - The updated product.
    * @throws {BadRequestException} - If validation fails.
    */
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

    /**
    * Searches for products by name.
    * 
    * @param {string} name - The name of the product to search for.
    * @returns {Promise<Product[]>} - A list of products that match the search query.
    * @throws {BadRequestException} - If the query parameter is invalid.
    */
    async searchProducts(name: string): Promise<Product[]> {
        if (typeof name !== 'string' || name.trim().length === 0) {
            throw new BadRequestException('Name must be a non-empty string');
        }

        return await this.productRepository.find({ where: { name: ILike(`%${name}%`) } });
    }

    /**
    * Deletes a product by its ID.
    * 
    * @param {number} id - The ID of the product to delete.
    * @returns {Promise<void>} - A void promise indicating the deletion was successful.
    */
    async deleteProduct(id: number): Promise<void> {
        await this.productRepository.delete(id);
    }
}
