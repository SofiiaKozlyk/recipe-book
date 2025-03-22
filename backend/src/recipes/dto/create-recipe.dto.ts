import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateRecipeIngredientDto } from './create-recipe-ingredient.dto';

export class CreateRecipeDto {
  /**
   * The name of the recipe.
   * @example 'Apple Charlotte'
   */
  @ApiProperty({ example: 'Apple Charlotte', description: 'Name of the recipe' })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  /**
   * The description of the recipe.
   * @example 'To prepare apple charlotte, you will need...'
   */
  @ApiProperty({ example: 'To prepare apple charlotte, you will need...', description: 'Description of the recipe' })
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  /**
   * List of recipe ingredients.
   */
  @ApiProperty({ type: () => CreateRecipeIngredientDto, isArray: true, description: 'List of ingredients' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  ingredients: CreateRecipeIngredientDto[];
}