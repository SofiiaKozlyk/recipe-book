import { Controller, Get, Post, Body, Req, BadRequestException, Put, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
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

    @Get('/:id')
    @ApiOperation({ summary: 'Get the product by id' })
    @ApiParam({ name: 'id', description: 'Product id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Product found' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async getExhibitById(@Param('id', ParseIntPipe) id: number) {
        const product = await this.productsService.getProductById(id);

        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }

        return product;

    }

    @Put('/:id')
    @ApiOperation({ summary: 'Update the product' })
    @ApiParam({ name: 'id', description: 'Product id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Product updated' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body() createProductDto: CreateProductDto) {
        const product = await this.productsService.getProductById(id);

        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }

        return this.productsService.updateProduct(id, createProductDto.name, createProductDto.calories);
    }
}
