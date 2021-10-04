import { Injectable } from '@nestjs/common';
import { InjectMapper, AutoMapper } from 'nestjsx-automapper';
import { Product } from 'src/api/product/product.model';
import { Types } from 'mongoose';
import { ImgProduct } from 'src/api/image/imgProduct.model';
import { BaseService } from '../common/base.service';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from '../dtos/request-params/create-product.dto';
import { ImageService } from '../image/image.service';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
        private readonly productRepository: ProductRepository,
        private readonly imageService: ImageService,
        @InjectMapper() private readonly mapper: AutoMapper,
  ) {
    super(productRepository);
  }

  async createProduct(params: CreateProductDto, file: string = null): Promise<Product> {
    // Create Image Product
    const imageDb = await this.imageService.createImg(file);
    const imageProduct = Types.ObjectId(imageDb.id);

    return this.productRepository.createProduct(params, imageProduct);
  }

  async getProduct():Promise<Product[]> {
    return this.productRepository.getAll();
  }

  async getProductById(id: string):Promise<Product> {
    return this.productRepository.getProductById(id);
  }

  async getImgByProductId(id:string):Promise<ImgProduct> {
    const { imageProduct } = await this.getProductById(id) as any;
    return this.imageService.findImgById(imageProduct.id);
  }

  async updateImgByProductId(id: string, file: any) {
    const { imageProduct } = await this.getProductById(id) as any;
    return this.imageService.updateImgById(imageProduct.id, file);
  }

  async deleteImageByProductId(id:string) {
    const { imageProduct } = await this.getProductById(id) as any;
    return this.imageService.deleteImgeById(imageProduct.id);
  }

  async getProductByText(textSearch: string) {
    return this.productRepository.fullTextSearchProduct(textSearch);
  }
}
