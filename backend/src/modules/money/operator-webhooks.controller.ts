import { Body, Controller, HttpCode, Logger, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Prisma } from '../../generated/prisma-tenant/client';
import { Public } from '../../common/decorators/public.decorator';
import { TenantDatabaseService } from '../../database/tenant-database.service';
import { MoneyService } from './money.service';

const OPERATORS = new Set(['mtn_momo', 'airtel_money']);

/**
 * Callbacks from MTN MoMo and Airtel Money. Neither is signed, so a callback
 * is only a prompt: the outcome always comes from a status request to the
 * operator, which cannot be forged by whoever posts here.
 */
@ApiExcludeController()
@Public()
@Controller('webhooks')
export class OperatorWebhooksController {
  private readonly logger = new Logger(OperatorWebhooksController.name);

  constructor(
    private readonly tenantDb: TenantDatabaseService,
    private readonly money: MoneyService,
  ) {}

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

    const tx = (body.transaction ?? {}) as Record<string, unknown>;
    const reference = String(provider === 'mtn_momo' ? (body.externalId ?? '') : (tx.id ?? ''));
    const providerTxnId = String(provider === 'mtn_momo' ? (body.financialTransactionId ?? '') : (tx.airtel_money_id ?? ''));
    const status = String(provider === 'mtn_momo' ? (body.status ?? '') : (tx.status_code ?? ''));

    const intent = await this.money.findByProviderRef(db, provider, { reference: reference || undefined });
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
