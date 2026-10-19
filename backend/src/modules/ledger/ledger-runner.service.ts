import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { TenantDatabaseService } from '../../database/tenant-database.service';
import { LedgerProjectorService, ProjectionResult } from './ledger-projector.service';
import { isLedgerTableMissing, LedgerHealth, LedgerService } from './ledger.service';

export type LedgerMode = 'off' | 'shadow';

export interface TenantLedgerSync {
  tenantId: string;
  mode: LedgerMode;
  projection?: ProjectionResult;
  health?: LedgerHealth;
  error?: string;
}

const NOT_PROVISIONED =
  'Ledger tables are missing in this tenant database. Run `npm run schema:sync-tenants` to add them.';

/**
 * Runs the shadow ledger for every tenant on a schedule and records the
 * outcome centrally for the platform console. In shadow mode nothing reads
 * from the ledger yet, so a failure here never affects billing.
 */
@Injectable()
export class LedgerRunnerService {
  private readonly logger = new Logger(LedgerRunnerService.name);
  private running = false;

  constructor(
    private readonly ledger: LedgerService,
    private readonly projector: LedgerProjectorService,
    private readonly tenantDb: TenantDatabaseService,
    private readonly centralPrisma: CentralPrismaService,
    private readonly config: ConfigService,
  ) {}

  get mode(): LedgerMode {
    return this.config.get<string>('LEDGER_MODE') === 'off' ? 'off' : 'shadow';
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async syncAllTenants(): Promise<void> {
    if (this.mode === 'off' || this.running) return;
    this.running = true;
    try {
      const connections = await this.centralPrisma.client.databaseConnection.findMany({
        where: { isHealthy: true, tenant: { isActive: true } },
        select: { tenantId: true },
      });
      for (const { tenantId } of connections) {
        await this.syncTenant(tenantId);
      }
    } catch (error) {
      this.logger.error('Ledger sync run failed', error);
    } finally {
      this.running = false;
    }
  }

  async syncTenant(tenantId: string, options: { fromScratch?: boolean } = {}): Promise<TenantLedgerSync> {
    if (this.mode === 'off') return { tenantId, mode: 'off' };

    try {
      const db = await this.tenantDb.getTenantClient(tenantId);
      const projection = await this.projector.project(db, options);
      const health = await this.ledger.checkHealth(db);
      await this.recordStatus(tenantId, projection, health);

      if (!health.balanced) {
        this.logger.error(`Ledger for tenant ${tenantId} is out of balance`);
      }
      return { tenantId, mode: this.mode, projection, health };
    } catch (error) {
      const message = isLedgerTableMissing(error)
        ? NOT_PROVISIONED
        : error instanceof Error
          ? error.message
          : String(error);
      this.logger.warn(`Ledger sync skipped for tenant ${tenantId}: ${message}`);
      await this.recordError(tenantId, message);
      return { tenantId, mode: this.mode, error: message };
    }
  }

  private async recordStatus(tenantId: string, projection: ProjectionResult, health: LedgerHealth) {
    const now = new Date();
    const data = {
      lastSyncAt: now,
      lastCheckAt: now,
      balanced: health.balanced,
      warnings: health.checks.filter((c) => c.informational && !c.ok).length,
      failedPostings: projection.failed,
      lastError: projection.errors[0]
        ? `${projection.errors[0].reference}: ${projection.errors[0].error}`
        : null,
      checks: health.checks as never,
    };
    await this.centralPrisma.client.tenantLedgerStatus
      .upsert({
        where: { tenantId },
        create: { tenantId, ...data, entriesPosted: projection.posted },
        update: { ...data, entriesPosted: { increment: projection.posted } },
      })
      .catch((error) => this.logger.warn(`Could not record ledger status for ${tenantId}: ${error}`));
  }

  private async recordError(tenantId: string, message: string) {
    await this.centralPrisma.client.tenantLedgerStatus
      .upsert({
        where: { tenantId },
        create: { tenantId, lastError: message, lastSyncAt: new Date() },
        update: { lastError: message, lastSyncAt: new Date() },
      })
      .catch(() => undefined);
  }
}
