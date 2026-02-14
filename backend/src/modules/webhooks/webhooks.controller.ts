import { Controller, Post, Body, Headers, HttpCode, HttpStatus, Logger, Req, RawBodyRequest } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiExcludeEndpoint } from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Request } from 'express';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { Public } from '../../common/decorators/public.decorator';
import { PdfService } from '../../services/pdf.service';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { TenantDatabaseService } from '../../database/tenant-database.service';
import { EncryptionService } from '../../services/encryption.service';
import { ProviderFactory } from '../../providers/provider.factory';
import {
  WEBHOOK_QUEUE,
  EMAIL_QUEUE,
  WebhookJobType,
  EmailJobType,
} from '../../queues/billing.queue';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    private readonly centralPrisma: CentralPrismaService,
    private readonly tenantDbService: TenantDatabaseService,
    private readonly encryptionService: EncryptionService,
    @InjectQueue(WEBHOOK_QUEUE) private readonly webhookQueue: Queue,
    @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
  ) {}

  @Public()
  @Post('paystack')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Paystack webhook endpoint',
    description:
      'Receives payment event notifications from Paystack. ' +
      "The signature is verified using HMAC-SHA512 with the provider's secret key. " +
      'On success, updates the payment/invoice status and sends customer notifications.',
  })
  @ApiHeader({
    name: 'x-paystack-signature',
    description: 'Paystack HMAC-SHA512 signature',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async paystack(
    @Body() payload: Record<string, unknown>,
    @Headers('x-paystack-signature') signature: string,
  ) {
    this.logger.log('Paystack webhook received');
    await this.processProviderWebhook('paystack', payload, signature);
    return { status: 'success' };
  }

  @Public()
  @Post('flutterwave')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Flutterwave webhook endpoint',
    description:
      'Receives payment event notifications from Flutterwave. ' +
      'Verified using the verif-hash header against the configured encryption key.',
  })
  @ApiHeader({ name: 'verif-hash', description: 'Flutterwave verification hash', required: false })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async flutterwave(
    @Body() payload: Record<string, unknown>,
    @Headers('verif-hash') signature: string,
  ) {
    this.logger.log('Flutterwave webhook received');
    await this.processProviderWebhook('flutterwave', payload, signature || '');
    return { status: 'success' };
  }

  @Public()
  @Post('dpo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'DPO Group webhook endpoint',
    description:
      'Receives payment callback notifications from DPO Group (DirectPay Online). ' +
      'Verifies the transaction token status and updates payment accordingly.',
  })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async dpo(@Body() payload: Record<string, unknown>) {
    this.logger.log('DPO webhook received');
    await this.processProviderWebhook('dpo', payload, '');
    return { status: 'success' };
  }

  @Public()
  @Post('payu')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'PayU webhook endpoint',
    description:
      'Receives Instant Payment Notifications (IPN) from PayU South Africa. ' +
      'Updates payment status based on the transaction state.',
  })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async payu(@Body() payload: Record<string, unknown>) {
    this.logger.log('PayU webhook received');
    await this.processProviderWebhook('payu', payload, '');
    return { status: 'success' };
  }

  @Public()
  @Post('pesapal')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Pesapal webhook endpoint',
    description:
      'Receives IPN (Instant Payment Notification) callbacks from Pesapal. ' +
      'Fetches transaction status using the OrderTrackingId and updates payment.',
  })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async pesapal(@Body() payload: Record<string, unknown>) {
    this.logger.log('Pesapal webhook received');
    await this.processProviderWebhook('pesapal', payload, '');
    return { status: 'success' };
  }

  @Public()
  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Stripe webhook endpoint',
    description:
      'Receives event notifications from Stripe (e.g. checkout.session.completed, payment_intent.succeeded). ' +
      'Verified using the stripe-signature header with the configured webhook secret.',
  })
  @ApiHeader({ name: 'stripe-signature', description: 'Stripe webhook signature', required: true })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async stripe(
    @Req() req: RawBodyRequest<Request>,
    @Body() payload: Record<string, unknown>,
    @Headers('stripe-signature') signature: string,
  ) {
    this.logger.log('Stripe webhook received');
    const rawBody = req.rawBody?.toString('utf8');
    await this.processProviderWebhook('stripe', payload, signature || '', rawBody);
    return { received: true };
  }

  /**
   * Core webhook processing logic:
   * 1. Find which tenant this webhook belongs to by looking up the provider config
   * 2. Verify the webhook signature using the provider's handleWebhook method
   * 3. Update the payment and invoice status in the tenant's database
   * 4. Send notification emails and forward the event to the tenant's webhook URL
   */
  private async processProviderWebhook(
    providerName: string,
    payload: Record<string, unknown>,
    signature: string,
    rawBody?: string,
  ): Promise<void> {
    // Find all tenants that have this provider configured
    const tenants = await this.centralPrisma.client.tenant.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    });

    for (const tenant of tenants) {
      try {
        const db = await this.tenantDbService.getTenantClient(tenant.id);

        const providerConfig = await db.paymentProvider.findFirst({
          where: { providerName, isActive: true },
        });

        if (!providerConfig) continue;

        const credentials = JSON.parse(this.encryptionService.decrypt(providerConfig.credentials));
        const provider = ProviderFactory.create(providerName, credentials);

        // Verify signature and parse webhook data
        let webhookData;
        try {
          webhookData = await provider.handleWebhook(payload, signature, rawBody);
        } catch (error) {
          this.logger.warn(
            `Webhook signature verification failed for tenant ${tenant.id}: ${
              error instanceof Error ? error.message : 'Unknown'
            }`,
          );
          continue;
        }

        // Find the payment by provider transaction ID or invoice reference
        const payment = await db.payment.findFirst({
          where: {
            OR: [
              { providerTransactionId: webhookData.transactionId },
              { invoiceId: webhookData.invoiceId },
            ],
            provider: providerName,
          },
          include: { invoice: { include: { customer: true } } },
        });

        if (!payment) {
          this.logger.debug(
            `No matching payment found for tenant ${tenant.id}, txn ${webhookData.transactionId}`,
          );
          continue;
        }

        // Update payment status
        const newStatus = webhookData.status === 'succeeded' ? 'SUCCEEDED' : 'FAILED';
        await db.payment.update({
          where: { id: payment.id },
          data: {
            status: newStatus,
            providerTransactionId: webhookData.transactionId,
            ...(webhookData.status === 'failed' && {
              failureReason: 'Payment failed via webhook',
            }),
          },
        });

        // Update invoice status if payment succeeded
        if (webhookData.status === 'succeeded' && payment.invoice) {
          await db.invoice.update({
            where: { id: payment.invoice.id },
            data: { status: 'PAID', paidAt: new Date() },
          });

          // Auto-save card token for recurring billing (if provider returned one)
          if (webhookData.paymentMethodToken && payment.invoice.customer) {
            const token = webhookData.paymentMethodToken;
            const customerId = payment.invoice.customer.id;

            // Only save if this token doesn't already exist
            const existing = await db.paymentMethod.findFirst({
              where: { provider: providerName, tokenId: token.token },
            });

            if (!existing) {
              const existingCount = await db.paymentMethod.count({
                where: { customerId },
              });

              await db.paymentMethod.create({
                data: {
                  customerId,
                  provider: providerName,
                  type: 'CARD',
                  tokenId: token.token,
                  isDefault: existingCount === 0,
                  last4: token.last4,
                  brand: token.brand,
                  expMonth: token.expMonth,
                  expYear: token.expYear,
                },
              });

              this.logger.log(
                `Auto-saved payment method for customer ${customerId} (${providerName} ${token.last4 ? `****${token.last4}` : 'token'})`,
              );
            }
          }

          // Send payment confirmation email with invoice PDF attached
          if (payment.invoice.customer?.email) {
            const tenantName = tenant.name || 'Your billing provider';
            const invoiceNumber = payment.invoice.invoiceNumber || payment.invoiceId;
            const formattedAmount = PdfService.formatAmount(payment.amount, payment.currency);

            // Try to attach the existing invoice PDF
            let pdfAttachments: { filename: string; content: string; contentType: string }[] | undefined;
            try {
              const pdfPath = join(process.cwd(), 'uploads', `invoice-${payment.invoice.id}.pdf`);
              const pdfBuffer = await readFile(pdfPath);
              pdfAttachments = [{
                filename: `${invoiceNumber}.pdf`,
                content: pdfBuffer.toString('base64'),
                contentType: 'application/pdf',
              }];
            } catch {
              this.logger.debug(`No PDF found for invoice ${payment.invoice.id}, skipping attachment`);
            }

            await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
              tenantId: tenant.id,
              to: payment.invoice.customer.email,
              subject: `Payment received for ${invoiceNumber} — ${tenantName}`,
              template: 'payment-confirmation',
              context: {
                tenantName,
                customerName: payment.invoice.customer.name || payment.invoice.customer.email,
                invoiceId: invoiceNumber,
                amount: formattedAmount,
                currency: payment.currency,
              },
              attachments: pdfAttachments,
            });
          }
        }

        // If payment failed, notify customer
        if (webhookData.status === 'failed' && payment.invoice?.customer?.email) {
          const tenantName = tenant.name || 'Your billing provider';
          const invoiceNumber = payment.invoice.invoiceNumber || payment.invoiceId;
          const formattedAmount = PdfService.formatAmount(payment.amount, payment.currency);

          await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
            tenantId: tenant.id,
            to: payment.invoice.customer.email,
            subject: `Payment failed for ${invoiceNumber} — ${tenantName}`,
            template: 'payment-failed',
            context: {
              tenantName,
              customerName: payment.invoice.customer.name || payment.invoice.customer.email,
              invoiceId: invoiceNumber,
              amount: formattedAmount,
              currency: payment.currency,
              reason: 'Payment was declined by the payment provider',
            },
          });
        }

        // Forward event to tenant's webhook URL
        await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
          tenantId: tenant.id,
          event: `payment.${webhookData.status}`,
          payload: {
            paymentId: payment.id,
            invoiceId: payment.invoiceId,
            amount: Number(payment.amount),
            currency: payment.currency,
            provider: providerName,
            transactionId: webhookData.transactionId,
          },
        });

        this.logger.log(
          `Processed ${providerName} webhook for tenant ${tenant.id}: payment ${payment.id} → ${newStatus}`,
        );
        return; // Found the matching tenant, stop searching
      } catch (error) {
        this.logger.error(
          `Error processing webhook for tenant ${tenant.id}`,
          error instanceof Error ? error.stack : error,
        );
      }
    }

    this.logger.warn(`No matching tenant/payment found for ${providerName} webhook`);
  }
}
