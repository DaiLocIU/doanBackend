import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

export const cloudinaryConfiguration = registerAs('cloudinary', () => ({
  cloud_name: process.env.CLOUD_NAME || 'lovepoem',
  api_key: process.env.API_KEY || '284888328875888',
  api_secret: process.env.API_SECRET || 'VtSvgk8y39Geh76HLJf1g6UpKjA',
}));

export const InjectCloudinaryConfig = () => Inject(cloudinaryConfiguration.KEY);
