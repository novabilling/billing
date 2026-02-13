import { Module, Global } from '@nestjs/common';
import { EmailService } from './email.service';
import { PdfService } from './pdf.service';
import { WebhookService } from './webhook.service';
import { CurrencyService } from './currency.service';

@Global()
@Module({
  providers: [EmailService, PdfService, WebhookService, CurrencyService],
  exports: [EmailService, PdfService, WebhookService, CurrencyService],
})
export class ServicesModule {}
