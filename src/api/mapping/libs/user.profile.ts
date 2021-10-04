import {
  AutoMapper, mapFrom, Profile, ProfileBase,
} from 'nestjsx-automapper';
import { AuthUserDto } from '../../dtos/auth/auth-user.dto';
import { UserDto } from '../../dtos/user/user.dto';
import { User } from '../../user/user.model';

@Profile()
export class UserProfile extends ProfileBase {
  constructor(private mapper: AutoMapper) {
    super();
    mapper
      .createMap(User, AuthUserDto);
    mapper.createMap(User, UserDto).forMember(
      (d) => d.fullName,
      mapFrom((s) => `${s.firstName} ${s.lastName}`),
    );
  }
}
