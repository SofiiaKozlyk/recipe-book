import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Recipe } from '../recipes/recipe.entity';
import { Product } from '../products/product.entity';

@Entity()
export class User {
  /**
   * Unique identifier of the user.
   * @example 1
   */
  @Expose()
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Unique identifier of the user' })
  id: number;

  /**
   * The unique username for the user.
   * @example 'username123'
   */
  @Expose()
  @Column({ unique: true })
  @ApiProperty({ example: 'username123', description: 'Unique username of the user' })
  username: string;

  /**
   * The email of the user.
   * @example 'user@example.com'
   */
  @Expose()
  @Column({ unique: true })
  @ApiProperty({ example: 'user@example.com', description: 'Email of the user' })
  email: string;

  /**
   * The hashed password of the user.
   */
  @Column()
  @ApiProperty({ example: 'hashedPassword', description: 'Hashed password of the user' })
  password: string;

  /**
   * Indicates if the user is an admin.
   * @default false
   */
  @Column({ default: false })
  isAdmin: boolean;

  /**
   * List of recipes created by the user.
   */
  @OneToMany(() => Recipe, (recipe) => recipe.user, { cascade: true })
  @ApiProperty({ type: () => [Recipe], isArray: true, description: 'List of recipes created by the user' })
  recipes: Recipe[];

  /**
   * List of products created by the user.
   */
  @OneToMany(() => Product, (product) => product.user, { cascade: true })
  @ApiProperty({ type: () => Product, isArray: true, description: 'Products created by user' })
  products: Product[];
}