import { Module, HttpModule } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],

})
export class ApiPaymentModule {}
