import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { TenantDatabaseService } from '../../database/tenant-database.service';
import { MoneyService, moneySettings } from './money.service';
import { ProviderRegistryService } from './provider-registry.service';
import { TronUsdtAdapter } from './adapters/tron-usdt.adapter';

const RECHECK_AFTER_MS = 4 * 60 * 1000;
const GIVE_UP_AFTER_MS = 14 * 24 * 60 * 60 * 1000;
const BATCH = 50;

/**
 * Re-checks open collections and payouts with their provider every few
 * minutes, so a lost webhook never leaves money in limbo. Stuck payouts are
 * checked too (Yo resolves INDETERMINATE within 24 hours) but never resent.
 */
@Injectable()
export class MoneyPollerService {
  private readonly logger = new Logger(MoneyPollerService.name);
  private running = false;
  private watching = false;

  constructor(
    private readonly centralPrisma: CentralPrismaService,
    private readonly tenantDb: TenantDatabaseService,
    private readonly money: MoneyService,
    private readonly registry: ProviderRegistryService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async pollAll(): Promise<void> {
    if (this.running) return;
    this.running = true;
    try {
      const tenants = await this.centralPrisma.client.tenant.findMany({
        where: { isActive: true, databaseConnection: { isHealthy: true } },
        select: { id: true, settings: true },
      });
      for (const tenant of tenants) {
        const s = moneySettings({ id: tenant.id, settings: tenant.settings as Record<string, unknown> | null });
        if (!s.collections && !s.payouts) continue;
        await this.pollTenant(tenant.id).catch((error) =>
          this.logger.warn(`Money poll failed for tenant ${tenant.id}: ${error instanceof Error ? error.message : error}`),
        );
      }
    } finally {
      this.running = false;
    }
  }

  /**
   * Watch-only crypto: read new transfers to each merchant's own address
   * every minute, then settle (or expire) the collections waiting on them.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async watchChains(): Promise<void> {
    if (this.watching) return;
    this.watching = true;
    try {
      const tenants = await this.centralPrisma.client.tenant.findMany({
        where: { isActive: true, databaseConnection: { isHealthy: true } },
        select: { id: true, settings: true },
      });
      for (const tenant of tenants) {
        if (!moneySettings({ id: tenant.id, settings: tenant.settings as Record<string, unknown> | null }).collections) continue;
        await this.watchTenant(tenant.id).catch((error) =>
          this.logger.warn(`Chain watch failed for tenant ${tenant.id}: ${error instanceof Error ? error.message : error}`),
        );
      }
    } finally {
      this.watching = false;
    }
  }

  async watchTenant(tenantId: string): Promise<number> {
    const db = await this.tenantDb.getTenantClient(tenantId);
    const configured = await db.paymentProvider.findFirst({ where: { providerName: 'tron_usdt', isActive: true }, select: { id: true } });
    if (!configured) return 0;
    const adapter = await this.registry.get(db, 'tron_usdt');
    if (adapter instanceof TronUsdtAdapter) await adapter.scan();

    const open = await db.moneyIntent.findMany({
      where: { type: 'COLLECTION', provider: 'tron_usdt', status: { in: ['PENDING', 'PROCESSING', 'STUCK'] } },
      orderBy: { createdAt: 'asc' },
      take: BATCH,
      select: { id: true },
    });
    for (const { id } of open) {
      await this.money.refresh(db, tenantId, id).catch((error) =>
        this.logger.debug(`Crypto check failed for ${id}: ${error instanceof Error ? error.message : error}`),
      );
    }
    return open.length;
  }

  async pollTenant(tenantId: string): Promise<number> {
    const db = await this.tenantDb.getTenantClient(tenantId);
    const now = Date.now();
    const due = await db.moneyIntent.findMany({
      where: {
        type: { in: ['COLLECTION', 'PAYOUT'] },
        status: { in: ['PROCESSING', 'STUCK'] },
        provider: { not: null },
        createdAt: { gt: new Date(now - GIVE_UP_AFTER_MS) },
        OR: [{ lastCheckedAt: null }, { lastCheckedAt: { lt: new Date(now - RECHECK_AFTER_MS) } }],
      },
      orderBy: { lastCheckedAt: { sort: 'asc', nulls: 'first' } },
      take: BATCH,
      select: { id: true },
    });
    for (const { id } of due) {
      await this.money.refresh(db, tenantId, id).catch((error) =>
        this.logger.debug(`Status check failed for ${id}: ${error instanceof Error ? error.message : error}`),
      );
    }
    return due.length;
  }
}
