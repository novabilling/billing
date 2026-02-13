import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BillingProcessor } from './processors/billing.processor';
import { PaymentProcessor } from './processors/payment.processor';
import { WebhookProcessor } from './processors/webhook.processor';
import { EmailProcessor } from './processors/email.processor';
import { DunningProcessor } from './processors/dunning.processor';
import { EmailService } from '../services/email.service';
import { PdfService } from '../services/pdf.service';
import { WalletsService } from '../modules/wallets/wallets.service';
import { TaxesService } from '../modules/taxes/taxes.service';
import { PlanOverridesService } from '../modules/plan-overrides/plan-overrides.service';
import { BILLING_QUEUE, PAYMENT_QUEUE, WEBHOOK_QUEUE, EMAIL_QUEUE } from './billing.queue';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          url: configService.get<string>('REDIS_URL'),
        },
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 200,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      }),
    }),
    BullModule.registerQueue(
      { name: BILLING_QUEUE },
      { name: PAYMENT_QUEUE },
      { name: WEBHOOK_QUEUE },
      { name: EMAIL_QUEUE },
      { name: 'dunning' },
    ),
  ],
  providers: [
    BillingProcessor,
    PaymentProcessor,
    WebhookProcessor,
    EmailProcessor,
    DunningProcessor,
    EmailService,
    PdfService,
    WalletsService,
    TaxesService,
    PlanOverridesService,
  ],
  exports: [BullModule],
})
export class QueuesModule {}
