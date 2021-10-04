import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product } from 'src/api/product/product.model';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ApiImageModule } from '../image/api-image.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.modelName, schema: Product.schema },
    ]),
    ApiImageModule,
  ],
  controllers: [ProductController],
  providers: [ProductRepository, ProductService],
  exports: [ProductService],
})
export class ApiProductModule {}
