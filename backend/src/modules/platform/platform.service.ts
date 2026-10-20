import { Injectable, NotFoundException } from '@nestjs/common';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { Prisma, TenantMetricsDaily } from '../../generated/prisma-central/client';
import { formatScaled, toScaled } from '../ledger/ledger.money';
import { moneySettings } from '../money/money.service';
import { MoneyMovementStats } from './tenant-metrics.service';

const DAY_MS = 24 * 60 * 60 * 1000;

export type TenantStage = 'registered' | 'provider_connected' | 'first_payment' | 'active';

export type HealthFlag =
  | 'stalled_setup'
  | 'inactive_14d'
  | 'high_error_rate'
  | 'payment_failures'
  | 'ledger_unbalanced'
  | 'ledger_not_provisioned'
  | 'money_stuck'
  | 'deactivated';

interface UsageRow {
  tenantId: string;
  requests: bigint;
  errors: bigint;
  serverErrors: bigint;
  lastHour: Date;
}

const toNumber = (v: bigint | number | null | undefined) => Number(v ?? 0);

function sumCurrencyMaps(maps: (Prisma.JsonValue | null)[]): Record<string, string> {
  const totals = new Map<string, bigint>();
  for (const map of maps) {
    if (!map || typeof map !== 'object' || Array.isArray(map)) continue;
    for (const [currency, value] of Object.entries(map)) {
      if (typeof value !== 'string' && typeof value !== 'number') continue;
      totals.set(currency, (totals.get(currency) ?? 0n) + toScaled(value));
    }
  }
  return Object.fromEntries([...totals].sort().map(([c, v]) => [c, formatScaled(v)]));
}

/**
 * Read model for the platform console. Everything comes from central tables
 * (tenants, usage rollups, daily tenant snapshots, ledger status); no request
 * here touches a tenant database.
 */
@Injectable()
export class PlatformService {
  constructor(private readonly centralPrisma: CentralPrismaService) {}

  private get db() {
    return this.centralPrisma.client;
  }

