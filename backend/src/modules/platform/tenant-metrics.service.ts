import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { TenantDatabaseService } from '../../database/tenant-database.service';
import { BillingInterval, PrismaClient } from '../../generated/prisma-tenant/client';
import { formatScaled, toScaled } from '../ledger/ledger.money';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Multiply-then-divide factors that turn one billing interval into a month. */
const MONTHLY: Record<BillingInterval, [bigint, bigint]> = {
  HOURLY: [730n, 1n],
  DAILY: [365n, 12n],
  WEEKLY: [52n, 12n],
  MONTHLY: [1n, 1n],
  QUARTERLY: [1n, 3n],
  YEARLY: [1n, 12n],
};

export interface TenantSnapshot {
  customers: number;
  activeSubscriptions: number;
  invoicesIssued30d: number;
  paymentsSucceeded30d: number;
  paymentsFailed30d: number;
  paymentVolume30d: Record<string, string>;
  mrr: Record<string, string>;
  providerStats30d: Record<string, { succeeded: number; failed: number }>;
  providersConfigured: string[];
  featuresUsed: string[];
  firstPaymentAt: Date | null;
  lastPaymentAt: Date | null;
  moneyMovement30d: MoneyMovementStats | null;
}

export interface MoneyMovementStats {
  collections: { count: number; failed: number; volume: Record<string, string> };
  payouts: { count: number; failed: number; volume: Record<string, string> };
  transfers: { count: number };
  stuck: number;
  awaitingApproval: number;
}

/**
 * Builds a daily, aggregate-only snapshot of each tenant's activity in the
 * central database so the platform console can compare tenants without
 * opening every tenant database at request time.
 */
@Injectable()
export class TenantMetricsService {
  private readonly logger = new Logger(TenantMetricsService.name);
  private running = false;

  constructor(
    private readonly centralPrisma: CentralPrismaService,
    private readonly tenantDb: TenantDatabaseService,
  ) {}

  @Cron(CronExpression.EVERY_3_HOURS)
  async refreshAll(): Promise<{ refreshed: number; failed: number }> {
    if (this.running) return { refreshed: 0, failed: 0 };
    this.running = true;
    let refreshed = 0;
    let failed = 0;
    try {
      const connections = await this.centralPrisma.client.databaseConnection.findMany({
        where: { isHealthy: true },
        select: { tenantId: true },
      });
      for (const { tenantId } of connections) {
        try {
          await this.refreshTenant(tenantId);
          refreshed++;
        } catch (error) {
          failed++;
          this.logger.warn(`Metrics refresh failed for tenant ${tenantId}: ${error instanceof Error ? error.message : error}`);
        }
      }
    } finally {
      this.running = false;
    }
    return { refreshed, failed };
  }

  async refreshTenant(tenantId: string): Promise<void> {
    const [db, tenant] = await Promise.all([
      this.tenantDb.getTenantClient(tenantId),
      this.centralPrisma.client.tenant.findUnique({ where: { id: tenantId }, select: { webhookUrl: true } }),
    ]);
    const snapshot = await this.snapshot(db, Boolean(tenant?.webhookUrl));
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);

