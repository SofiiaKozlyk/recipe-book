import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

@Entity()
export class Product {
  @Expose()
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Unique identifier of the product' })
  id: number;

  @Expose()
  @Column({ nullable: false })
  @ApiProperty({ example: 'Apple', description: 'Name of the product' })
  name: string;

  @Expose()
  @Column({ nullable: false, default: 1 })
  @ApiProperty({ example: 100, description: 'The number of calories in the product' })
  calories: number;
}