  async overview() {
    const now = Date.now();
    const since30 = new Date(now - 30 * DAY_MS);
    const since7 = new Date(now - 7 * DAY_MS);
    const since24h = new Date(now - DAY_MS);
    const since14 = new Date(now - 14 * DAY_MS);

    const [tenantCounts, newTenants30d, usage24h, active, daily, clients, latestMetrics, ledger] = await Promise.all([
      this.db.tenant.groupBy({ by: ['isActive'], _count: { _all: true } }),
      this.db.tenant.count({ where: { createdAt: { gte: since30 } } }),
      this.db.apiUsageHourly.aggregate({
        where: { hour: { gte: since24h } },
        _sum: { requests: true, clientErrors: true, serverErrors: true, totalMs: true },
      }),
      this.db.$queryRaw<{ d7: bigint; d30: bigint }[]>`
        SELECT COUNT(DISTINCT "tenantId") FILTER (WHERE hour >= ${since7}) AS d7,
               COUNT(DISTINCT "tenantId") AS d30
        FROM "ApiUsageHourly" WHERE hour >= ${since30}`,
      this.db.$queryRaw<{ day: Date; requests: bigint; errors: bigint; tenants: bigint }[]>`
        SELECT date_trunc('day', hour) AS day, SUM(requests)::bigint AS requests,
               SUM("clientErrors" + "serverErrors")::bigint AS errors,
               COUNT(DISTINCT "tenantId")::bigint AS tenants
        FROM "ApiUsageHourly" WHERE hour >= ${since14}
        GROUP BY 1 ORDER BY 1`,
      this.db.$queryRaw<{ client: string; requests: bigint }[]>`
        SELECT client, SUM(requests)::bigint AS requests FROM "ApiUsageHourly"
        WHERE hour >= ${since7} GROUP BY client ORDER BY 2 DESC LIMIT 12`,
      this.latestMetrics(),
      this.db.tenantLedgerStatus.findMany({ select: { balanced: true, warnings: true, lastError: true, lastCheckAt: true } }),
    ]);

    const totalTenants = tenantCounts.reduce((n, g) => n + g._count._all, 0);
    const requests24h = usage24h._sum.requests ?? 0;
    const errors24h = (usage24h._sum.clientErrors ?? 0) + (usage24h._sum.serverErrors ?? 0);
    const metrics = [...latestMetrics.values()];

    return {
      tenants: {
        total: totalTenants,
        deactivated: tenantCounts.find((g) => !g.isActive)?._count._all ?? 0,
        new30d: newTenants30d,
        active7d: toNumber(active[0]?.d7),
        active30d: toNumber(active[0]?.d30),
      },
      api24h: {
        requests: requests24h,
        errors: errors24h,
        serverErrors: usage24h._sum.serverErrors ?? 0,
        errorRate: requests24h ? errors24h / requests24h : 0,
        avgMs: requests24h ? Math.round(Number(usage24h._sum.totalMs ?? 0n) / requests24h) : 0,
      },
      funnel: {
        registered: totalTenants,
        providerConnected: metrics.filter((m) => m.providersConfigured.length > 0).length,
        firstPayment: metrics.filter((m) => m.firstPaymentAt).length,
        active30d: toNumber(active[0]?.d30),
      },
      money30d: {
        paymentVolume: sumCurrencyMaps(metrics.map((m) => m.paymentVolume30d)),
        mrr: sumCurrencyMaps(metrics.map((m) => m.mrr)),
        paymentsSucceeded: metrics.reduce((n, m) => n + m.paymentsSucceeded30d, 0),
        paymentsFailed: metrics.reduce((n, m) => n + m.paymentsFailed30d, 0),
        customers: metrics.reduce((n, m) => n + m.customers, 0),
        activeSubscriptions: metrics.reduce((n, m) => n + m.activeSubscriptions, 0),
      },
      moneyMovement30d: this.moneyTotals(metrics),
      providers: this.providerTotals(metrics),
      features: this.featureTotals(metrics),
      ledger: {
        tracked: ledger.length,
        balanced: ledger.filter((l) => l.balanced && !l.lastError).length,
        unbalanced: ledger.filter((l) => !l.balanced).length,
        withWarnings: ledger.filter((l) => l.warnings > 0).length,
        notProvisioned: ledger.filter((l) => l.lastError?.includes('migrate:tenants')).length,
      },
      daily: daily.map((d) => ({
        day: d.day.toISOString().slice(0, 10),
        requests: toNumber(d.requests),
        errors: toNumber(d.errors),
        activeTenants: toNumber(d.tenants),
      })),
      clients7d: clients.map((c) => ({ client: c.client, requests: toNumber(c.requests) })),
      metricsAsOf: metrics.reduce<Date | null>((latest, m) => (!latest || m.createdAt > latest ? m.createdAt : latest), null),
    };
  }

