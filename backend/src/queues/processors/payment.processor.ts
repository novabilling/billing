import { Processor, WorkerHost, InjectQueue } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { TenantDatabaseService } from '../../database/tenant-database.service';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { EncryptionService } from '../../services/encryption.service';
import { PdfService } from '../../services/pdf.service';
import { ProviderFactory } from '../../providers/provider.factory';
import { RecurringChargeService } from '../../modules/billing/recurring-charge.service';
import {
  PAYMENT_QUEUE,
  EMAIL_QUEUE,
  WEBHOOK_QUEUE,
  PaymentJobType,
  AutoChargeData,
  EmailJobType,
  WebhookJobType,
} from '../billing.queue';

@Processor(PAYMENT_QUEUE)
export class PaymentProcessor extends WorkerHost {
  private readonly logger = new Logger(PaymentProcessor.name);

  constructor(
    private readonly tenantDbService: TenantDatabaseService,
    private readonly centralPrisma: CentralPrismaService,
    private readonly encryptionService: EncryptionService,
    @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
    @InjectQueue(WEBHOOK_QUEUE) private readonly webhookQueue: Queue,
    private readonly recurring: RecurringChargeService,
  ) {
    super();
  }

  private async getTenantName(tenantId: string): Promise<string> {
    const tenant = await this.centralPrisma.client.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true },
    });
    return tenant?.name || 'Your billing provider';
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case PaymentJobType.PROCESS_PAYMENT:
      case PaymentJobType.RETRY_FAILED_PAYMENT:
        // Retired: these marked invoices paid when a checkout session was merely
        // created. Checkout payments settle by webhook; retries run through dunning.
        this.logger.warn(`Ignoring retired ${job.name} job for invoice ${job.data?.invoiceId}`);
        return;
      case PaymentJobType.PROCESS_REFUND:
        return this.handleRefund(job);
      case PaymentJobType.AUTO_CHARGE_PAYMENT_METHOD:
        return this.handleAutoCharge(job);
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }

  private async handleRefund(
    job: Job<{ tenantId: string; paymentId: string; amount?: number }>,
  ): Promise<void> {
    const { tenantId, paymentId, amount } = job.data;
    this.logger.log(`Processing refund for payment ${paymentId}`);

    try {
      const db = await this.tenantDbService.getTenantClient(tenantId);

      const payment = await db.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment || payment.status !== 'SUCCEEDED') {
        this.logger.warn(`Payment ${paymentId} not eligible for refund`);
        return;
      }

      const provider = await db.paymentProvider.findFirst({
        where: { providerName: payment.provider, isActive: true },
      });

      if (!provider) {
        this.logger.warn(`Provider ${payment.provider} not found`);
        return;
      }

      const credentials = JSON.parse(this.encryptionService.decrypt(provider.credentials));
      const providerInstance = ProviderFactory.create(provider.providerName, credentials);

      const result = await providerInstance.refund({
        transactionId: payment.providerTransactionId || '',
        amount,
        currency: payment.currency,
      });

      if (result.success) {
        await db.payment.update({
          where: { id: paymentId },
          data: { status: 'REFUNDED' },
        });

        // Email customer: refund processed
        const invoice = await db.invoice.findUnique({
          where: { id: payment.invoiceId },
          include: { customer: true },
        });
        if (invoice?.customer?.email) {
          const tenantName = await this.getTenantName(tenantId);
          await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
            tenantId,
            to: invoice.customer.email,
            subject: `Refund processed — ${tenantName}`,
            template: 'payment-refunded',
            context: {
              tenantName,
              customerName: invoice.customer.name || invoice.customer.email,
              amount: PdfService.formatAmount(amount ?? payment.amount, payment.currency),
              currency: payment.currency,
            },
          });
        }

        // Webhook: payment.refunded
        await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
          tenantId,
          event: 'payment.refunded',
          payload: {
            paymentId,
            invoiceId: payment.invoiceId,
            amount: amount ?? Number(payment.amount),
            currency: payment.currency,
          },
        });

        this.logger.log(`Refund succeeded for payment ${paymentId}`);
      } else {
        this.logger.warn(`Refund failed for payment ${paymentId}: ${result.error}`);
      }
    } catch (error) {
      this.logger.error(`Refund processing failed for payment ${paymentId}`, error);
      throw error;
    }
  }

  private async handleAutoCharge(job: Job<AutoChargeData>): Promise<void> {
    const { tenantId, invoiceId, subscriptionId, paymentMethodId } = job.data;
    this.logger.log(`Auto-charging payment method ${paymentMethodId} for invoice ${invoiceId}`);
    const db = await this.tenantDbService.getTenantClient(tenantId);

    const outcome = await this.recurring.chargeInvoice(db, tenantId, invoiceId, paymentMethodId, 'auto');
    if (outcome.result === 'skipped') {
      this.logger.log(`Auto-charge skipped for invoice ${invoiceId}: ${outcome.reason}`);
      return;
    }
    if (outcome.result !== 'failed') return;

    // Failed: one dunning schedule per invoice, and the subscription is past due.
    const open = await db.paymentRetry.findFirst({ where: { invoiceId, status: { in: ['PENDING', 'PROCESSING'] } }, select: { id: true } });
    if (!open) {
      await db.paymentRetry.create({
        data: {
          invoiceId,
          subscriptionId,
          maxAttempts: 3,
          nextRetryAt: new Date(Date.now() + 24 * 3600_000),
          lastError: outcome.error,
        },
      });
    }
    await db.subscription.updateMany({ where: { id: subscriptionId, status: 'ACTIVE' }, data: { status: 'PAST_DUE' } });
  }
}
