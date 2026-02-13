import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { WEBHOOK_QUEUE } from '../../queues/billing.queue';

@Module({
  imports: [BullModule.registerQueue({ name: WEBHOOK_QUEUE })],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule {}
