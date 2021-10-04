import { Injectable } from '@nestjs/common';
import { AutoMapper, InjectMapper } from 'nestjsx-automapper';
import { parse } from 'date-fns';
import { BaseService } from '../common/base.service';
import { User } from './user.model';
import { UserRepository } from '../user/user.repository';
import { UserDto } from '../dtos/user/user.dto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectMapper() private readonly mapper: AutoMapper,
  ) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findByEmail(email);
  }

  async getUserById(id: string): Promise<User> {
    return this.userRepository.findById(id).exec();
  }

  async updateRefreshTokenId(id: string) {
    await this.userRepository.updateRefreshTokenId(id);
  }

  async verify(id: string): Promise<User> {
    const now = parse(
      new Date().toLocaleString(),
      'M/d/yyyy, h:mm:ss aaa',
      Date.now(),
    );
    const result = await this.userRepository
      .updateById(id, {
        $set: { verify: now },
      })
      .exec();

    return result;
  }

  async changePassword(id: string, newPassword: string): Promise<User> {
    return this.userRepository.changePassword(id, newPassword);
  }
}
