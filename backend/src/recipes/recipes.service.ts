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

    async getAllRecipes(): Promise<Recipe[]> {
        return this.recipeRepository.find({ relations: ['ingredients', 'ingredients.product'] });
    }

    async getRecipeById(id: number): Promise<Recipe | null> {
        return await this.recipeRepository.findOne({
            where: { id },
            relations: ['ingredients', 'ingredients.product'],
        });
    }

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

    async searchRecipes(title: string): Promise<Recipe[]> {
        if (typeof title !== 'string' || title.trim().length === 0) {
            throw new BadRequestException('Title must be a non-empty string');
        }

        return await this.recipeRepository.find({
            where: { title: ILike(`%${title}%`) },
            relations: ['ingredients', 'ingredients.product'],
        });
    }

    async deleteRecipe(id: number): Promise<void> {
        await this.recipeRepository.delete(id);
    }
}
