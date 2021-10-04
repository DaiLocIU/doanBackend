import { prop, Ref, index } from '@typegoose/typegoose';
import { AutoMap } from 'nestjsx-automapper';
import { BaseModel } from '../common/base.model';
import { useMongoosePlugin } from '../common/decorators/use-mongoose-plugin.decorator';
import { ImgProduct } from '../image/imgProduct.model';

@useMongoosePlugin()
export class Product extends BaseModel {
  @prop({
    required: true,
    unique: true,
    maxlength: 100,
    index: true,
  })
  @AutoMap()
  name: string;

  @prop({
    required: true,
    float: true,
  })
  @AutoMap()
  price: number;

  @prop({
    required: true,
    min: 0,
  })
  @AutoMap()
  amount: number;

  @prop({ ref: ImgProduct, autopopulate: true, default: null })
  @AutoMap(() => ImgProduct)
  imageProduct: Ref<ImgProduct>;
}