  async tenants(query: { search?: string; stage?: string; flag?: string; sort?: string }) {
    const since7 = new Date(Date.now() - 7 * DAY_MS);
    const search = query.search?.trim();

    const [tenants, usage, metrics, ledger] = await Promise.all([
      this.db.tenant.findMany({
        where: search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
                { id: search },
              ],
            }
          : undefined,
        select: {
          id: true,
          name: true,
          slug: true,
          email: true,
          isActive: true,
          createdAt: true,
          lastLoginAt: true,
          webhookUrl: true,
          settings: true,
          apiKeys: { select: { lastUsed: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.usageByTenant(since7),
      this.latestMetrics(),
      this.db.tenantLedgerStatus.findMany(),
    ]);
    const ledgerByTenant = new Map(ledger.map((l) => [l.tenantId, l]));

    let rows = tenants.map((t) => {
      const u = usage.get(t.id);
      const m = metrics.get(t.id);
      const l = ledgerByTenant.get(t.id);
      const lastApiCall = u?.lastHour ?? null;
      const stage = this.stage(m, lastApiCall);
      const flags = this.flags(t, u, m, l, lastApiCall);
      return {
        id: t.id,
        name: t.name,
        slug: t.slug,
        email: t.email,
        isActive: t.isActive,
        createdAt: t.createdAt,
        lastLoginAt: t.lastLoginAt,
        lastApiCall,
        stage,
        flags,
        requests7d: toNumber(u?.requests),
        errors7d: toNumber(u?.errors),
        customers: m?.customers ?? 0,
        activeSubscriptions: m?.activeSubscriptions ?? 0,
        paymentVolume30d: (m?.paymentVolume30d ?? {}) as Record<string, string>,
        paymentsFailed30d: m?.paymentsFailed30d ?? 0,
        providers: m?.providersConfigured ?? [],
        features: m?.featuresUsed ?? [],
        ledger: l ? { balanced: l.balanced, warnings: l.warnings, lastError: l.lastError, lastCheckAt: l.lastCheckAt } : null,
        money: moneySettings({ id: t.id, settings: t.settings as Record<string, unknown> | null }),
        moneyMovement30d: (m?.moneyMovement30d ?? null) as MoneyMovementStats | null,
      };
    });

    if (query.stage) rows = rows.filter((r) => r.stage === query.stage);
    if (query.flag) rows = rows.filter((r) => r.flags.includes(query.flag as HealthFlag));

    const sorters: Record<string, (a: (typeof rows)[number], b: (typeof rows)[number]) => number> = {
      newest: (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      requests: (a, b) => b.requests7d - a.requests7d,
      last_api_call: (a, b) => (b.lastApiCall?.getTime() ?? 0) - (a.lastApiCall?.getTime() ?? 0),
      attention: (a, b) => b.flags.length - a.flags.length,
      name: (a, b) => a.name.localeCompare(b.name),
    };
    rows.sort(sorters[query.sort ?? 'attention'] ?? sorters.attention);

    return { data: rows, total: rows.length };
  }

  async tenant(id: string) {
    const since30 = new Date(Date.now() - 30 * DAY_MS);
    const since7 = new Date(Date.now() - 7 * DAY_MS);

    const tenant = await this.db.tenant.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
        webhookUrl: true,
        settings: true,
        apiKeys: { select: { name: true, lastUsed: true, createdAt: true, expiresAt: true } },
        ledgerStatus: true,
        databaseConnection: { select: { isHealthy: true, lastHealthCheck: true } },
      },
    });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const [metricsHistory, daily, routes, clients, outboundWebhooks] = await Promise.all([
      this.db.tenantMetricsDaily.findMany({ where: { tenantId: id, date: { gte: since30 } }, orderBy: { date: 'asc' } }),
      this.db.$queryRaw<{ day: Date; requests: bigint; errors: bigint; avgms: number }[]>`
        SELECT date_trunc('day', hour) AS day, SUM(requests)::bigint AS requests,
               SUM("clientErrors" + "serverErrors")::bigint AS errors,
               (SUM("totalMs")::float / NULLIF(SUM(requests), 0)) AS avgms
        FROM "ApiUsageHourly" WHERE "tenantId" = ${id} AND hour >= ${since30}
        GROUP BY 1 ORDER BY 1`,
      this.db.$queryRaw<{ route: string; requests: bigint; errors: bigint; avgms: number; maxms: number }[]>`
        SELECT route, SUM(requests)::bigint AS requests,
               SUM("clientErrors" + "serverErrors")::bigint AS errors,
               (SUM("totalMs")::float / NULLIF(SUM(requests), 0)) AS avgms,
               MAX("maxMs") AS maxms
        FROM "ApiUsageHourly" WHERE "tenantId" = ${id} AND hour >= ${since7}
        GROUP BY route ORDER BY 2 DESC LIMIT 25`,
      this.db.$queryRaw<{ client: string; authMethod: string; requests: bigint }[]>`
        SELECT client, "authMethod", SUM(requests)::bigint AS requests
        FROM "ApiUsageHourly" WHERE "tenantId" = ${id} AND hour >= ${since30}
        GROUP BY 1, 2 ORDER BY 3 DESC`,
      this.db.webhookLog.groupBy({
        by: ['success'],
        where: { tenantId: id, createdAt: { gte: since7 }, NOT: { url: { startsWith: 'inbound:' } } },
        _count: { _all: true },
      }),
    ]);

    const latest = metricsHistory[metricsHistory.length - 1];
    const settings = (tenant.settings ?? {}) as Record<string, unknown>;

    return {
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        email: tenant.email,
        isActive: tenant.isActive,
        createdAt: tenant.createdAt,
        lastLoginAt: tenant.lastLoginAt,
        webhookConfigured: Boolean(tenant.webhookUrl),
        country: (settings.country as string) ?? null,
        database: tenant.databaseConnection,
        apiKeys: tenant.apiKeys,
      },
      latest: latest ?? null,
      history: metricsHistory.map((m) => ({
        date: m.date.toISOString().slice(0, 10),
        customers: m.customers,
        activeSubscriptions: m.activeSubscriptions,
        paymentsSucceeded30d: m.paymentsSucceeded30d,
        paymentsFailed30d: m.paymentsFailed30d,
      })),
      daily: daily.map((d) => ({
        day: d.day.toISOString().slice(0, 10),
        requests: toNumber(d.requests),
        errors: toNumber(d.errors),
        avgMs: Math.round(d.avgms ?? 0),
      })),
      routes7d: routes.map((r) => ({
        route: r.route,
        requests: toNumber(r.requests),
        errors: toNumber(r.errors),
        avgMs: Math.round(r.avgms ?? 0),
        maxMs: r.maxms ?? 0,
      })),
      clients30d: clients.map((c) => ({ client: c.client, authMethod: c.authMethod, requests: toNumber(c.requests) })),
      outboundWebhooks7d: {
        delivered: outboundWebhooks.find((g) => g.success)?._count._all ?? 0,
        failed: outboundWebhooks.find((g) => !g.success)?._count._all ?? 0,
      },
      ledger: tenant.ledgerStatus,
      money: moneySettings({ id: tenant.id, settings: settings as Record<string, unknown> }),
    };
  }

