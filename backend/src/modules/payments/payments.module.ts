import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { EMAIL_QUEUE, WEBHOOK_QUEUE } from '../../queues/billing.queue';

@Module({
  imports: [BullModule.registerQueue({ name: EMAIL_QUEUE }, { name: WEBHOOK_QUEUE })],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
