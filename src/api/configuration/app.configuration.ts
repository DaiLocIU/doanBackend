import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

export const appConfiguration = registerAs('app', () => ({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8080,
  domain: process.env.DOMAIN || 'http://localhost:8080', // https://backendiuapp.herokuapp.com  http://localhost:8080
  env: process.env.ENV || 'development',
  clientDomain: process.env.CLIENT_DOMAIN || 'http://localhost:4200',
}));

export const InjectAppConfig = () => Inject(appConfiguration.KEY);
