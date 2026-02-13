import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { WebhooksController } from './webhooks.controller';
import { WEBHOOK_QUEUE, EMAIL_QUEUE } from '../../queues/billing.queue';

@Module({
  imports: [BullModule.registerQueue({ name: WEBHOOK_QUEUE }, { name: EMAIL_QUEUE })],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
