import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecipesService } from './recipes.service';
import { Recipe } from './recipe.entity';
import { ProductsService } from '../products/products.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';

@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
    constructor(private readonly recipesService: RecipesService,
        private readonly productsService: ProductsService
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get all recipes' })
    @ApiResponse({ status: 200, description: 'List of recipes', type: [Recipe] })
    async getAllRecipes() {
        const recipe = await this.recipesService.getAllRecipes();
        return plainToInstance(Recipe, recipe, { excludeExtraneousValues: true });
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Add a new recipe' })
    @ApiResponse({ status: 201, description: 'Recipe successfully created' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async createRecipe(
        @Body() body: CreateRecipeDto,
        @Req() req,
    ) {
        if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
            throw new BadRequestException('Title is required and must be a non-empty string');
        }

        if (!body.description || typeof body.description !== 'string' || body.description.trim() === '') {
            throw new BadRequestException('Description is required and must be a non-empty string');
        }

        if (!body.ingredients || !Array.isArray(body.ingredients) || body.ingredients.length === 0) {
            throw new BadRequestException('Ingredients is required and must be a non-empty array');
        }

        for (const ingredient of body.ingredients) {
            if (!ingredient.productId || typeof ingredient.productId !== 'number' || ingredient.productId <= 0) {
                throw new BadRequestException('Each ingredient must have a valid productId (positive number)');
            }

            const product = await this.productsService.getProductById(ingredient.productId);
            if (!product) {
                throw new NotFoundException(`Product with id ${ingredient.productId} not found`);
            }

            if (!ingredient.amount || typeof ingredient.amount !== 'number' || ingredient.amount <= 0) {
                throw new BadRequestException('Each ingredient must have a valid amount (greater than 0)');
            }
        }

        const recipe = await this.recipesService.createRecipe(body.title, body.description, body.ingredients, req.user.id);
        return plainToInstance(Recipe, recipe, { excludeExtraneousValues: true });
    }

    @Get('/search')
    @ApiOperation({ summary: 'Search recipes by title' })
    @ApiQuery({ name: 'title', type: String, description: 'Recipe title', example: 'charlotte' })
    @ApiResponse({ status: 200, description: 'Recipes found', type: [Recipe] })
    @ApiResponse({ status: 400, description: 'Validation error' })
    async getRecipesByName(@Query('title') title: string) {
        const recipe = await this.recipesService.searchRecipes(title);
        return plainToInstance(Recipe, recipe, { excludeExtraneousValues: true });
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get the recipe by id' })
    @ApiParam({ name: 'id', description: 'Recipe id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Recipe found' })
    @ApiResponse({ status: 404, description: 'Recipe not found' })
    async getRecipeById(@Param('id', ParseIntPipe) id: number) {
        const recipe = await this.recipesService.getRecipeById(id);

        if (!recipe) {
            throw new NotFoundException(`Recipe with id ${id} not found`);
        }

        return plainToInstance(Recipe, recipe, { excludeExtraneousValues: true });
    }

    @Put('/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Update the recipe by id' })
    @ApiParam({ name: 'id', description: 'Recipe id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Recipe updated' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden: Only the user who created the recipe or an admin can update it' })
    @ApiResponse({ status: 404, description: 'Recipe or product not found' })
    async updateRecipe(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: CreateRecipeDto,
        @Req() req,
    ) {
        const recipe = await this.recipesService.getRecipeById(id);
        if (!recipe) {
            throw new NotFoundException(`Recipe with id ${id} not found`);
        }

        const authenticatedUser = req.user as { id: number; isAdmin: boolean };
        if (!authenticatedUser.isAdmin && authenticatedUser.id !== recipe.user.id) {
            throw new ForbiddenException('Only the user who created the recipe or an admin can update it.');
        }

        const updatedRecipe = this.recipesService.updateRecipe(id, body.title, body.description, body.ingredients);
        return plainToInstance(Recipe, updatedRecipe, { excludeExtraneousValues: true });
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Delete the recipe by id' })
    @ApiParam({ name: 'id', description: 'Recipe id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Recipe successfully deleted' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden: Only the user who created the recipe or an admin can delete it' })
    @ApiResponse({ status: 404, description: 'Recipe not found' })
    async deleteRecipe(
        @Param('id', ParseIntPipe) id: number,
        @Req() req,
    ) {
        const recipe = await this.recipesService.getRecipeById(id);
        if (!recipe) {
            throw new NotFoundException(`Recipe with id ${id} not found`);
        }

        const authenticatedUser = req.user as { id: number; isAdmin: boolean };
        if (!authenticatedUser.isAdmin && authenticatedUser.id !== recipe.user.id) {
            throw new ForbiddenException('Only the user who created the recipe or an admin can delete it.');
        }

        await this.recipesService.deleteRecipe(id);
        return { message: 'Recipe successfully deleted' };
    }
}
