import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import DataSource from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...DataSource.options,
      }),
    }),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
