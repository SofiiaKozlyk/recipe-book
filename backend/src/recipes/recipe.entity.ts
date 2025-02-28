import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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
}