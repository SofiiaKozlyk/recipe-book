import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RecipeIngredient } from './recipe-ingredient.entity';

@Entity()
export class Recipe {
    @Expose()
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'Unique identifier of the recipe' })
    id: number;

    @Expose()
    @Column({ nullable: false })
    @ApiProperty({ example: 'Apple Charlotte', description: 'Name of the recipe' })
    title: string;

    @Expose()
    @Column({ nullable: false })
    @ApiProperty({ example: 'To prepare apple charlotte, you will need...', description: 'Description of the recipe' })
    description: string;

    @OneToMany(() => RecipeIngredient, (recipeIngredient) => recipeIngredient.recipe, { cascade: true })
    @ApiProperty({ type: () => RecipeIngredient, isArray: true, description: 'Recipe ingredients' })
    ingredients: RecipeIngredient[];
}