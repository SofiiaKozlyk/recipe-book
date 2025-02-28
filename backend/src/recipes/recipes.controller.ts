import { BadRequestException, Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecipesService } from './recipes.service';
import { Recipe } from './recipe.entity';
import { ProductsService } from '../products/products.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';

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
        return this.recipesService.getAllRecipes();
    }

    @Post()
    @ApiOperation({ summary: 'Add a new recipe' })
    @ApiResponse({ status: 201, description: 'Recipe successfully created' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async createRecipe(
        @Body() @Body() body: CreateRecipeDto) {

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

        return this.recipesService.createRecipe(body.title, body.description, body.ingredients);
    }
}
