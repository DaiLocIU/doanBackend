import {
  AutoMapper, mapFrom, Profile, ProfileBase,
} from 'nestjsx-automapper';
import { Product } from 'src/api/product/product.model';
import { ProductDto } from 'src/api/dtos/product/product.dto';

@Profile()
export class ProductProfile extends ProfileBase {
  constructor(private mapper: AutoMapper) {
    super();
    mapper
      .createMap(Product, ProductDto);
  }
}
