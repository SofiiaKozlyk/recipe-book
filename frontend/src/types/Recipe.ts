import { Ingredient } from "./Ingredient";

export interface Recipe {
    id: number;
    title: string;
    description: string;
    ingredients: Ingredient[];
}