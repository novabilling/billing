import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { WEBHOOK_QUEUE } from '../../queues/billing.queue';
import { IdempotencyInterceptor } from '../../common/idempotency/idempotency.interceptor';
import { WalletsModule } from '../wallets/wallets.module';
import { CollectionsController, MoneySettingsController, PayoutsController, TransfersController } from './money.controller';
import { MoneyPollerService } from './money-poller.service';
import { MoneyService } from './money.service';
import { ProviderRegistryService } from './provider-registry.service';
import { YoWebhooksController } from './yo-webhooks.controller';

@Module({
  imports: [WalletsModule, BullModule.registerQueue({ name: WEBHOOK_QUEUE })],
  controllers: [CollectionsController, PayoutsController, TransfersController, MoneySettingsController, YoWebhooksController],
  providers: [MoneyService, ProviderRegistryService, MoneyPollerService, IdempotencyInterceptor],
  exports: [MoneyService],
})
export class MoneyModule {}
