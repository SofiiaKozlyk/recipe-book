import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';

@Injectable()
export class RecipesService {
    constructor(
        @InjectRepository(Recipe) private recipeRepository: Repository<Recipe>,
        @InjectRepository(RecipeIngredient) private recipeIngredientRepository: Repository<RecipeIngredient>
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

    async createRecipe(title: string, description: string, ingredients: { productId: number; amount: number }[]) {
        const recipe = this.recipeRepository.create({ title, description });
        await this.recipeRepository.save(recipe);

        const recipeIngredients = ingredients.map((ing) =>
            this.recipeIngredientRepository.create({ recipe, product: { id: ing.productId }, amount: ing.amount }),
        );

        await this.recipeIngredientRepository.save(recipeIngredients);
        return this.getRecipeById(recipe.id);
    }
}
