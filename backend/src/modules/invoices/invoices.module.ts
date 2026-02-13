import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { PdfService } from '../../services/pdf.service';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { EMAIL_QUEUE, WEBHOOK_QUEUE } from '../../queues/billing.queue';

@Module({
  imports: [BullModule.registerQueue({ name: EMAIL_QUEUE }, { name: WEBHOOK_QUEUE })],
  controllers: [InvoicesController],
  providers: [InvoicesService, PdfService, CentralPrismaService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
