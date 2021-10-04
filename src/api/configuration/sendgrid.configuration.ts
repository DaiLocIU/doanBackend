import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

export const sendGridConfiguration = registerAs('sendgird', () => ({
  api_key: process.env.API_KEY || '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',
}));

export const InjectSendGirdConfig = () => Inject(sendGridConfiguration.KEY);
