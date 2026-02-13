import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { BILLING_QUEUE } from '../../queues/billing.queue';

@Module({
  imports: [BullModule.registerQueue({ name: BILLING_QUEUE })],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
