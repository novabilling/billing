import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { CentralPrismaService } from '../../database/central-prisma.service';

export interface UsageSample {
  tenantId: string;
  route: string;
  authMethod: string;
  client: string;
  status: number;
  durationMs: number;
}

interface Counter {
  tenantId: string;
  hour: Date;
  route: string;
  authMethod: string;
  client: string;
  requests: number;
  clientErrors: number;
  serverErrors: number;
  totalMs: number;
  maxMs: number;
}

/**
 * Counts tenant API requests in memory and flushes them to ApiUsageHourly once
 * a minute as increments, so any number of API replicas add up correctly.
 * Recording never throws and never blocks a request.
 */
@Injectable()
export class UsageService implements OnModuleDestroy {
  private readonly logger = new Logger(UsageService.name);
  private buffer = new Map<string, Counter>();

  record(sample: UsageSample): void {
    const hour = new Date();
    hour.setUTCMinutes(0, 0, 0);
    const key = [sample.tenantId, hour.toISOString(), sample.route, sample.authMethod, sample.client].join('|');

    let counter = this.buffer.get(key);
    if (!counter) {
      counter = {
        tenantId: sample.tenantId,
        hour,
        route: sample.route,
        authMethod: sample.authMethod,
        client: sample.client,
        requests: 0,
        clientErrors: 0,
        serverErrors: 0,
        totalMs: 0,
        maxMs: 0,
      };
      this.buffer.set(key, counter);
    }
    const ms = Math.max(0, Math.round(sample.durationMs));
    counter.requests++;
    if (sample.status >= 500) counter.serverErrors++;
    else if (sample.status >= 400) counter.clientErrors++;
    counter.totalMs += ms;
    counter.maxMs = Math.max(counter.maxMs, ms);
  }

  constructor(private readonly centralPrisma: CentralPrismaService) {}

  @Interval(60_000)
  async flush(): Promise<void> {
    if (this.buffer.size === 0) return;
    const pending = this.buffer;
    this.buffer = new Map();

    for (const c of pending.values()) {
      try {
        await this.centralPrisma.client.$executeRaw`
          INSERT INTO "ApiUsageHourly"
            (id, "tenantId", hour, route, "authMethod", client, requests, "clientErrors", "serverErrors", "totalMs", "maxMs")
          VALUES (gen_random_uuid()::text, ${c.tenantId}, ${c.hour}, ${c.route}, ${c.authMethod}, ${c.client},
                  ${c.requests}, ${c.clientErrors}, ${c.serverErrors}, ${BigInt(c.totalMs)}, ${c.maxMs})
          ON CONFLICT ("tenantId", hour, route, "authMethod", client) DO UPDATE SET
            requests = "ApiUsageHourly".requests + EXCLUDED.requests,
            "clientErrors" = "ApiUsageHourly"."clientErrors" + EXCLUDED."clientErrors",
            "serverErrors" = "ApiUsageHourly"."serverErrors" + EXCLUDED."serverErrors",
            "totalMs" = "ApiUsageHourly"."totalMs" + EXCLUDED."totalMs",
            "maxMs" = GREATEST("ApiUsageHourly"."maxMs", EXCLUDED."maxMs")`;
      } catch (error) {
        // Losing a minute of analytics is acceptable; failing requests is not.
        this.logger.warn(`Dropped usage counter for tenant ${c.tenantId}: ${error instanceof Error ? error.message : error}`);
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.flush();
  }
}

/**
 * Identify the calling client. Fern-generated SDKs send their name and
 * version; otherwise fall back to a coarse user-agent family.
 */
export function detectClient(headers: Record<string, string | string[] | undefined>): string {
  const header = (name: string) => {
    const value = headers[name];
    return Array.isArray(value) ? value[0] : value;
  };
  const sdk = header('x-fern-sdk-name');
  if (sdk) {
    const version = header('x-fern-sdk-version');
    return `${sdk}${version ? `@${version}` : ''}`.slice(0, 80);
  }

  const ua = (header('user-agent') || '').toLowerCase();
  if (!ua) return 'http';
  if (ua.includes('mozilla')) return 'browser';
  if (ua.includes('python')) return 'python';
  if (ua.includes('node') || ua.includes('axios') || ua.includes('undici')) return 'node';
  if (ua.includes('dart') || ua.includes('flutter')) return 'dart';
  if (ua.includes('okhttp') || ua.includes('java')) return 'java';
  if (ua.includes('go-http')) return 'go';
  if (ua.includes('php') || ua.includes('guzzle')) return 'php';
  if (ua.includes('curl')) return 'curl';
  if (ua.includes('postman')) return 'postman';
  return 'http';
}
