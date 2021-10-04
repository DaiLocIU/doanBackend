import { ApiPropertyOptional } from '@nestjs/swagger';
import { CloudinaryImg } from '../../image/imgProduct.model';

export class CreateImageProductDto {
    @ApiPropertyOptional({ required: false })
    imgBig?: CloudinaryImg
}
