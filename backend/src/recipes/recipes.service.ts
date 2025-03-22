import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class RecipesService {
    constructor(
        @InjectRepository(Recipe) private recipeRepository: Repository<Recipe>,
        @InjectRepository(RecipeIngredient) private recipeIngredientRepository: Repository<RecipeIngredient>,
        @InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(User) private usersRepository: Repository<User>,
    ) { }

    /**
    * Retrieves all recipes.
    * 
    * @returns {Promise<Recipe[]>} - A list of recipes.
    */
    async getAllRecipes(): Promise<Recipe[]> {
        return this.recipeRepository.find({ relations: ['ingredients', 'ingredients.product'] });
    }

    /**
    * Retrieves a recipe by its unique ID.
    * 
    * @param {number} id - The ID of the recipe to retrieve.
    * @returns {Promise<Recipe | null>} - The recipe with the specified ID or null if not found.
    */
    async getRecipeById(id: number): Promise<Recipe | null> {
        return await this.recipeRepository.findOne({
            where: { id },
            relations: ['ingredients', 'ingredients.product'],
        });
    }

    /**
    * Creates a new recipe.
    * 
    * @param {string} title - The title of the recipe.
    * @param {string} description - The description of the recipe.
    * @param {Array<{ productId: number; amount: number }>} ingredients - The list of ingredients with their product IDs and amounts.
    * @param {number} userId - The ID of the user creating the recipe.
    * @returns {Promise<Recipe>} - The newly created recipe.
    * @throws {BadRequestException} - If the request data is invalid.
    * @throws {NotFoundException} - If a referenced user or product does not exist.
    */
    async createRecipe(title: string, description: string, ingredients: { productId: number; amount: number }[], userId: number) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const recipe = this.recipeRepository.create({ title, description, user });
        await this.recipeRepository.save(recipe);

        const recipeIngredients = ingredients.map((ing) =>
            this.recipeIngredientRepository.create({ recipe, product: { id: ing.productId }, amount: ing.amount }),
        );

        await this.recipeIngredientRepository.save(recipeIngredients);
        return this.getRecipeById(recipe.id);
    }

    /**
    * Updates an existing recipe.
    * 
    * @param {number} id - The ID of the recipe to update.
    * @param {string} title - The updated title of the recipe.
    * @param {string} description - The updated description of the recipe.
    * @param {Array<{ productId: number; amount: number }>} ingredients - The updated list of ingredients with their product IDs and amounts.
    * @returns {Promise<Recipe>} - The updated recipe.
    * @throws {BadRequestException} - If the request data is invalid.
    * @throws {NotFoundException} - If a referenced product does not exist.
    */
    async updateRecipe(id: number, title: string, description: string, ingredients: { productId: number; amount: number }[]) {
        const recipe = await this.recipeRepository.findOne({ where: { id } });

        if (title !== undefined) {
            if (typeof title !== 'string' || title.trim().length < 1) {
                throw new BadRequestException('Title must be a non-empty string');
            }
            recipe.title = title;
        }

        if (description !== undefined) {
            if (typeof description !== 'string' || description.trim().length < 1) {
                throw new BadRequestException('Description must be a non-empty string');
            }
            recipe.description = description;
        }

        await this.recipeRepository.save(recipe);

        if (ingredients !== undefined) {
            if (!Array.isArray(ingredients) || ingredients.length === 0) {
                throw new BadRequestException('Ingredients must be a non-empty array');
            }

            const recipeIngredients = [];
            for (const ing of ingredients) {
                if (!ing.productId || typeof ing.productId !== 'number' || ing.productId <= 0) {
                    throw new BadRequestException('Each ingredient must have a valid productId (positive number)');
                }

                if (!ing.amount || typeof ing.amount !== 'number' || ing.amount <= 0) {
                    throw new BadRequestException('Each ingredient must have a valid amount (greater than 0)');
                }

                const product = await this.productRepository.findOne({ where: { id: ing.productId } });
                if (!product) {
                    throw new NotFoundException(`Product with id ${ing.productId} not found`);
                }

                recipeIngredients.push(
                    this.recipeIngredientRepository.create({ recipe, product, amount: ing.amount })
                );
            }

            await this.recipeIngredientRepository.delete({ recipe: { id } });
            await this.recipeIngredientRepository.save(recipeIngredients);
        }

        return this.getRecipeById(id);
    }

    /**
    * Searches for recipes by title.
    * 
    * @param {string} title - The title of the recipe to search for.
    * @returns {Promise<Recipe[]>} - A list of recipes that match the search query.
    * @throws {BadRequestException} - If the query parameter is invalid.
    */
    async searchRecipes(title: string): Promise<Recipe[]> {
        if (typeof title !== 'string' || title.trim().length === 0) {
            throw new BadRequestException('Title must be a non-empty string');
        }

        return await this.recipeRepository.find({
            where: { title: ILike(`%${title}%`) },
            relations: ['ingredients', 'ingredients.product'],
        });
    }

    /**
    * Deletes a recipe by its unique ID.
    * 
    * @param {number} id - The ID of the recipe to delete.
    * @returns {Promise<void>} - A void promise indicating the deletion was successful.
    */
    async deleteRecipe(id: number): Promise<void> {
        await this.recipeRepository.delete(id);
    }
}
