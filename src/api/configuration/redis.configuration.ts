import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

export const redisConfiguration = registerAs('redis', () => ({
  isCacheEnabled: true,
  host: process.env.REDIS_HOST || 'redis-12979.c51.ap-southeast-2-1.ec2.cloud.redislabs.com',
  port: Number(process.env.REDIS_PORT) || 12979,
  ttl: process.env.REDIS_TTL || 86400, // 1 day
  password: process.env.PASSWORD || 'rEZS6YR8u4tQMFrN76qapbIc6AxV1XQ0',
}));

export const InjectRedisConfig = () => Inject(redisConfiguration.KEY);
