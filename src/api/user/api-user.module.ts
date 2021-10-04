import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentType } from '@typegoose/typegoose';
import { genSalt, hash } from 'bcrypt';
import { authConfiguration } from '../configuration/auth.configuration';
import { AuthConfig } from '../types';
import { User } from './user.model';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.modelName,
        useFactory: (authConfig: AuthConfig) => {
          const { schema } = User;
          /* eslint-disable-next-line func-names */
          schema.pre<DocumentType<User>>('save', async function () {
            if (this.isModified('password')) {
              const salt = await genSalt(authConfig.salt);
              this.password = await hash(this.password, salt);
            }
          });
          // eslint-disable-next-line func-names
          schema.pre('findOneAndUpdate', async function () {
            const { password } = this.getUpdate().$set;
            if (password) {
              const salt = await genSalt(authConfig.salt);
              const passwordHash = await hash(password, salt);
              this.getUpdate().$set.password = passwordHash;
            }
          });
          // eslint-disable-next-line func-names
          return schema;
        },
        inject: [authConfiguration.KEY],
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class ApiUserModule {}
