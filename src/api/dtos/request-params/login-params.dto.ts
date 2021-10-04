import { ApiProperty } from '@nestjs/swagger';

export class LoginParamsDto {
  @ApiProperty({ required: true, minLength: 6, example: 'ledailoc' })
  email: string;

  @ApiProperty({
    required: true, minLength: 6, type: String, format: 'password', example: '111111',
  })
  password: string;
}