    await this.centralPrisma.client.tenantMetricsDaily.upsert({
      where: { tenantId_date: { tenantId, date } },
      create: { tenantId, date, ...snapshot, moneyMovement30d: (snapshot.moneyMovement30d ?? undefined) as never },
      update: { ...snapshot, moneyMovement30d: (snapshot.moneyMovement30d ?? undefined) as never },
    });
  }

  async snapshot(db: PrismaClient, hasWebhookUrl: boolean): Promise<TenantSnapshot> {
    const since = new Date(Date.now() - 30 * DAY_MS);

    const [
      customers,
      activeSubscriptions,
      invoicesIssued30d,
      paymentGroups,
      paymentRange,
      providers,
      featureCounts,
    ] = await Promise.all([
      db.customer.count(),
      db.subscription.count({ where: { status: { in: ['ACTIVE', 'TRIALING'] } } }),
      db.invoice.count({ where: { createdAt: { gte: since }, status: { not: 'DRAFT' } } }),
      db.payment.groupBy({
        by: ['provider', 'status', 'currency'],
        where: { createdAt: { gte: since } },
        _count: { _all: true },
        _sum: { amount: true },
      }),
      db.payment.aggregate({
        where: { status: { in: ['SUCCEEDED', 'REFUNDED'] } },
        _min: { createdAt: true },
        _max: { createdAt: true },
      }),
      db.paymentProvider.findMany({ where: { isActive: true }, select: { providerName: true } }),
      Promise.all([
        db.subscription.count(),
        db.billableMetric.count(),
        db.wallet.count(),
        db.coupon.count(),
        db.addOn.count(),
        db.creditNote.count(),
        db.tax.count(),
        db.planOverride.count(),
        db.paymentMethod.count(),
      ]),
    ]);

    let paymentsSucceeded30d = 0;
    let paymentsFailed30d = 0;
    const volume = new Map<string, bigint>();
    const providerStats30d: Record<string, { succeeded: number; failed: number }> = {};
    for (const group of paymentGroups) {
      const stats = (providerStats30d[group.provider] ??= { succeeded: 0, failed: 0 });
      const succeeded = group.status === 'SUCCEEDED' || group.status === 'REFUNDED';
      if (succeeded) {
        paymentsSucceeded30d += group._count._all;
        stats.succeeded += group._count._all;
        volume.set(group.currency, (volume.get(group.currency) ?? 0n) + toScaled(group._sum.amount ?? 0));
      } else if (group.status === 'FAILED') {
        paymentsFailed30d += group._count._all;
        stats.failed += group._count._all;
      }
    }

    const featureNames = [
      'subscriptions',
      'usage_metering',
      'wallets',
      'coupons',
      'add_ons',
      'credit_notes',
      'taxes',
      'plan_overrides',
      'saved_payment_methods',
    ];
    const featuresUsed = featureNames.filter((_, i) => featureCounts[i] > 0);
    if (hasWebhookUrl) featuresUsed.push('webhooks');

    return {
      customers,
      activeSubscriptions,
      invoicesIssued30d,
      paymentsSucceeded30d,
      paymentsFailed30d,
      paymentVolume30d: Object.fromEntries([...volume].map(([c, v]) => [c, formatScaled(v)])),
      mrr: await this.mrr(db),
      providerStats30d,
      providersConfigured: providers.map((p) => p.providerName).sort(),
      featuresUsed,
      firstPaymentAt: paymentRange._min.createdAt,
      lastPaymentAt: paymentRange._max.createdAt,
      moneyMovement30d: await this.moneyMovement(db, since),
    };
  }

  /** Collections, payouts and transfers; null for tenants whose database predates them. */
  private async moneyMovement(db: PrismaClient, since: Date): Promise<MoneyMovementStats | null> {
    try {
      const [groups, stuck, awaitingApproval] = await Promise.all([
        db.moneyIntent.groupBy({
          by: ['type', 'status', 'currency'],
          where: { createdAt: { gte: since } },
          _count: { _all: true },
          _sum: { amount: true },
        }),
        db.moneyIntent.count({ where: { status: 'STUCK' } }),
        db.moneyIntent.count({ where: { status: 'REQUIRES_APPROVAL' } }),
      ]);
      const stats: MoneyMovementStats = {
        collections: { count: 0, failed: 0, volume: {} },
        payouts: { count: 0, failed: 0, volume: {} },
        transfers: { count: 0 },
        stuck,
        awaitingApproval,
      };
      const volumes = { COLLECTION: new Map<string, bigint>(), PAYOUT: new Map<string, bigint>() };
      for (const g of groups) {
        if (g.type === 'TRANSFER') {
          if (g.status === 'SUCCEEDED') stats.transfers.count += g._count._all;
          continue;
        }
        const bucket = g.type === 'COLLECTION' ? stats.collections : stats.payouts;
        if (g.status === 'SUCCEEDED') {
          bucket.count += g._count._all;
          const map = volumes[g.type];
          map.set(g.currency, (map.get(g.currency) ?? 0n) + toScaled(g._sum.amount ?? 0));
        } else if (g.status === 'FAILED') {
          bucket.failed += g._count._all;
        }
      }
      stats.collections.volume = Object.fromEntries([...volumes.COLLECTION].map(([c, v]) => [c, formatScaled(v)]));
      stats.payouts.volume = Object.fromEntries([...volumes.PAYOUT].map(([c, v]) => [c, formatScaled(v)]));
      return stats;
    } catch {
      return null;
    }
  }

  /**
   * Monthly recurring revenue from active subscriptions' plan prices in the
   * subscription currency. Customer-specific plan overrides and usage charges
   * are not included, so this is a floor, not an exact figure.
   */
  private async mrr(db: PrismaClient): Promise<Record<string, string>> {
    const subscriptions = await db.subscription.findMany({
      where: { status: 'ACTIVE' },
      select: { currency: true, plan: { select: { billingInterval: true, prices: true } } },
    });
    const totals = new Map<string, bigint>();
    for (const sub of subscriptions) {
      const price = sub.plan.prices.find((p) => p.currency.toUpperCase() === sub.currency.toUpperCase() && p.isActive);
      if (!price) continue;
      const [mul, div] = MONTHLY[sub.plan.billingInterval];
      const monthly = (toScaled(price.amount) * mul) / div;
      const currency = sub.currency.toUpperCase();
      totals.set(currency, (totals.get(currency) ?? 0n) + monthly);
    }
    return Object.fromEntries([...totals].map(([c, v]) => [c, formatScaled(v)]));
  }
}
