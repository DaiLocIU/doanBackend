import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({ required: false, type: 'string', format: 'binary' })
  file?: any;
}
