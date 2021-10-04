import { prop } from '@typegoose/typegoose';
import { AutoMap } from 'nestjsx-automapper';
import { v4 as uuid } from 'uuid';
import { useMongoosePlugin } from '../common/decorators/use-mongoose-plugin.decorator';
import { BaseModel } from '../common/base.model';
import { UserRole } from './user-role.enum';

@useMongoosePlugin()
export class User extends BaseModel {
  @prop({
    required: true,
    unique: true,
    trim: true,
    minlength: 8,
    maxlength: 100,
    index: true,
  })
  @AutoMap()
  email: string;

  @prop({
    required: true, minlength: 1, maxlength: 100, index: true,
  })
  @AutoMap()
  firstName: string;

  @prop({
    required(this: User) {
      if (this.lastName === '') {
        return false;
      }

      return this.lastName == null;
    },
    maxlength: 100,
    index: true,
  })
  @AutoMap()
  lastName: string;

  @prop()
  @AutoMap()
  fullName:string;

  @prop({ required: true, minlength: 6 })
  password: string;

  @prop({ default: uuid() })
  refreshTokenId: string;

  @prop()
  @AutoMap()
  avatarUrl: string;

  @prop({ default: null })
  verify: Date;

  @prop({ enum: UserRole, default: UserRole.User })
  @AutoMap()
  role?: UserRole;

  @prop()
  oauthId?: string;
}