  // --- helpers ---

  private async latestMetrics(): Promise<Map<string, TenantMetricsDaily>> {
    const rows = await this.db.$queryRaw<{ id: string }[]>`
      SELECT DISTINCT ON ("tenantId") id FROM "TenantMetricsDaily" ORDER BY "tenantId", date DESC`;
    if (rows.length === 0) return new Map();
    const metrics = await this.db.tenantMetricsDaily.findMany({ where: { id: { in: rows.map((r) => r.id) } } });
    return new Map(metrics.map((m) => [m.tenantId, m]));
  }

  private async usageByTenant(since: Date): Promise<Map<string, UsageRow>> {
    const rows = await this.db.$queryRaw<UsageRow[]>`
      SELECT "tenantId", SUM(requests)::bigint AS requests,
             SUM("clientErrors" + "serverErrors")::bigint AS errors,
             SUM("serverErrors")::bigint AS "serverErrors",
             MAX(hour) AS "lastHour"
      FROM "ApiUsageHourly" WHERE hour >= ${since} GROUP BY "tenantId"`;
    const lastEver = await this.db.$queryRaw<{ tenantId: string; lastHour: Date }[]>`
      SELECT "tenantId", MAX(hour) AS "lastHour" FROM "ApiUsageHourly" GROUP BY "tenantId"`;
    const map = new Map(rows.map((r) => [r.tenantId, r]));
    for (const r of lastEver) {
      if (!map.has(r.tenantId)) {
        map.set(r.tenantId, { tenantId: r.tenantId, requests: 0n, errors: 0n, serverErrors: 0n, lastHour: r.lastHour });
      }
    }
    return map;
  }

