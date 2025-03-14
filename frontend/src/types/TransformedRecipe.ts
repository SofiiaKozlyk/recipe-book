import { Recipe } from "./Recipe";

export interface TransformedIngredient {
    id: string;
    productId: number;
    amount: number;
    name: string;
}

export interface TransformedRecipe extends Omit<Recipe, "ingredients"> {
    ingredients: TransformedIngredient[];
}