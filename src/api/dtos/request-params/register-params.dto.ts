import { ApiProperty } from '@nestjs/swagger';
import { LoginParamsDto } from './login-params.dto';

export class RegisterParamsDto extends LoginParamsDto {
  @ApiProperty({ required: true, minLength: 6 })
  fullName: string;
}
