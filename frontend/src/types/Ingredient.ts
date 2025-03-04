import { Product } from "./Product";

export interface Ingredient {
    id: number;
    product: Product;
    amount: number;
}