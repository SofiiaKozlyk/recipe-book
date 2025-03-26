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

    /**
     * Retrieves all products.
     * 
     * @returns {Promise<Product[]>} - A list of products.
     */
    @Get()
    @ApiOperation({ summary: 'Get all products' })
    @ApiResponse({ status: 200, description: 'List of products' })
    async getAllProducts() {
        const product = await this.productsService.getAllProducts();
        return plainToInstance(Product, product, { excludeExtraneousValues: true });
    }

    /**
     * Adds a new product.
     * 
     * @param {CreateProductDto} createProductDto - The product data.
     * @param {Request} req - The request object containing user info.
     * @returns {Promise<Product>} - The newly created product.
     * @throws {BadRequestException} - If the request data is invalid.
     * @throws {UnauthorizedException} - If the user is not authenticated.
     */
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

    /**
     * Searches for products by name.
     * 
     * @param {string} name - The product name to search for.
     * @returns {Promise<Product[]>} - A list of matching products.
     * @throws {BadRequestException} - If the search query is invalid.
     */
    @Get('/search')
    @ApiOperation({ summary: 'Search products by name' })
    @ApiQuery({ name: 'name', type: String, description: 'Product name', example: 'apple' })
    @ApiResponse({ status: 200, description: 'Products found', type: [Product] })
    @ApiResponse({ status: 400, description: 'Validation error' })
    async searchProducts(@Query('name') name: string) {
        const product = await this.productsService.searchProducts(name);
        return plainToInstance(Product, product, { excludeExtraneousValues: true });
    }

    /**
     * Retrieves a product by its unique ID.
     * 
     * @param {number} id - The product ID.
     * @returns {Promise<Product>} - The found product.
     * @throws {NotFoundException} - If the product does not exist.
     */
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

    /**
     * Updates an existing product.
     * 
     * @param {number} id - The ID of the product to update.
     * @param {CreateProductDto} createProductDto - The updated product data.
     * @param {Request} req - The request object containing user info.
     * @returns {Promise<Product>} - The updated product.
     * @throws {BadRequestException} - If the request data is invalid.
     * @throws {UnauthorizedException} - If the user is not authenticated.
     * @throws {ForbiddenException} - If the user does not have permission to update.
     * @throws {NotFoundException} - If the product is not found.
     */
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

    /**
     * Deletes a product by its unique ID.
     * 
     * @param {number} id - The product ID.
     * @param {Request} req - The request object containing user info.
     * @returns {Promise<{ message: string }>} - A promise indicating the deletion was successful.
     * @throws {UnauthorizedException} - If the user is not authenticated.
     * @throws {ForbiddenException} - If the user does not have permission to delete.
     * @throws {NotFoundException} - If the product is not found.
     */
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
