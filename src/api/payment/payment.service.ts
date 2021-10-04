import { Injectable } from '@nestjs/common';
import crypto from 'crypto-js';
import https from 'https';
import { v4 as uuid } from 'uuid';
import { InjectMomoConfig } from '../configuration/momo.configuration';
import { MomoConfig } from '../types/index';

interface IRequestPayment {
    partnerCode: string,
    accessKey: string,
    requestId: string,
    amount: string,
    orderId: string,
    orderInfo: string,
    returnUrl: string,
    notifyUrl: string,
    requestType: string,
    signature: string,
    extraData: string
}

@Injectable()
export class PaymentService {
  constructor(@InjectMomoConfig() private readonly momoConfig: MomoConfig) {}

  async paymentTest() {
    const { partnerCode } = this.momoConfig;
    const { accessKey } = this.momoConfig;
    const requestId = uuid();
    const amount = '20000';
    const orderId = uuid();
    const orderInfo = 'Buy Ticket Football';
    const notifyUrl = 'https://momo.vn';
    const returnUrl = 'https://momo.vn';
    const requestType = 'captureMoMoWallet';
    const extraData = 'loc.ldl.itou@gmail.com';

    const rawSignature = `partnerCode=${partnerCode}&accessKey=${accessKey}&requestId=${requestId}&amount=${amount}&orderId=${orderId}&orderInfo=${orderInfo}&returnUrl=${returnUrl}&notifyUrl=${notifyUrl}&extraData=${extraData}`;

    const signature = crypto.HmacSHA256(rawSignature, this.momoConfig.secretKey).toString();

    const data = JSON.stringify({
      partnerCode,
      accessKey,
      requestId,
      requestType,
      amount,
      orderId,
      orderInfo,
      notifyUrl,
      returnUrl,
      extraData,
      signature,
    });

    let dataRespone: any;

    const options = {
      hostname: 'test-payment.momo.vn',
      port: 443,
      path: '/gw_payment/transactionProcessor',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    function doRequest(options, data) {
      return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          res.setEncoding('utf8');
          res.on('data', (body) => {
            dataRespone = body;
          });
          res.on('end', () => {
            resolve(JSON.parse(dataRespone));
          });
        });

        req.on('error', (e) => {
          reject(e);
        });

        // write data to request body
        req.write(data);
        req.end();
      });
    }
    return doRequest(options, data);
  }
}
