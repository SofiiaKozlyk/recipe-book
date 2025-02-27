import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import DataSource from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...DataSource.options,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
