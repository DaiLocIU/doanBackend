import { ApiProperty } from '@nestjs/swagger';

export class ChangePassword {
    @ApiProperty({ required: true, maxLength: 100, example: 'newPassword' })
    newPassword: string;
}
