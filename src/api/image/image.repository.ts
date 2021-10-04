import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '../common/base.repository';
import { ModelType } from '../types';
import { ImgProduct } from './imgProduct.model';
import { CreateImageProductDto } from '../dtos/request-params/create-img-product.dto';

@Injectable()
export class ImageRepository extends BaseRepository<ImgProduct> {
  constructor(@InjectModel(ImgProduct.modelName)
  private readonly imgProductModel: ModelType<ImgProduct>) {
    super(imgProductModel);
  }

  async createImgDb(imgBig: CreateImageProductDto): Promise<ImgProduct> {
    const newImgProduct = this.createModel(imgBig);
    try {
      const result = await this.create(newImgProduct);
      return result.toJSON() as ImgProduct;
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findImgById(id:string): Promise<ImgProduct> {
    try {
      return await this.findById(id);
    } catch (e) {
      ImageRepository.throwMongoError(e);
    }
  }

  async updateImageById(id: string, { imgBig }:CreateImageProductDto): Promise<ImgProduct> {
    try {
      return await this.updateById(id, { imgBig });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
