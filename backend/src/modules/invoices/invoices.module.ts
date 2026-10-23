import { Module } from '@nestjs/common';
import { WalletsModule } from '../wallets/wallets.module';
import { BullModule } from '@nestjs/bullmq';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { PdfService } from '../../services/pdf.service';
import { EMAIL_QUEUE, WEBHOOK_QUEUE } from '../../queues/billing.queue';

@Module({
  imports: [BullModule.registerQueue({ name: EMAIL_QUEUE }, { name: WEBHOOK_QUEUE }), WalletsModule],
  controllers: [InvoicesController],
  providers: [InvoicesService, PdfService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
