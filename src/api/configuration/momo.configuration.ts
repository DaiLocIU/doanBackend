import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

export const momoConfiguration = registerAs('momo', () => ({
  partnerCode: process.env.PARTNER_CODE || 'MOMOY1ZA20200907',
  accessKey: process.env.ACCESS_KEY || 'rVuWIV2U6YHmb803',
  secretKey: process.env.SECRET_KEY || 'EQeEkD4sirbclirmqPv5qXDrcLu2h5EZ',
  apiEndpoint: process.env.API_ENDPOINT || 'https://test-payment.momo.vn/gw_payment/transactionProcessor',
}));

export const InjectMomoConfig = () => Inject(momoConfiguration.KEY);
