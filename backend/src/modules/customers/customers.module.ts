import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { WEBHOOK_QUEUE } from '../../queues/billing.queue';

@Module({
  imports: [BullModule.registerQueue({ name: WEBHOOK_QUEUE })],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
