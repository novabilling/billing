import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Job } from 'bullmq';
import { TenantDatabaseService } from '../../database/tenant-database.service';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { EMAIL_QUEUE, WEBHOOK_QUEUE, EmailJobType, WebhookJobType } from '../billing.queue';

@Processor('dunning')
export class DunningProcessor extends WorkerHost {
  private readonly logger = new Logger(DunningProcessor.name);

  constructor(
    private readonly tenantDb: TenantDatabaseService,
    private readonly centralPrisma: CentralPrismaService,
    @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
    @InjectQueue(WEBHOOK_QUEUE) private readonly webhookQueue: Queue,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    const { tenantId, retryId } = job.data;
    return this.processRetry(tenantId, retryId);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async checkDueRetries() {
    this.logger.log('Checking for due payment retries...');

    const tenants = await this.centralPrisma.client.tenant.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    for (const tenant of tenants) {
      await this.processTenantRetries(tenant.id);
    }
  }

  private async processTenantRetries(tenantId: string) {
    try {
      const prisma = await this.tenantDb.getTenantClient(tenantId);

      // Find all retries that are due (cast: PaymentRetry not in generated types yet)
      const dueRetries = await (prisma as any).paymentRetry.findMany({
        where: {
          status: 'PENDING',
          nextRetryAt: { lte: new Date() },
        },
        include: {
          invoice: {
            include: {
              customer: true,
              subscription: {
                include: {
                  paymentMethod: true,
                },
              },
            },
          },
        },
      });

      this.logger.log(`Found ${dueRetries.length} due retries for tenant ${tenantId}`);

      for (const retry of dueRetries) {
        await this.processRetry(tenantId, retry.id);
      }
    } catch (error) {
      this.logger.error(`Error processing tenant retries for ${tenantId}`, error);
    }
  }

  private async processRetry(tenantId: string, retryId: string) {
    const prisma = await this.tenantDb.getTenantClient(tenantId);

    const retry = await (prisma as any).paymentRetry.findUnique({
      where: { id: retryId },
      include: {
        invoice: {
          include: {
            customer: true,
            subscription: {
              include: {
                paymentMethod: true,
              },
            },
          },
        },
      },
    });

    if (!retry) {
      this.logger.warn(`Payment retry ${retryId} not found`);
      return;
    }

    this.logger.log(
      `Processing retry ${retry.attemptNumber}/${retry.maxAttempts} for invoice ${retry.invoiceId}`,
    );

    try {
      // Attempt to charge the payment method
      const paymentMethod = retry.invoice.subscription?.paymentMethod;

      if (!paymentMethod) {
        throw new Error('No payment method available for retry');
      }

      // Import provider factory dynamically to avoid circular deps
      const { ProviderFactory } = await import('../../providers/provider.factory');

      // Get payment provider from invoice metadata or subscription
      const providerName = retry.invoice.metadata?.provider as string || 'stripe';
      const providerConfig = await prisma.paymentProvider.findFirst({
        where: { providerName, isActive: true },
      });

      if (!providerConfig) {
        throw new Error(`Payment provider ${providerName} not configured`);
      }

      const credentials = JSON.parse(providerConfig.credentials);
      const provider = ProviderFactory.create(providerName, credentials);

      if (!provider.chargePaymentMethod) {
        throw new Error(`Provider ${providerName} does not support recurring charges`);
      }

      // Attempt the charge
      const result = await provider.chargePaymentMethod({
        paymentMethodId: paymentMethod.tokenId,
        amount: Number(retry.invoice.amount),
        currency: retry.invoice.currency,
        reference: retry.invoice.invoiceNumber,
        customerId: paymentMethod.customerId,
        metadata: { invoiceId: retry.invoiceId, retryAttempt: retry.attemptNumber },
      });

      if (result.success) {
        // Payment succeeded - update invoice and retry status
        await prisma.$transaction([
          prisma.invoice.update({
            where: { id: retry.invoiceId },
            data: { status: 'PAID', paidAt: new Date() },
          }),
          prisma.payment.create({
            data: {
              invoiceId: retry.invoiceId,
              provider: providerName,
              providerTransactionId: result.transactionId,
              amount: retry.invoice.amount,
              currency: retry.invoice.currency,
              status: 'SUCCEEDED',
            },
          }),
          (prisma as any).paymentRetry.update({
            where: { id: retryId },
            data: { status: 'SUCCESS' },
          }),
        ]);

        // Update subscription status to ACTIVE if it was PAST_DUE
        if (retry.subscriptionId) {
          await prisma.subscription.update({
            where: { id: retry.subscriptionId },
            data: { status: 'ACTIVE' },
          });
        }

        // Send success email
        await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
          to: retry.invoice.customer.email,
          subject: 'Payment Successful',
          template: 'payment-retry-success',
          context: {
            customerName: retry.invoice.customer.name,
            amount: Number(retry.invoice.amount),
            currency: retry.invoice.currency,
            invoiceNumber: retry.invoice.invoiceNumber,
          },
          tenantId,
        });

        // Send webhook
        await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
          tenantId,
          event: 'payment.retry.succeeded',
          payload: {
            invoiceId: retry.invoiceId,
            amount: Number(retry.invoice.amount),
            attemptNumber: retry.attemptNumber,
          },
        });

