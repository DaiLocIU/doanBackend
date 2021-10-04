import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { InjectMapper, AutoMapper } from 'nestjsx-automapper';
import { ImgProduct, CloudinaryImg } from 'src/api/image/imgProduct.model';
import { InjectCloudinaryConfig } from '../configuration/cloudinary.configuration';
import { CloudinaryConfig } from '../types/index';
import { ImageRepository } from './image.repository';
import { BaseService } from '../common/base.service';

@Injectable()
export class ImageService extends BaseService<ImgProduct> {
  constructor(
      @InjectCloudinaryConfig() private readonly cloudinaryConfig: CloudinaryConfig,
      private readonly imageRepository: ImageRepository,
      @InjectMapper() private readonly mapper: AutoMapper,

  ) {
    super(imageRepository);
    cloudinary.config({
      cloud_name: cloudinaryConfig.cloud_name,
      api_key: cloudinaryConfig.api_key,
      api_secret: cloudinaryConfig.api_secret,
    });
  }

  async uploadFile(file: any): Promise<UploadApiResponse> {
    try {
      return await cloudinary.uploader.upload(file);
    } catch (e) {
      throw new InternalServerErrorException(
              e.response?.body?.errors || e,
              `Error upload image${e.message}`,
      );
    }
  }

  async deleteImage(public_id:string) {
    try {
      return cloudinary.uploader.destroy(public_id);
    } catch (e) {
      throw new InternalServerErrorException(
              e.response?.body?.errors || e,
              `Error upload image${e.message}`,
      );
    }
  }

  async createImg(file:any): Promise<ImgProduct> {
    let imgBig: CloudinaryImg;
    if (!file) {
      imgBig = null;
    } else {
      const { public_id, secure_url } = await this.uploadFile(file);
      imgBig = {
        public_id,
        secure_url,
      };
    }
    return this.imageRepository.createImgDb({ imgBig });
  }

  async findImgById(id: string): Promise<ImgProduct> {
    return this.imageRepository.findImgById(id);
  }

  async updateImgById(id:string, file:any): Promise<ImgProduct> {
    const { public_id, secure_url } = await this.uploadFile(file);
    const { imgBig } = await this.findImgById(id);
    this.deleteImage(imgBig.public_id);
    return this.imageRepository.updateImageById(id, { imgBig: { public_id, secure_url } });
  }

  async deleteImgeById(id:string): Promise<ImgProduct> {
    const { imgBig } = await this.findImgById(id);
    this.deleteImage(imgBig.public_id);
    return this.imageRepository.updateImageById(
      id,
      { imgBig: null },
    );
  }
}
