import { Body, Controller, Headers, HttpCode, Logger, NotFoundException, Param, Post, Put, UnauthorizedException } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Prisma } from '../../generated/prisma-tenant/client';
import { Public } from '../../common/decorators/public.decorator';
import { TenantDatabaseService } from '../../database/tenant-database.service';
import { MoneyService } from './money.service';
import { ProviderRegistryService } from './provider-registry.service';
import { NowPaymentsAdapter, NowPaymentsNotification } from './adapters/nowpayments.adapter';
import { toScaled } from '../ledger/ledger.money';

const OPERATORS = new Set(['mtn_momo', 'airtel_money', 'eversend']);

/**
 * Callbacks from MTN MoMo, Airtel Money and Eversend. We do not rely on any
 * signature from them, so a callback is only a prompt: the outcome always
 * comes from a status request to the provider, which cannot be forged by
 * whoever posts here.
 */
@ApiExcludeController()
@Public()
@Controller('webhooks')
export class OperatorWebhooksController {
  private readonly logger = new Logger(OperatorWebhooksController.name);

  constructor(
    private readonly tenantDb: TenantDatabaseService,
    private readonly money: MoneyService,
    private readonly registry: ProviderRegistryService,
  ) {}

  /**
   * NOWPayments notifications are signed (x-nowpayments-sig), so a verified
   * one settles the collection directly; unsigned or invalid ones are refused.
   */
  @Post('nowpayments/:tenantId/callback')
  @HttpCode(200)
  async nowpayments(
    @Param('tenantId') tenantId: string,
    @Body() body: Record<string, unknown>,
    @Headers('x-nowpayments-sig') signature?: string,
  ) {
    const db = await this.tenantDb.getTenantClient(tenantId).catch(() => null);
    if (!db) return { status: 'ignored' };
    const provider = await this.registry.get(db, 'nowpayments').catch(() => null);
    if (!(provider instanceof NowPaymentsAdapter)) return { status: 'ignored' };
    if (!provider.verifyNotification(body, signature)) throw new UnauthorizedException('Invalid NOWPayments signature');

    const n = body as NowPaymentsNotification;
    const intent = await this.money.findByProviderRef(db, 'nowpayments', { reference: n.order_id });
    try {
      await db.providerEvent.create({
        data: {
          provider: 'nowpayments',
          eventKey: `ipn:${n.payment_id}:${n.payment_status}`,
          eventType: n.payment_status ?? 'ipn',
          status: intent ? 'PROCESSED' : 'IGNORED',
          route: 'tenant',
          intentId: intent?.id,
          amount: n.price_amount !== undefined ? String(n.price_amount) : null,
          currency: n.price_currency?.toUpperCase() ?? null,
          payload: body as never,
        },
      });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')) throw error;
    }
    if (!intent) return { status: 'ignored' };

    let outcome = provider.fromPayment(n);
    const expected = intent.chargedAmount ?? intent.amount;
    const priceDiffers =
      (n.price_amount !== undefined && toScaled(n.price_amount) !== toScaled(expected)) ||
      (n.price_currency !== undefined && n.price_currency.toUpperCase() !== intent.currency);
    if (outcome.state === 'succeeded' && priceDiffers) {
      outcome = { ...outcome, state: 'pending', indeterminate: true, failureReason: `Held for review: invoice priced ${n.price_amount} ${n.price_currency}` };
    }
    await this.money.applyOutcome(db, tenantId, intent, outcome, 'webhook');
    return { status: 'ok' };
  }

  @Post(':provider/:tenantId/callback')
  @HttpCode(200)
  post(@Param('provider') provider: string, @Param('tenantId') tenantId: string, @Body() body: Record<string, unknown>) {
    return this.handle(provider, tenantId, body);
  }

  // MTN delivers request-to-pay callbacks with PUT.
  @Put(':provider/:tenantId/callback')
  @HttpCode(200)
  put(@Param('provider') provider: string, @Param('tenantId') tenantId: string, @Body() body: Record<string, unknown>) {
    return this.handle(provider, tenantId, body);
  }

  private async handle(provider: string, tenantId: string, body: Record<string, unknown>) {
    if (!OPERATORS.has(provider)) throw new NotFoundException();
    const db = await this.tenantDb.getTenantClient(tenantId).catch(() => null);
    if (!db) return { status: 'ignored' };

    const { reference, providerTxnId, status } = callbackRefs(provider, body);
    const intent = await this.money.findByProviderRef(db, provider, {
      reference: reference || undefined,
      // Eversend deposits are matched by the collection's own address.
      ...(provider === 'eversend' && providerTxnId && { providerTxnId }),
    });
    try {
      await db.providerEvent.create({
        data: {
          provider,
          eventKey: `callback:${reference || providerTxnId}:${status}`,
          eventType: 'callback',
          status: intent ? 'PROCESSED' : 'IGNORED',
          route: 'tenant',
          intentId: intent?.id,
          amount: body.amount !== undefined ? String(body.amount) : null,
          error: 'Unsigned callback; outcome taken from a status request',
          payload: body as never,
        },
      });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')) throw error;
    }
    if (!intent) {
      this.logger.warn(`${provider} callback for unknown reference "${reference}" (tenant ${tenantId})`);
      return { status: 'ignored' };
    }

    await this.money.refresh(db, tenantId, intent.id).catch((error) =>
      this.logger.warn(`${provider} status check after callback failed for ${intent.id}: ${error instanceof Error ? error.message : error}`),
    );
    return { status: 'ok' };
  }
}

/** Pull our reference, the provider's id and the status out of a callback body. */
function callbackRefs(provider: string, body: Record<string, unknown>) {
  if (provider === 'mtn_momo') {
    return { reference: String(body.externalId ?? ''), providerTxnId: String(body.financialTransactionId ?? ''), status: String(body.status ?? '') };
  }
  if (provider === 'eversend') {
    const data = (body.data ?? body) as Record<string, unknown>;
    const address = data.address ?? data.cryptoAddress ?? data.walletAddress ?? data.destinationAddress ?? '';
    return {
      reference: String(data.destinationAddressDescription ?? ''),
      providerTxnId: String(address),
      status: String(data.status ?? body.eventType ?? body.event ?? ''),
    };
  }
  const tx = (body.transaction ?? {}) as Record<string, unknown>;
  return { reference: String(tx.id ?? ''), providerTxnId: String(tx.airtel_money_id ?? ''), status: String(tx.status_code ?? '') };
}
