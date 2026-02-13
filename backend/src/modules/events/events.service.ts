import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { CreateEventDto } from './dto/create-event.dto';
import { BatchEventsDto } from './dto/batch-events.dto';
import { BILLING_QUEUE, BillingJobType } from '../../queues/billing.queue';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectQueue(BILLING_QUEUE) private readonly billingQueue: Queue,
  ) {}

  async findBySubscription(
    db: PrismaClient,
    subscriptionId: string,
    options?: { code?: string; from?: string; to?: string; page?: number; perPage?: number },
  ) {
    const where: Record<string, any> = { subscriptionId };

    if (options?.code) {
      where.code = options.code;
    }

    if (options?.from || options?.to) {
      where.timestamp = {};
      if (options.from) where.timestamp.gte = new Date(options.from);
      if (options.to) where.timestamp.lte = new Date(options.to);
    }

    const page = options?.page ?? 1;
    const perPage = options?.perPage ?? 50;

    const [events, total] = await Promise.all([
      db.usageEvent.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      db.usageEvent.count({ where }),
    ]);

    return {
      data: events,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async findOne(db: PrismaClient, id: string) {
    const event = await db.usageEvent.findUnique({ where: { id } });
    if (!event) {
      throw new NotFoundException('Usage event not found');
    }
    return event;
  }

  async create(db: PrismaClient, dto: CreateEventDto, tenantId?: string) {
    // Check idempotency
    const existing = await db.usageEvent.findUnique({
      where: { transactionId: dto.transactionId },
    });

    if (existing) {
      return existing;
    }

    // Resolve subscription - try direct ID first, then externalId
    let subscription = await db.subscription.findUnique({
      where: { id: dto.subscriptionId },
    });

    if (!subscription) {
      subscription = await db.subscription.findUnique({
        where: { externalId: dto.subscriptionId },
      });
    }

    if (!subscription) {
      throw new NotFoundException(`Subscription '${dto.subscriptionId}' not found`);
    }

    // Verify the metric code exists
    const metric = await db.billableMetric.findUnique({
      where: { code: dto.code },
    });

    if (!metric) {
      throw new NotFoundException(`Billable metric with code '${dto.code}' not found`);
    }

    const event = await db.usageEvent.create({
      data: {
        transactionId: dto.transactionId,
        subscriptionId: subscription.id,
        code: dto.code,
        timestamp: dto.timestamp ? new Date(dto.timestamp) : new Date(),
        properties: dto.properties ?? {},
      },
    });

    // Queue progressive billing check (debounced per subscription)
    if (tenantId && subscription.status === 'ACTIVE') {
      await this.queueProgressiveBillingCheck(tenantId, subscription.id);
    }

    return event;
  }

  async createBatch(db: PrismaClient, dto: BatchEventsDto, tenantId?: string) {
    const results: { transactionId: string; status: 'created' | 'duplicate' | 'error'; error?: string }[] = [];
    const affectedSubscriptions = new Set<string>();

    for (const event of dto.events) {
      try {
        const existing = await db.usageEvent.findUnique({
          where: { transactionId: event.transactionId },
        });

        if (existing) {
          results.push({ transactionId: event.transactionId, status: 'duplicate' });
          continue;
        }

        let subscription = await db.subscription.findUnique({
          where: { id: event.subscriptionId },
        });

        if (!subscription) {
          subscription = await db.subscription.findUnique({
            where: { externalId: event.subscriptionId },
          });
        }

        if (!subscription) {
          results.push({
            transactionId: event.transactionId,
            status: 'error',
            error: `Subscription '${event.subscriptionId}' not found`,
          });
          continue;
        }

        await db.usageEvent.create({
          data: {
            transactionId: event.transactionId,
            subscriptionId: subscription.id,
            code: event.code,
            timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
            properties: event.properties ?? {},
          },
        });

        if (subscription.status === 'ACTIVE') {
          affectedSubscriptions.add(subscription.id);
        }

        results.push({ transactionId: event.transactionId, status: 'created' });
      } catch (error: any) {
        results.push({
          transactionId: event.transactionId,
          status: 'error',
          error: error.message,
        });
      }
    }

    // Queue progressive billing checks for all affected subscriptions (debounced)
    if (tenantId) {
      for (const subscriptionId of affectedSubscriptions) {
        await this.queueProgressiveBillingCheck(tenantId, subscriptionId);
      }
    }

    return {
      total: dto.events.length,
      created: results.filter((r) => r.status === 'created').length,
      duplicates: results.filter((r) => r.status === 'duplicate').length,
      errors: results.filter((r) => r.status === 'error').length,
      results,
    };
  }

  // Queue a progressive billing check with 60s delay and deduplication
  private async queueProgressiveBillingCheck(tenantId: string, subscriptionId: string) {
    try {
      await this.billingQueue.add(
        BillingJobType.CHECK_PROGRESSIVE_BILLING,
        { tenantId, subscriptionId },
        {
          delay: 60_000, // 60s debounce to batch nearby events
          jobId: `progressive-${subscriptionId}`, // deduplication key
        },
      );
    } catch (err) {
      // Non-critical — log and continue
      this.logger.warn(`Failed to queue progressive billing check for ${subscriptionId}`, err);
    }
  }
}
