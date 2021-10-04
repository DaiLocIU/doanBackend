import { Response, Request } from 'express';
import {
  Post, Controller, Res, Body, Req, Param, Put, HttpStatus,
} from '@nestjs/common';
import {
  ApiTags, ApiOkResponse, ApiCreatedResponse, ApiCookieAuth,
} from '@nestjs/swagger';
import { UserDto } from '../dtos/user/user.dto';
import { ChangePassword } from '../dtos/request-params/change-password.dto';
import { RequestResetPassword } from '../dtos/request-params/request-reset-password.dto';
import { Cookie } from '../common/decorators/cookie.decorator';
import { InjectAppConfig } from '../configuration/app.configuration';
import { TokenResultDto } from '../dtos/auth/token-result.dto';
import { LoginOauthParamsDto } from '../dtos/request-params/login-oauth-params.dto';
import { LoginParamsDto } from '../dtos/request-params/login-params.dto';
import { RegisterParamsDto } from '../dtos/request-params/register-params.dto';
import { AppConfig } from '../types/index';
import { SecurityService } from './security.service';
import { ApiOperationId, ApiErrors } from '../common/decorators/swagger.decorator';
import { VerifyRegistrationParamsDto } from '../dtos/request-params/verify-registration-params.dto';

@Controller('auth')
@ApiTags('Security')
@ApiErrors()
export class SecurityController {
  constructor(
    private readonly securityService: SecurityService,
    @InjectAppConfig() private readonly appConfig: AppConfig,
  ) {}

  @Post('refreshToken')
  @ApiCreatedResponse({
    type: TokenResultDto,
    headers: {
      'Set-Cookie': {
        description: 'Login',
        schema: { type: 'string' },
      },
    },
  })
  @ApiOperationId()
  @ApiCookieAuth()
  async refreshToken(@Cookie('rtok') refreshToken: string, @Res() res: Response): Promise<TokenResultDto> {
    const [tokenResult, newToken] = await this.securityService.refresh(refreshToken);
    res.cookie('rtok', newToken, {
      httpOnly: true,
      secure: this.appConfig.env !== 'development',
    }).status(HttpStatus.CREATED)
      .json(tokenResult);
    return tokenResult;
  }

  @Post('register')
  @ApiOkResponse({ type: UserDto })
  @ApiOperationId({ summary: 'Register new User' })
  async register(@Body() registerParams: RegisterParamsDto):Promise<UserDto> {
    return await this.securityService.register(registerParams);
  }

  @Put('verify')
  @ApiOkResponse({ type: UserDto })
  @ApiOperationId()
  async verify(
    @Body() verifyParams: VerifyRegistrationParamsDto,
  ): Promise<UserDto> {
    return await this.securityService.verify(verifyParams.token);
  }

  @Post('login')
  @ApiCreatedResponse({
    type: TokenResultDto,
    headers: {
      'Set-Cookie': {
        description: 'Login',
        schema: { type: 'string' },
      },
    },
  })
  @ApiOperationId()
  async login(@Body() loginParams: LoginParamsDto, @Req() req: Request): Promise<TokenResultDto> {
    const [tokenResult, refreshToken] = await this.securityService.login(loginParams);
    req.res.cookie('rtok', refreshToken, {
      httpOnly: true,
      secure: this.appConfig.env !== 'development',
    });
    return tokenResult;
  }

  // @Post('loginOauth')
  // @ApiOperationId()
  // async loginOauth(
  //   @Body() loginParams: LoginOauthParamsDto,
  //   @Req() req: Request,
  // ): Promise<TokenResultDto> {
  //   const [tokenResult, refreshToken] = await this.securityService.loginOauth(loginParams);
  //   req.res.cookie('rtok', refreshToken, {
  //     httpOnly: true,
  //     secure: this.appConfig.env !== 'development',
  //   });
  //   return tokenResult;
  // }

  @Post('logout')
  @ApiOperationId()
  async logout(@Cookie('rtok') refreshToken: string, @Req() req: Request): Promise<void> {
    await this.securityService.revoke(refreshToken, req.res);
    req.res.clearCookie('rtok');
  }

  @Post('requestResetPassword')
  @ApiOkResponse({ type: String })
  @ApiOperationId()
  async requestResetPassword(@Body() body: RequestResetPassword): Promise<string> {
    const resetPasswordToken = await this.securityService.resquetResetPassword(body.email);
    return resetPasswordToken;
  }

  @Post('resetPassword/:token')
  @ApiOkResponse({ type: UserDto })
  @ApiOperationId()
  async resetPassword(@Param('token') token:string, @Body() body:ChangePassword): Promise<UserDto> {
    console.log(token);
    return await this.securityService.resetPassword(token, body.newPassword);
  }
}
