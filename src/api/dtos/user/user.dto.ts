import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AutoMap } from 'nestjsx-automapper';
import { UserRole } from 'src/api/user/user-role.enum';
import { BaseDto } from '../../common/base.model';

export class UserDto extends BaseDto {
  @ApiPropertyOptional()
  @AutoMap()
  email: string;

  @ApiPropertyOptional()
  @AutoMap()
  firstName: string;

  @ApiPropertyOptional()
  @AutoMap()
  lastName: string;

  @ApiPropertyOptional()
  @AutoMap()
  fullName: string;

  @ApiProperty()
  refreshTokenId: string;

  @ApiPropertyOptional()
  @AutoMap()
  avatarUrl: string;

  @ApiProperty({ default: null })
  verify: Date;

  @ApiProperty({ enum: UserRole, default: null })
  @AutoMap()
  role?: UserRole;
}
