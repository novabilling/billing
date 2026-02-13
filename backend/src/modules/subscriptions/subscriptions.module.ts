import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { WEBHOOK_QUEUE, EMAIL_QUEUE, BILLING_QUEUE } from '../../queues/billing.queue';
import { CentralPrismaService } from '../../database/central-prisma.service';

@Module({
  imports: [BullModule.registerQueue({ name: WEBHOOK_QUEUE }, { name: EMAIL_QUEUE }, { name: BILLING_QUEUE })],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, CentralPrismaService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
