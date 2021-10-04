import { ApiProperty } from '@nestjs/swagger';

export class RequestResetPassword {
    @ApiProperty({ required: true, maxLength: 100, example: 'expamle@gmail.com' })
    email: string;
}
