import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

export const webConfiguration = registerAs('web', () => ({
  verifyEndpoint: '/verify',
  resetPasswordEndpoint: '/resetPassword',
}));

export const InjectWebConfig = () => Inject(webConfiguration.KEY);