        this.logger.log(`Payment retry succeeded for invoice ${retry.invoiceId}`);
      } else {
        // Payment failed - schedule next retry or mark as exhausted
        if (retry.attemptNumber >= retry.maxAttempts) {
          // Max attempts reached - mark as exhausted
          await (prisma as any).paymentRetry.update({
            where: { id: retryId },
            data: {
              status: 'EXHAUSTED',
              lastError: result.error || 'Max retry attempts reached',
            },
          });

          // Cancel subscription
          if (retry.subscriptionId) {
            await prisma.subscription.update({
              where: { id: retry.subscriptionId },
              data: { status: 'CANCELED', canceledAt: new Date() },
            });
          }

          // Send final failure email
          await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
            to: retry.invoice.customer.email,
            subject: 'Subscription Canceled - Payment Failed',
            template: 'payment-retry-exhausted',
            context: {
              customerName: retry.invoice.customer.name,
              amount: Number(retry.invoice.amount),
              currency: retry.invoice.currency,
              invoiceNumber: retry.invoice.invoiceNumber,
            },
            tenantId,
          });

          this.logger.warn(`Payment retry exhausted for invoice ${retry.invoiceId}`);
        } else {
          // Schedule next retry (exponential backoff: 1 day, 3 days, 7 days)
          const retryDelays = [1, 3, 7]; // days
          const nextDelay = retryDelays[retry.attemptNumber] || 7;
          const nextRetryAt = new Date();
          nextRetryAt.setDate(nextRetryAt.getDate() + nextDelay);

          await (prisma as any).paymentRetry.update({
            where: { id: retryId },
            data: {
              attemptNumber: retry.attemptNumber + 1,
              nextRetryAt,
              lastError: result.error,
            },
          });

          // Send retry notification email
          await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
            to: retry.invoice.customer.email,
            subject: `Payment Failed - Retry Scheduled`,
            template: 'payment-retry-failed',
            context: {
              customerName: retry.invoice.customer.name,
              amount: Number(retry.invoice.amount),
              currency: retry.invoice.currency,
              invoiceNumber: retry.invoice.invoiceNumber,
              attemptNumber: retry.attemptNumber,
              nextRetryDate: nextRetryAt.toISOString().split('T')[0],
            },
            tenantId,
          });

          this.logger.log(
            `Payment retry failed. Next attempt ${retry.attemptNumber + 1} scheduled for ${nextRetryAt}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(`Error processing retry ${retryId}`, error);

      // Update retry with error
      await (prisma as any).paymentRetry.update({
        where: { id: retryId },
        data: {
          lastError: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }
}
