import { Controller, Get, Post, Body, Req, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all products' })
    @ApiResponse({ status: 200, description: 'List of products' })
    async getAllProducts() {
        return this.productsService.getAllProducts();
    }

    @Post()
    @ApiOperation({ summary: 'Add a new product' })
    @ApiResponse({ status: 201, description: 'Product successfully created' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    createProduct(
        @Body() createProductDto: CreateProductDto) {
        if (!createProductDto.name) {
            throw new BadRequestException('Product name is required');
        }

        if (!createProductDto.calories) {
            throw new BadRequestException('Product calories is required');
        }

        return this.productsService.createProduct(createProductDto.name, createProductDto.calories);
    }
}
