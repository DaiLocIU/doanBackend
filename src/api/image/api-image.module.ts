import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImgProduct } from 'src/api/image/imgProduct.model';
import { ImageService } from './image.service';
import { ImageRepository } from './image.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImgProduct.modelName, schema: ImgProduct.schema },
    ]),
  ],
  providers: [ImageRepository, ImageService],
  exports: [ImageService],
})
export class ApiImageModule {}
