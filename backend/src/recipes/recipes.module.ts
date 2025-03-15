import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe, RecipeIngredient]),
    ProductsModule,
    UsersModule,
  ],
  controllers: [RecipesController],
  providers: [RecipesService]
})
export class RecipesModule { }
