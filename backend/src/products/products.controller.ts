import { Controller, Get, Post, Body, Req, BadRequestException, Put, Param, ParseIntPipe, NotFoundException, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';

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

    @Get('/search')
    @ApiOperation({ summary: 'Search products by name' })
    @ApiQuery({ name: 'name', type: String, description: 'Product name', example: 'apple' })
    @ApiResponse({ status: 200, description: 'Products found', type: [Product] })
    @ApiResponse({ status: 400, description: 'Validation error' })
    async searchProducts(@Query('name') name: string) {
        return await this.productsService.searchProducts(name);
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
    @ApiOperation({ summary: 'Update the product by id' })
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

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete the product by id' })
    @ApiParam({ name: 'id', description: 'Product id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Product successfully deleted' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async deleteProduct(@Param('id') id: number) {
        const product = await this.productsService.getProductById(id);

        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }

        await this.productsService.deleteProduct(id);
        return { message: 'Product successfully deleted' };
    }
}
