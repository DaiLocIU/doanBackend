import { AutoMap } from 'nestjsx-automapper';
import { UserRole } from 'src/api/user/user-role.enum';
import { BaseDto } from '../../common/base.model';

export class AuthUserDto extends BaseDto {
  @AutoMap()
  readonly email: string;

  @AutoMap()
  role?: UserRole;
}
