import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/api/product/product.model';
import { Types } from 'mongoose';
import { BaseRepository } from '../common/base.repository';
import { ModelType } from '../types';
import { CreateProductDto } from '../dtos/request-params/create-product.dto';

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor(@InjectModel(Product.modelName) private readonly productModel: ModelType<Product>) {
    super(productModel);
  }

  async createProduct(params: CreateProductDto, imageProduct:Types.ObjectId): Promise<Product> {
    const newProduct = this.createModel({ ...params, imageProduct });
    try {
      const result = await this.create(newProduct);
      return result.toJSON() as Product;
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAll(): Promise<Product[]> {
    try {
      return await this.findAll();
    } catch (e) {
      ProductRepository.throwMongoError(e);
    }
  }

  async getProductById(id:string): Promise<Product> {
    try {
      return await this.findById(id);
    } catch (e) {
      ProductRepository.throwMongoError(e);
    }
  }

  async fullTextSearchProduct(textSearch: string): Promise<Product[]> {
    try {
      const products = await this.findByAggregate(
        [
          {
            $search: {
              autocomplete: {
                path: 'name',
                query: textSearch,
              },
            },
          }, {
            $project: {
              _id: 0,
              price: 1,
              name: 1,
              amount: 1,
              score: {
                $meta: 'searchScore',
              },
            },
          }, {
            $sort: {
              score: -1,
            },
          },
        ],
      );
      return products;
    } catch (e) {
      ProductRepository.throwMongoError(e);
    }
  }
}
