import { Controller, Get, Post, Body, Req, BadRequestException, Put, Param, ParseIntPipe, NotFoundException, Delete, Query, UseGuards, ForbiddenException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all products' })
    @ApiResponse({ status: 200, description: 'List of products' })
    async getAllProducts() {
        const product = await this.productsService.getAllProducts();
        return plainToInstance(Product, product, { excludeExtraneousValues: true });
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Add a new product' })
    @ApiResponse({ status: 201, description: 'Product successfully created' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async createProduct(
        @Body() createProductDto: CreateProductDto,
        @Req() req,
    ) {
        if (!createProductDto.name) {
            throw new BadRequestException('Product name is required');
        }

        if (!createProductDto.calories) {
            throw new BadRequestException('Product calories is required');
        }

        const product = await this.productsService.createProduct(createProductDto.name, createProductDto.calories, req.user.id);
        return plainToInstance(Product, product, { excludeExtraneousValues: true });
    }

    @Get('/search')
    @ApiOperation({ summary: 'Search products by name' })
    @ApiQuery({ name: 'name', type: String, description: 'Product name', example: 'apple' })
    @ApiResponse({ status: 200, description: 'Products found', type: [Product] })
    @ApiResponse({ status: 400, description: 'Validation error' })
    async searchProducts(@Query('name') name: string) {
        const product = await this.productsService.searchProducts(name);
        return plainToInstance(Product, product, { excludeExtraneousValues: true });
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

        return plainToInstance(Product, product, { excludeExtraneousValues: true });
    }

    @Put('/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Update the product by id' })
    @ApiParam({ name: 'id', description: 'Product id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Product updated' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden: Only the user who created the product or an admin can update it' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body() createProductDto: CreateProductDto,
        @Req() req,
    ) {
        const product = await this.productsService.getProductById(id);
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }

        const authenticatedUser = req.user as { id: number; isAdmin: boolean };
        if (!authenticatedUser.isAdmin && authenticatedUser.id !== product.user.id) {
            throw new ForbiddenException('Only the user who created the product or an admin can update it.');
        }

        const updatedProduct = await this.productsService.updateProduct(id, createProductDto.name, createProductDto.calories);
        return plainToInstance(Product, updatedProduct, { excludeExtraneousValues: true });
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Delete the product by id' })
    @ApiParam({ name: 'id', description: 'Product id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Product successfully deleted' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden: Only the user who created the product or an admin can delete it' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async deleteProduct(
        @Param('id') id: number,
        @Req() req,
    ) {
        const product = await this.productsService.getProductById(id);
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }

        const authenticatedUser = req.user as { id: number; isAdmin: boolean };
        if (!authenticatedUser.isAdmin && authenticatedUser.id !== product.user.id) {
            throw new ForbiddenException('Only the user who created the product or an admin can delete it.');
        }

        await this.productsService.deleteProduct(id);
        return { message: 'Product successfully deleted' };
    }
}
