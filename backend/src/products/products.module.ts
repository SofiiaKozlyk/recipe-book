import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]),
    UsersModule,
  ],
  controllers: [ProductsController],
  exports: [ProductsService, TypeOrmModule],
  providers: [ProductsService, TypeOrmModule]
})
export class ProductsModule { }
