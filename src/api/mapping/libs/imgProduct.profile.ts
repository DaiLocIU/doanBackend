import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { ImgProduct } from 'src/api/image/imgProduct.model';
import { ImgProductDto } from 'src/api/dtos/imgProduct/imgProduct.dto';

@Profile()
export class ImgProductProfile extends ProfileBase {
  constructor(private mapper: AutoMapper) {
    super();
    mapper
      .createMap(ImgProduct, ImgProductDto);
  }
}
