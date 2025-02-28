import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
// import DataSource from './ormconfig';
import { config } from 'dotenv';
import { Product } from './products/product.entity';
import { RecipesModule } from './recipes/recipes.module';
import { Recipe } from './recipes/recipe.entity';

config();

// @Module({
//   imports: [
//     TypeOrmModule.forRootAsync({
//       useFactory: async () => ({
//         ...DataSource.options,
//       }),
//     }),
//     ProductsModule,
//   ],
//   controllers: [AppController],
//   providers: [],
// })

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    entities: [Product, Recipe],
  }),
    ProductsModule,
    RecipesModule,
  ]
})
export class AppModule { }
