import {
  Controller, Post, UseInterceptors, UploadedFile, Body, Get, Param, Patch, Query,
} from '@nestjs/common';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { primaryStoreMulterOption } from 'src/shared/utils';
import { Product } from 'src/api/product/product.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImgProduct } from 'src/api/image/imgProduct.model';
import { ProductService } from './product.service';
import { CreateProductDto } from '../dtos/request-params/create-product.dto';
import { ApiController, ApiOperationId, ApiFile } from '../common/decorators/swagger.decorator';

@ApiController('product', 'Product')
@Controller('product')
export class ProductController {
  constructor(
        private ProductService: ProductService,
  ) {}

    @Post()
    @ApiOperationId({ summary: 'Create Product' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      type: CreateProductDto,
    })

    @UseInterceptors(FileInterceptor('file', {
      storage: primaryStoreMulterOption,
    }))
  async create(@UploadedFile() file, @Body() body:CreateProductDto): Promise<Product> {
    return file ? this.ProductService.createProduct(body, file.path)
      : this.ProductService.createProduct(body);
  }

    @Get()
    @ApiOperationId({ summary: 'Get All Product' })
    async getAll(): Promise<Product[]> {
      return this.ProductService.getProduct();
    }

    @Get('search')
    @ApiOperationId({ summary: 'Get All Product By Text' })
    async getProductByText(@Query('textSearch') textSearch: string) {
      return this.ProductService.getProductByText(textSearch);
    }

    @Get(':id')
    @ApiOperationId({ summary: 'Product By Id' })
    async getProductById(@Param('id') id:string): Promise<Product> {
      return this.ProductService.getProductById(id);
    }

    @Get(':id/images')
    @ApiOperationId({ summary: 'Img By ProductId' })
    async getImgByProductId(@Param('id') id:string): Promise<ImgProduct> {
      return this.ProductService.getImgByProductId(id);
    }

    @Patch(':id/images')
    @ApiOperationId({ summary: 'Update Image' })
    @ApiConsumes('multipart/form-data')
    @ApiFile()
    @UseInterceptors(FileInterceptor('file', {
      storage: primaryStoreMulterOption,
    }))
    async UpdateImgById(@UploadedFile() file, @Param('id') id:string): Promise<ImgProduct> {
      return this.ProductService.updateImgByProductId(id, file.path);
    }

    @Patch(':id/images/delete')
    @ApiOperationId({ summary: 'Update Image' })
    async deleteImgById(@Param('id') id:string): Promise<ImgProduct> {
      console.log(id);
      return this.ProductService.deleteImageByProductId(id);
    }
}
