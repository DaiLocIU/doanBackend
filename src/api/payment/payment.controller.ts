import { Get, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiController, ApiOperationId } from '../common/decorators/swagger.decorator';

@ApiController('Payment', 'Momo')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {
  }

  @Post()
  @ApiOperationId({ summary: 'testPayment' })
  async test() {
    return await this.paymentService.paymentTest();
  }
}
