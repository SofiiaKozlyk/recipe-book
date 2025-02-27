import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
    constructor(@InjectRepository(Product)
    private productRepository: Repository<Product>) { }

    async getAllProducts(): Promise<Product[]> {
        return this.productRepository.find();
    }

    async createProduct(name: string, calories: number) {
        const product = this.productRepository.create({ name, calories });
        return await this.productRepository.save(product);
    }
}
