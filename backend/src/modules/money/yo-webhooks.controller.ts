import { Body, Controller, HttpCode, Logger, Param, Post, UnauthorizedException } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Prisma, PrismaClient } from '../../generated/prisma-tenant/client';
import { Public } from '../../common/decorators/public.decorator';
import { TenantDatabaseService } from '../../database/tenant-database.service';
import { MoneyService } from './money.service';
import { ProviderRegistryService } from './provider-registry.service';

/**
 * Yo! Payments notifications (spec v3.48 §6.3 and §6.4), sent to the URLs we
 * pass with each deposit request. A notification only prompts a status check
 * with Yo, which decides the outcome; the notification itself is trusted only
 * when its RSA signature verifies and Yo cannot be reached.
 * Yo retries until it gets HTTP 200, so every handled case answers 200.
 */
@ApiExcludeController()
@Public()
@Controller('webhooks/yo')
export class YoWebhooksController {
  private readonly logger = new Logger(YoWebhooksController.name);

  constructor(
    private readonly tenantDb: TenantDatabaseService,
    private readonly registry: ProviderRegistryService,
    private readonly money: MoneyService,
  ) {}

  @Post(':tenantId/ipn')
  @HttpCode(200)
  async payment(@Param('tenantId') tenantId: string, @Body() body: Record<string, string>) {
    return this.handle(tenantId, body, 'ipn');
  }

  @Post(':tenantId/failure')
  @HttpCode(200)
  async failure(@Param('tenantId') tenantId: string, @Body() body: Record<string, string>) {
    return this.handle(tenantId, body, 'failure');
  }

  private async handle(tenantId: string, body: Record<string, string>, kind: 'ipn' | 'failure') {
    const db = await this.tenantDb.getTenantClient(tenantId).catch(() => null);
    const yo = db ? await this.registry.yo(db) : null;
    if (!db || !yo) {
      this.logger.warn(`Yo ${kind} for tenant ${tenantId} without an active Yo configuration`);
      return { status: 'ignored' };
    }

    const signed = kind === 'ipn' ? yo.verifyPaymentNotification(body) : yo.verifyFailureNotification(body);
    if (yo.canVerifyNotifications && !signed) {
      throw new UnauthorizedException('Invalid Yo notification signature');
    }

    const reference = kind === 'ipn' ? body.external_ref : body.failed_transaction_reference;
    const intent = await this.money.findByProviderRef(db, 'yo', { reference, providerTxnId: reference });
    const eventKey = kind === 'ipn' ? `ipn:${body.network_ref}:${body.msisdn}` : `failure:${reference}`;
    const fresh = await this.record(db, eventKey, kind, body, intent?.id, signed);
    if (!intent) {
      this.logger.warn(`Yo ${kind} for unknown reference ${reference} (tenant ${tenantId})`);
      return { status: 'ignored' };
    }
    if (!fresh && intent.status !== 'PROCESSING' && intent.status !== 'STUCK') return { status: 'duplicate' };

    try {
      await this.money.refresh(db, tenantId, intent.id);
    } catch (error) {
      // Yo unreachable for the status check: fall back to a verified notification.
      this.logger.warn(`Yo status check failed for ${intent.id}: ${error instanceof Error ? error.message : error}`);
      if (signed) {
        await this.money.applyOutcome(
          db,
          tenantId,
          intent,
          kind === 'ipn'
            ? { state: 'succeeded', providerStatus: 'IPN', providerTxnId: body.network_ref }
            : { state: 'failed', providerStatus: 'FAILURE_NOTIFICATION', failureReason: 'Yo reported the transaction failed' },
          'webhook',
        );
      }
    }
    return { status: 'ok' };
  }

  /** Store the notification; false when this exact notification was already recorded. */
  private async record(
    db: PrismaClient,
    eventKey: string,
    kind: string,
    body: Record<string, string>,
    intentId: string | undefined,
    signed: boolean,
  ): Promise<boolean> {
    try {
      await db.providerEvent.create({
        data: {
          provider: 'yo',
          eventKey,
          eventType: kind,
          status: intentId ? 'PROCESSED' : 'IGNORED',
          route: 'tenant',
          intentId,
          amount: body.amount ?? null,
          error: signed ? null : 'Signature not verified (no Yo public key configured)',
          payload: body as never,
        },
      });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return false;
      throw error;
    }
  }
}
