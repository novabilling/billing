import { Processor, WorkerHost, InjectQueue } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { TenantDatabaseService } from '../../database/tenant-database.service';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { EncryptionService } from '../../services/encryption.service';
import { PdfService } from '../../services/pdf.service';
import { ProviderFactory } from '../../providers/provider.factory';
import {
  PAYMENT_QUEUE,
  EMAIL_QUEUE,
  WEBHOOK_QUEUE,
  PaymentJobType,
  ProcessPaymentData,
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
        return this.handleProcessPayment(job);
      case PaymentJobType.RETRY_FAILED_PAYMENT:
        return this.handleProcessPayment(job);
      case PaymentJobType.PROCESS_REFUND:
        return this.handleRefund(job);
      case PaymentJobType.AUTO_CHARGE_PAYMENT_METHOD:
        return this.handleAutoCharge(job);
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }

  private async handleProcessPayment(job: Job<ProcessPaymentData>): Promise<void> {
    const { tenantId, invoiceId } = job.data;
    this.logger.log(`Processing payment for invoice ${invoiceId}`);

    try {
      const db = await this.tenantDbService.getTenantClient(tenantId);

      const invoice = await db.invoice.findUnique({
        where: { id: invoiceId },
        include: { customer: true },
      });

      if (!invoice) {
        this.logger.warn(`Invoice ${invoiceId} not found`);
        return;
      }

      // Get active payment provider
      const provider = await db.paymentProvider.findFirst({
        where: { isActive: true },
        orderBy: { priority: 'asc' },
      });

      if (!provider) {
        this.logger.warn('No active payment provider found');
        return;
      }

      const credentials = JSON.parse(this.encryptionService.decrypt(provider.credentials));
      const providerInstance = ProviderFactory.create(provider.providerName, credentials);

      const payment = await db.payment.create({
        data: {
          invoiceId,
          provider: provider.providerName,
          amount: invoice.amount,
          currency: invoice.currency,
          status: 'PROCESSING',
        },
      });

      const result = await providerInstance.charge({
        amount: Number(invoice.amount),
        currency: invoice.currency,
        email: invoice.customer.email,
        reference: invoice.id,
      });

      if (result.success) {
        await db.payment.update({
          where: { id: payment.id },
          data: {
            status: 'SUCCEEDED',
            providerTransactionId: result.transactionId,
          },
        });

        await db.invoice.update({
          where: { id: invoiceId },
          data: { status: 'PAID', paidAt: new Date() },
        });

        // Email customer: payment confirmation
        if (invoice.customer?.email) {
          const tenantName = await this.getTenantName(tenantId);
          await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
            tenantId,
            to: invoice.customer.email,
            subject: `Payment received for ${invoice.invoiceNumber || invoiceId} — ${tenantName}`,
            template: 'payment-confirmation',
            context: {
              tenantName,
              customerName: invoice.customer.name || invoice.customer.email,
              amount: PdfService.formatAmount(invoice.amount, invoice.currency),
              currency: invoice.currency,
            },
          });
        }

        // Webhook: payment.succeeded
        await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
          tenantId,
          event: 'payment.succeeded',
          payload: {
            paymentId: payment.id,
            invoiceId,
            amount: Number(invoice.amount),
            currency: invoice.currency,
            provider: provider.providerName,
          },
        });

        this.logger.log(`Payment succeeded for invoice ${invoiceId}`);
      } else {
        await db.payment.update({
          where: { id: payment.id },
          data: {
            status: 'FAILED',
            failureReason: result.error,
          },
        });

        // Email customer: payment failed
        if (invoice.customer?.email) {
          const tenantName = await this.getTenantName(tenantId);
          await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
            tenantId,
            to: invoice.customer.email,
            subject: `Payment failed — ${tenantName}`,
            template: 'payment-failed',
            context: {
              tenantName,
              customerName: invoice.customer.name || invoice.customer.email,
              amount: PdfService.formatAmount(invoice.amount, invoice.currency),
              currency: invoice.currency,
              reason: result.error || 'Payment could not be processed',
            },
          });
        }

        // Webhook: payment.failed
        await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
          tenantId,
          event: 'payment.failed',
          payload: {
            paymentId: payment.id,
            invoiceId,
            amount: Number(invoice.amount),
            currency: invoice.currency,
            error: result.error,
          },
        });

        this.logger.warn(`Payment failed for invoice ${invoiceId}: ${result.error}`);
      }
    } catch (error) {
      this.logger.error(`Payment processing failed for invoice ${invoiceId}`, error);
      throw error;
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

    try {
      const db = await this.tenantDbService.getTenantClient(tenantId);

      const invoice = await db.invoice.findUnique({
        where: { id: invoiceId },
        include: { customer: true },
      }) as any;

      if (!invoice || invoice.status === 'PAID') {
        this.logger.log(`Invoice ${invoiceId} already paid or not found, skipping auto-charge`);
        return;
      }

      const paymentMethod = await (db as any).paymentMethod.findUnique({
        where: { id: paymentMethodId },
      });

      if (!paymentMethod) {
        this.logger.warn(`Payment method ${paymentMethodId} not found`);
        return;
      }

      const providerConfig = await db.paymentProvider.findFirst({
        where: { providerName: paymentMethod.provider, isActive: true },
      });

      if (!providerConfig) {
        this.logger.warn(`Provider ${paymentMethod.provider} not active for auto-charge`);
        return;
      }

      const credentials = JSON.parse(this.encryptionService.decrypt(providerConfig.credentials));
      const provider = ProviderFactory.create(providerConfig.providerName, credentials);

      if (!provider.chargePaymentMethod) {
        this.logger.warn(`Provider ${providerConfig.providerName} does not support recurring charges`);
        return;
      }

      const payment = await db.payment.create({
        data: {
          invoiceId,
          provider: providerConfig.providerName,
          amount: invoice.amount,
          currency: invoice.currency,
          status: 'PROCESSING',
        },
      });

      const result = await provider.chargePaymentMethod({
        paymentMethodId: paymentMethod.tokenId,
        amount: Number(invoice.amount),
        currency: invoice.currency,
        reference: invoice.invoiceNumber || invoiceId,
        customerId: paymentMethod.customerId,
        metadata: {
          invoiceId,
          subscriptionId,
          email: invoice.customer?.email || '',
          firstName: invoice.customer?.name?.split(' ')[0] || '',
          lastName: invoice.customer?.name?.split(' ').slice(1).join(' ') || '',
        },
      });

      if (result.success) {
        await db.payment.update({
          where: { id: payment.id },
          data: { status: 'SUCCEEDED', providerTransactionId: result.transactionId },
        });

        await db.invoice.update({
          where: { id: invoiceId },
          data: { status: 'PAID', paidAt: new Date() },
        });

        // Email customer: payment confirmation
        if (invoice.customer?.email) {
          const tenantName = await this.getTenantName(tenantId);
          await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
            tenantId,
            to: invoice.customer.email,
            subject: `Payment received for ${invoice.invoiceNumber || invoiceId} — ${tenantName}`,
            template: 'payment-confirmation',
            context: {
              tenantName,
              customerName: invoice.customer.name || invoice.customer.email,
              amount: PdfService.formatAmount(invoice.amount, invoice.currency),
              currency: invoice.currency,
            },
          });
        }

        // Webhook: payment.succeeded
        await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
          tenantId,
          event: 'payment.succeeded',
          payload: {
            paymentId: payment.id,
            invoiceId,
            subscriptionId,
            amount: Number(invoice.amount),
            currency: invoice.currency,
            provider: providerConfig.providerName,
            automatic: true,
          },
        });

        this.logger.log(`Auto-charge succeeded for invoice ${invoiceId}`);
      } else {
        await db.payment.update({
          where: { id: payment.id },
          data: { status: 'FAILED', failureReason: result.error },
        });

        // Create payment retry record for dunning
        const retryAt = new Date();
        retryAt.setDate(retryAt.getDate() + 1);
        await (db as any).paymentRetry.create({
          data: {
            invoiceId,
            subscriptionId,
            maxAttempts: 3,
            nextRetryAt: retryAt,
            lastError: result.error,
          },
        });

        // Mark subscription as PAST_DUE
        await db.subscription.update({
          where: { id: subscriptionId },
          data: { status: 'PAST_DUE' },
        });

        // Email customer: payment failed
        if (invoice.customer?.email) {
          const tenantName = await this.getTenantName(tenantId);
          await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
            tenantId,
            to: invoice.customer.email,
            subject: `Payment failed — ${tenantName}`,
            template: 'payment-failed',
            context: {
              tenantName,
              customerName: invoice.customer.name || invoice.customer.email,
              amount: PdfService.formatAmount(invoice.amount, invoice.currency),
              currency: invoice.currency,
              reason: result.error || 'Payment could not be processed',
            },
          });
        }

        // Webhook: payment.failed
        await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
          tenantId,
          event: 'payment.failed',
          payload: {
            paymentId: payment.id,
            invoiceId,
            subscriptionId,
            amount: Number(invoice.amount),
            currency: invoice.currency,
            error: result.error,
            automatic: true,
          },
        });

        this.logger.warn(`Auto-charge failed for invoice ${invoiceId}: ${result.error}`);
      }
    } catch (error) {
      this.logger.error(`Auto-charge processing failed for invoice ${invoiceId}`, error);
      throw error;
    }
  }
}
