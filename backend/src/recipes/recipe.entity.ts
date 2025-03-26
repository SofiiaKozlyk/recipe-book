import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { User } from '../users/user.entity';

@Entity()
export class Recipe {
    /**
   * Unique identifier of the recipe.
   * @example 1
   */
    @Expose()
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'Unique identifier of the recipe' })
    id: number;

    /**
   * The name of the recipe.
   * @example 'Apple Charlotte'
   */
    @Expose()
    @Column({ nullable: false })
    @ApiProperty({ example: 'Apple Charlotte', description: 'Name of the recipe' })
    title: string;

    /**
   * The description of the recipe.
   * @example 'To prepare apple charlotte, you will need...'
   */
    @Expose()
    @Column({ nullable: false })
    @ApiProperty({ example: 'To prepare apple charlotte, you will need...', description: 'Description of the recipe' })
    description: string;

    /**
   * List of recipe ingredients.
   */
    @Expose()
    @OneToMany(() => RecipeIngredient, (recipeIngredient) => recipeIngredient.recipe, { cascade: true })
    @ApiProperty({ type: () => RecipeIngredient, isArray: true, description: 'Recipe ingredients' })
    ingredients: RecipeIngredient[];

    /**
   * User who created the recipe.
   */
    @Expose()
    @ManyToOne(() => User, (user) => user.recipes, { nullable: false, onDelete: 'CASCADE', eager: true })
    @ApiProperty({ type: () => User, description: 'User who created the recipe' })
    user: User;
}