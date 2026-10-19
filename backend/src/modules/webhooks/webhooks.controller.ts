import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Req,
  RawBodyRequest,
} from '@nestjs/common';
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
import { WebhookData } from '../../providers/base-payment.provider';
import { Prisma, PrismaClient } from '../../generated/prisma-tenant/client';
import {
  WEBHOOK_QUEUE,
  EMAIL_QUEUE,
  WebhookJobType,
  EmailJobType,
} from '../../queues/billing.queue';

const SUPPORTED_WEBHOOK_PROVIDERS = new Set(['stripe', 'paystack', 'flutterwave', 'dpo', 'payu', 'pesapal', 'paypal']);

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

  @Public()
  @Post('paypal')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'PayPal webhook endpoint',
    description:
      'Receives PayPal notifications. Each one is verified with PayPal (verify-webhook-signature) using the ' +
      'webhook id saved with your PayPal credentials; approved orders are captured before the payment is marked paid.',
  })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async paypal(@Req() req: RawBodyRequest<Request>, @Body() payload: Record<string, unknown>) {
    this.logger.log('PayPal webhook received');
    await this.processProviderWebhook('paypal', payload, this.signatureFor('paypal', req.headers), req.rawBody?.toString('utf8'));
    return { status: 'success' };
  }

  /**
   * Per-tenant webhook URL: /webhooks/{provider}/{tenantId}. Only that tenant's
   * credentials are tried, instead of every tenant's as on the shared URL.
   * The shared URLs above keep working for existing provider configurations.
   */
  @Public()
  @Post(':provider/:tenantId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Per-tenant provider webhook endpoint',
    description:
      'Same processing as the shared /webhooks/{provider} URL, scoped to one tenant. Point new provider ' +
      'webhook configurations here; the dashboard shows the exact URL for each provider.',
  })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async tenantScoped(
    @Req() req: RawBodyRequest<Request>,
    @Body() payload: Record<string, unknown>,
    @Param('provider') provider: string,
    @Param('tenantId') tenantId: string,
  ) {
    const providerName = provider.toLowerCase();
    if (!SUPPORTED_WEBHOOK_PROVIDERS.has(providerName)) {
      throw new NotFoundException(`Unknown provider "${provider}"`);
    }
    this.logger.log(`${providerName} webhook received for tenant ${tenantId}`);
    await this.processProviderWebhook(
      providerName,
      payload,
      this.signatureFor(providerName, req.headers),
      req.rawBody?.toString('utf8'),
      tenantId,
    );
    return { status: 'success' };
  }

  /** Pull the signature material each provider sends from the request headers. */
  private signatureFor(provider: string, headers: Request['headers']): string {
    const h = (name: string) => {
      const v = headers[name];
      return (Array.isArray(v) ? v[0] : v) ?? '';
    };
    switch (provider) {
      case 'paystack':
        return h('x-paystack-signature');
      case 'flutterwave':
        return h('verif-hash');
      case 'stripe':
        return h('stripe-signature');
      case 'paypal':
        return JSON.stringify({
          authAlgo: h('paypal-auth-algo'),
          certUrl: h('paypal-cert-url'),
          transmissionId: h('paypal-transmission-id'),
          transmissionSig: h('paypal-transmission-sig'),
          transmissionTime: h('paypal-transmission-time'),
        });
      default:
        return '';
    }
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
    onlyTenantId?: string,
  ): Promise<void> {
    // The per-tenant URL names its tenant; the shared legacy URL has to try
    // every active tenant that has this provider configured.
    const route = onlyTenantId ? 'tenant' : 'shared';
    const tenants = await this.centralPrisma.client.tenant.findMany({
      where: { isActive: true, ...(onlyTenantId && { id: onlyTenantId }) },
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

        // Log the inbound webhook event for this tenant
        // Convention: url = "inbound:{providerName}" to distinguish from outbound logs
        let webhookData;
        try {
          webhookData = await provider.handleWebhook(payload, signature, rawBody);

          // Record successful inbound delivery
          await this.centralPrisma.client.webhookLog.create({
            data: {
              tenantId: tenant.id,
              event: `inbound.${providerName}.${String(payload.event || payload.type || 'webhook')}`,
              url: `inbound:${providerName}`,
              payload: payload as any,
              success: true,
              statusCode: 200,
              attemptCount: 1,
            },
          });
        } catch (error) {
          // Signature verification or parse error for this tenant; do not persist
          // a per-tenant failed inbound log entry to avoid polluting logs when the
          // webhook belongs to a different tenant.
          this.logger.warn(
            `Webhook signature verification failed for tenant ${tenant.id}: ${
              error instanceof Error ? error.message : 'Unknown'
            }`,
          );
          continue;
        }

        const payment = await this.findPayment(db, providerName, webhookData);

        if (!payment) {
          this.logger.debug(
            `No matching payment found for tenant ${tenant.id}, txn ${webhookData.transactionId}`,
          );
          continue;
        }

        const decision = await this.recordEvent(db, providerName, route, payload, webhookData, payment);
        if (decision !== 'process') {
          this.logger.log(
            `Skipped ${providerName} webhook for tenant ${tenant.id}: payment ${payment.id} (${decision})`,
          );
          return;
        }

        // Update payment status
        // 'pending' means the provider has acknowledged the payment but final
        // confirmation hasn't arrived yet (e.g. PayPal CHECKOUT.ORDER.APPROVED).
        // In this case we keep the payment in PROCESSING and only record the
        // transaction ID — no invoice update or customer notification yet.
        if (webhookData.status === 'pending') {
          if (webhookData.transactionId) {
            await db.payment.update({
              where: { id: payment.id },
              data: { providerTransactionId: webhookData.transactionId },
            });
          }
          // Forward the pending event so tenants can observe it
          await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
            tenantId: tenant.id,
            event: 'payment.pending',
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
            `Processed ${providerName} webhook for tenant ${tenant.id}: payment ${payment.id} → PROCESSING (pending)`,
          );
          return;
        }

        const newStatus = webhookData.status === 'succeeded' ? 'SUCCEEDED' : 'FAILED';
        // Payment and invoice change together or not at all.
        await db.$transaction([
          db.payment.update({
            where: { id: payment.id },
            data: {
              status: newStatus,
              ...(webhookData.transactionId && { providerTransactionId: webhookData.transactionId }),
              ...(webhookData.status === 'failed' && {
                failureReason: 'Payment failed via webhook',
              }),
            },
          }),
          ...(webhookData.status === 'succeeded' && payment.invoice
            ? [
                db.invoice.update({
                  where: { id: payment.invoice.id },
                  data: { status: 'PAID', paidAt: new Date() },
                }),
              ]
            : []),
        ]);

        if (webhookData.status === 'succeeded' && payment.invoice) {

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

  /**
   * Match a provider notification to a payment. Each lookup runs only when the
   * provider actually supplied that reference: an undefined filter value would
   * otherwise match every payment for the provider. Transaction id wins; the
   * invoice reference is a fallback, newest payment first.
   */
  private async findPayment(db: PrismaClient, providerName: string, webhookData: WebhookData) {
    const include = { invoice: { include: { customer: true } } } as const;
    if (webhookData.transactionId) {
      const byTransaction = await db.payment.findFirst({
        where: { provider: providerName, providerTransactionId: webhookData.transactionId },
        include,
      });
      if (byTransaction) return byTransaction;
    }
    if (webhookData.invoiceId) {
      return db.payment.findFirst({
        where: { provider: providerName, invoiceId: webhookData.invoiceId },
        orderBy: { createdAt: 'desc' },
        include,
      });
    }
    return null;
  }

  /**
   * Record the notification in the tenant's inbox and decide whether to act on
   * it. Redeliveries of the same notification, and notifications that would
   * move a settled payment backwards (a late "failed" after "succeeded"), are
   * recorded but not processed. Amount or currency differences are recorded
   * for review without changing the outcome.
   */
  private async recordEvent(
    db: PrismaClient,
    providerName: string,
    route: string,
    payload: Record<string, unknown>,
    webhookData: WebhookData,
    payment: { id: string; status: string; amount: { toString(): string }; currency: string },
  ): Promise<'process' | 'duplicate' | 'out_of_order'> {
    const settled = payment.status === 'SUCCEEDED' || payment.status === 'REFUNDED';
    const incoming = webhookData.status;
    let decision: 'process' | 'duplicate' | 'out_of_order' = 'process';
    if (settled && incoming === 'succeeded') decision = 'duplicate';
    else if (settled) decision = 'out_of_order';
    else if (payment.status === 'FAILED' && incoming === 'failed') decision = 'duplicate';

    const mismatch = this.describeMismatch(webhookData, payment);
    if (mismatch) {
      this.logger.warn(`${providerName} reported ${mismatch} for payment ${payment.id}`);
    }

    // Status is part of the key: some providers reuse one id for every
    // notification about a transaction (pending, then succeeded).
    const eventKey = `${this.providerEventId(payload) ?? webhookData.transactionId ?? payment.id}:${incoming}`;
    try {
      await db.providerEvent.create({
        data: {
          provider: providerName,
          eventKey,
          eventType: String(payload.event_type ?? payload.event ?? payload.type ?? incoming),
          status: decision === 'process' ? 'PROCESSED' : decision === 'duplicate' ? 'DUPLICATE' : 'IGNORED',
          route,
          paymentId: payment.id,
          amount: webhookData.amount ? String(webhookData.amount) : null,
          currency: webhookData.currency || null,
          mismatch,
          error: decision === 'out_of_order' ? `Payment already ${payment.status}; ignored "${incoming}"` : null,
          payload: payload as never,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // Seen before. The payment's state decides: if the first attempt
        // crashed before updating it, this redelivery still gets processed.
        return decision;
      }
      // Tenant databases that have not been synced to the new schema have no
      // inbox table yet; fall back to the state checks alone.
      if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021')) {
        this.logger.warn(`Could not record provider event: ${error instanceof Error ? error.message : error}`);
      }
    }
    return decision;
  }

  private describeMismatch(
    webhookData: WebhookData,
    payment: { amount: { toString(): string }; currency: string },
  ): string | null {
    const problems: string[] = [];
    if (webhookData.currency && webhookData.currency.toUpperCase() !== payment.currency.toUpperCase()) {
      problems.push(`currency ${webhookData.currency} (expected ${payment.currency})`);
    }
    // Providers that cannot report an amount send 0.
    if (webhookData.amount > 0 && Math.abs(webhookData.amount - Number(payment.amount.toString())) > 0.005) {
      problems.push(`amount ${webhookData.amount} (expected ${payment.amount.toString()})`);
    }
    return problems.length ? problems.join(', ') : null;
  }

  /** The provider's own id for this notification, when it sends one. */
  private providerEventId(payload: Record<string, unknown>): string | null {
    const id = payload.id ?? payload.event_id;
    return typeof id === 'string' && id.length > 0 && id.length <= 200 ? `event:${id}` : null;
  }
}
