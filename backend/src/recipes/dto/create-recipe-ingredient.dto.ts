import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecipeIngredientDto {
  /**
   * Product id that is included in the recipe.
   * @example 1
   */
  @ApiProperty({ example: 1, description: 'Product id that is included in the recipe' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Product id must be a positive number' })
  productId: number;

  /**
   * Amount of product in grams.
   * @example 100
   */
  @ApiProperty({ example: 100, description: 'Amount of the product in grams' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Amount must be greater than zero' })
  amount: number;
}