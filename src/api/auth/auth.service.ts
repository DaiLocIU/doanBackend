import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { sign, verify } from 'jsonwebtoken';
import { AutoMapper, InjectMapper } from 'nestjsx-automapper';
import { InjectAuthConfig } from '../configuration/auth.configuration';
import { AuthUserDto } from '../dtos/auth/auth-user.dto';
import { TokenResultDto } from '../dtos/auth/token-result.dto';
import { AuthConfig } from '../types';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectMapper() private readonly mapper: AutoMapper,
    @InjectAuthConfig() private readonly authConfig: AuthConfig,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async createAccessToken(email: string): Promise<TokenResultDto> {
    const tokenResult = new TokenResultDto();
    tokenResult.token = await this.jwtService.signAsync({ email });
    tokenResult.computeExpiry(this.authConfig.jwtExpired);
    return tokenResult;
  }

  async createRefreshToken(id: string, tokenId: string): Promise<string> {
    return sign({ id, tokenId },
      this.authConfig.refreshJwtSecret,
      { expiresIn: this.authConfig.refreshJwtExpired });
  }

  async createVerifyToken(email: string): Promise<string> {
    return await this.jwtService.signAsync({ email }, { expiresIn: '1h' });
  }

  async createResetPasswordToken(email: string): Promise<string> {
    const token = sign(
      { email },
      this.authConfig.jwtSecret,
      { expiresIn: this.authConfig.resetPasswordJwtExpired },
    );
    console.log(token);
    return token;
  }

  async verify<TPayload extends object = {}>(token: string): Promise<TPayload> {
    try {
      return await this.jwtService.verifyAsync<TPayload>(token);
    } catch (e) {
      throw new InternalServerErrorException(token, 'Error verifying token');
    }
  }

  async verifyResetPasswordToken(token:string): Promise<{email: string}> {
    console.log(`tokenvr ${token}`);
    try {
      return (await verify(token, this.authConfig.jwtSecret)) as {
        email: string
      };
    } catch (e) {
      throw new InternalServerErrorException(token, 'Error verifying token');
    }
  }

  async verifyRefreshToken(token: string): Promise<{ id: string; tokenId: string }> {
    try {
      return (await verify(token, this.authConfig.refreshJwtSecret)) as {
        id: string;
        tokenId: string;
      };
    } catch (e) {
      throw new InternalServerErrorException(token, 'Error verifying token');
    }
  }

  async validateUser({ email }: JwtPayload): Promise<AuthUserDto> {
    const user = await this.userService.findByEmail(email);
    return this.mapper.map(user, AuthUserDto, User);
  }
}
