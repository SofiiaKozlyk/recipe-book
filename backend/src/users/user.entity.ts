import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Recipe } from '../recipes/recipe.entity';
import { Product } from '../products/product.entity';

@Entity()
export class User {
  @Expose()
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Unique identifier of the user' })
  id: number;

  @Expose()
  @Column({ unique: true })
  @ApiProperty({ example: 'username123', description: 'Unique username of the user' })
  username: string;

  @Expose()
  @Column({ unique: true })
  @ApiProperty({ example: 'user@example.com', description: 'Email of the user' })
  email: string;

  @Column()
  @ApiProperty({ example: 'hashedPassword', description: 'Hashed password of the user' })
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Recipe, (recipe) => recipe.user, { cascade: true })
  @ApiProperty({ type: () => [Recipe], isArray: true, description: 'List of recipes created by the user' })
  recipes: Recipe[];

  @OneToMany(() => Product, (product) => product.user, { cascade: true })
  @ApiProperty({ type: () => Product, isArray: true, description: 'Products created by user' })
  products: Product[];
}