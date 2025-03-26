import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Recipe } from './recipe.entity';
import { Product } from '../products/product.entity';

@Entity()
export class RecipeIngredient {
    /**
   * Unique identifier of the recipe-product relationship.
   * @example 1
   */
    @Expose()
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'Unique identifier of the recipe-product relationship' })
    id: number;

    /**
   * The recipe to which the product belongs.
   */
    @Expose()
    @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, { onDelete: 'CASCADE' })
    @ApiProperty({ type: () => Recipe, description: 'The recipe to which the product belongs' })
    recipe: Recipe;

    /**
   * The product included in the recipe.
   */
    @Expose()
    @ManyToOne(() => Product, (product) => product.id, { onDelete: 'CASCADE' })
    @ApiProperty({ type: () => Product, description: 'The product included in the recipe' })
    product: Product;

    /**
   * Amount of product in grams.
   * @example 100
   */
    @Expose()
    @Column({ nullable: false })
    @ApiProperty({ example: 100, description: 'Amount of product in grams' })
    amount: number;
}