  private stage(m: TenantMetricsDaily | undefined, lastApiCall: Date | null): TenantStage {
    const recent = lastApiCall && Date.now() - lastApiCall.getTime() < 30 * DAY_MS;
    if (m?.lastPaymentAt && recent) return 'active';
    if (m?.firstPaymentAt) return 'first_payment';
    if (m && m.providersConfigured.length > 0) return 'provider_connected';
    return 'registered';
  }

  private flags(
    t: { isActive: boolean; createdAt: Date },
    u: UsageRow | undefined,
    m: TenantMetricsDaily | undefined,
    l: { balanced: boolean; lastError: string | null } | undefined,
    lastApiCall: Date | null,
  ): HealthFlag[] {
    const flags: HealthFlag[] = [];
    const ageDays = (Date.now() - t.createdAt.getTime()) / DAY_MS;
    if (!t.isActive) flags.push('deactivated');
    if (ageDays > 3 && (!m || m.providersConfigured.length === 0)) flags.push('stalled_setup');
    if (ageDays > 14 && (!lastApiCall || Date.now() - lastApiCall.getTime() > 14 * DAY_MS)) flags.push('inactive_14d');
    const requests = toNumber(u?.requests);
    if (requests >= 50 && toNumber(u?.serverErrors) / requests > 0.02) flags.push('high_error_rate');
    if (m && m.paymentsFailed30d >= 5 && m.paymentsFailed30d > m.paymentsSucceeded30d * 0.2) flags.push('payment_failures');
    if (l && !l.balanced) flags.push('ledger_unbalanced');
    if (l?.lastError?.includes('migrate:tenants')) flags.push('ledger_not_provisioned');
    if (((m?.moneyMovement30d ?? null) as MoneyMovementStats | null)?.stuck) flags.push('money_stuck');
    return flags;
  }

  private moneyTotals(metrics: TenantMetricsDaily[]) {
    const stats = metrics.map((m) => m.moneyMovement30d as MoneyMovementStats | null).filter(Boolean) as MoneyMovementStats[];
    return {
      collections: stats.reduce((n, s) => n + s.collections.count, 0),
      collectionsFailed: stats.reduce((n, s) => n + s.collections.failed, 0),
      collectionVolume: sumCurrencyMaps(stats.map((s) => s.collections.volume)),
      payouts: stats.reduce((n, s) => n + s.payouts.count, 0),
      payoutsFailed: stats.reduce((n, s) => n + s.payouts.failed, 0),
      payoutVolume: sumCurrencyMaps(stats.map((s) => s.payouts.volume)),
      transfers: stats.reduce((n, s) => n + s.transfers.count, 0),
      stuck: stats.reduce((n, s) => n + s.stuck, 0),
      commission: sumCurrencyMaps(stats.map((s) => s.commission ?? {})),
      awaitingApproval: stats.reduce((n, s) => n + s.awaitingApproval, 0),
    };
  }

  private providerTotals(metrics: TenantMetricsDaily[]) {
    const totals = new Map<string, { tenants: number; succeeded: number; failed: number }>();
    for (const m of metrics) {
      for (const name of m.providersConfigured) {
        const t = totals.get(name) ?? { tenants: 0, succeeded: 0, failed: 0 };
        t.tenants++;
        totals.set(name, t);
      }
      const stats = (m.providerStats30d ?? {}) as Record<string, { succeeded?: number; failed?: number }>;
      for (const [name, s] of Object.entries(stats)) {
        const t = totals.get(name) ?? { tenants: 0, succeeded: 0, failed: 0 };
        t.succeeded += s.succeeded ?? 0;
        t.failed += s.failed ?? 0;
        totals.set(name, t);
      }
    }
    return [...totals].map(([provider, t]) => ({ provider, ...t })).sort((a, b) => b.tenants - a.tenants);
  }

  private featureTotals(metrics: TenantMetricsDaily[]) {
    const counts = new Map<string, number>();
    for (const m of metrics) for (const f of m.featuresUsed) counts.set(f, (counts.get(f) ?? 0) + 1);
    return [...counts].map(([feature, tenants]) => ({ feature, tenants })).sort((a, b) => b.tenants - a.tenants);
  }
}
