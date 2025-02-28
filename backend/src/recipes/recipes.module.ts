import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, RecipeIngredient])],
  controllers: [RecipesController],
  providers: [RecipesService]
})
export class RecipesModule {}
