import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * Every API and worker process registers the same cron jobs. A scheduled run
 * first takes a lock in Redis named after the job; the lock expires shortly
 * before the next run is due and is not released early, so each run happens
 * on exactly one process however many are running, and a process that dies
 * mid-run cannot block the next one.
 */
@Injectable()
export class CronLockService implements OnModuleDestroy {
  private readonly logger = new Logger(CronLockService.name);
  private redis: Redis | null = null;

  constructor(private readonly config: ConfigService) {}

  private client(): Redis {
    if (!this.redis) {
      this.redis = new Redis(this.config.get<string>('REDIS_URL') ?? 'redis://localhost:6379', {
        lazyConnect: false,
        maxRetriesPerRequest: 2,
      });
      this.redis.on('error', (error) => this.logger.warn(`Redis: ${error.message}`));
    }
    return this.redis;
  }

  /**
   * Runs `fn` if this process wins the lock for this run of `name`.
   * `holdMs` should be a little shorter than the job's interval.
   */
  async runExclusive(name: string, holdMs: number, fn: () => Promise<unknown>): Promise<boolean> {
    let acquired: string | null;
    try {
      acquired = await this.client().set(`cron-lock:${name}`, String(process.pid), 'PX', holdMs, 'NX');
    } catch (error) {
      // Without Redis the queues are down too; skip rather than risk running everywhere.
      this.logger.warn(`Skipping ${name}: could not take its lock (${error instanceof Error ? error.message : error})`);
      return false;
    }
    if (acquired !== 'OK') return false;
    await fn();
    return true;
  }

  async onModuleDestroy(): Promise<void> {
    await this.redis?.quit().catch(() => undefined);
  }
}
