import { AutoMap } from 'nestjsx-automapper';
import { BaseDto } from '../../common/base.model';

export class ImgProductDto extends BaseDto {
  @AutoMap()
  imgBig: string
}
