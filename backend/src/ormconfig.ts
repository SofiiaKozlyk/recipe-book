import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Product } from './products/product.entity';
import { Recipe } from './recipes/recipe.entity';
import { RecipeIngredient } from './recipes/recipe-ingredient.entity';
import { User } from './users/user.entity';

config();

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    migrations: ['./src/migrations/*.ts'],
    synchronize: false,
    entities: [Product, Recipe, RecipeIngredient, User],
});
