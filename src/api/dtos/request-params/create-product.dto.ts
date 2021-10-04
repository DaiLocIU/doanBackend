import { ApiProperty } from '@nestjs/swagger';
import { FileUploadDto } from '../upload/upload.dto';

export class CreateProductDto extends FileUploadDto {
    @ApiProperty({ required: true, maxLength: 100, example: 'iphone' })
    name: string;

    @ApiProperty({ required: true, minimum: 0 })
    price: number;

    @ApiProperty({ required: true, minimum: 0 })
    amount: number;
}
