import { ApiProperty } from '@nestjs/swagger';

export class VerifyRegistrationParamsDto {
  @ApiProperty()
  token: string;
}
