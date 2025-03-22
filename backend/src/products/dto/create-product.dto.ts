import { ApiProperty } from '@nestjs/swagger';
import { MinLength, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateProductDto {
  /**
   * The name of the product.
   * @example 'Apple'
   */
  @ApiProperty({ example: 'Apple', description: 'Name of the product' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: 'Name must be at least 1 characters long' })
  name: string;

  /**
   * The number of calories in the product.
   * @example 100
   */
  @ApiProperty({ example: 100, description: 'The number of calories in the product' })
  @IsNotEmpty()
  @IsNumber()
  calories: number;
}