import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Prisma, PrismaClient } from '../../generated/prisma-tenant/client';
import { billingKey, jobIdFor } from '../billing/billing-keys';
import { firstPeriodEnd, fractionOfPeriod } from '../billing/period';
import { dec, Dec, roundMoney } from '../billing/pricing';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { CancelSubscriptionDto } from './dto/cancel-subscription.dto';
import { ChangePlanDto } from './dto/change-plan.dto';
import { CentralPrismaService } from '../../database/central-prisma.service';
import {
  WEBHOOK_QUEUE,
  EMAIL_QUEUE,
  BILLING_QUEUE,
  WebhookJobType,
  EmailJobType,
  BillingJobType,
  GenerateInvoiceData,
  BaseCharge,
  InvoiceKind,
} from '../../queues/billing.queue';

/** Rough length of each interval in days, to compare plans billed on different intervals. */
const INTERVAL_DAYS: Record<string, number> = {
  HOURLY: 1 / 24,
  DAILY: 1,
  WEEKLY: 7,
  MONTHLY: 30.4375,
  QUARTERLY: 91.3125,
  YEARLY: 365.25,
};

interface SubscriptionQuery {
  status?: string;
  customerId?: string;
  planId?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    private readonly centralPrisma: CentralPrismaService,
    @InjectQueue(WEBHOOK_QUEUE) private readonly webhookQueue: Queue,
    @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
    @InjectQueue(BILLING_QUEUE) private readonly billingQueue: Queue,
  ) {}

  private async getTenantName(tenantId: string): Promise<string> {
    const tenant = await this.centralPrisma.client.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true },
    });
    return tenant?.name || 'Your billing provider';
  }

  async findAll(db: PrismaClient, query: SubscriptionQuery) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.customerId) where.customerId = query.customerId;
    if (query.planId) where.planId = query.planId;

    const [data, total] = await Promise.all([
      db.subscription.findMany({
        where,
        skip,
        take: limit,
        include: { customer: true, plan: { include: { prices: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      db.subscription.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(db: PrismaClient, id: string) {
    const subscription = await db.subscription.findUnique({
      where: { id },
      include: {
        customer: true,
        plan: { include: { prices: true } },
        invoices: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return subscription;
  }

  async create(db: PrismaClient, tenantId: string, dto: CreateSubscriptionDto) {
    const customer = await db.customer.findUnique({
      where: { id: dto.customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const plan = await db.plan.findUnique({
      where: { id: dto.planId },
      include: { prices: true },
    });

    if (!plan || !plan.isActive) {
      throw new BadRequestException('Plan not found or inactive');
    }

    const price = plan.prices.find(
      (p: any) => p.currency.toUpperCase() === dto.currency.toUpperCase(),
    );

    if (!price) {
      throw new BadRequestException(`No price found for currency ${dto.currency} on this plan`);
    }

    const now = dto.startDate ? new Date(dto.startDate) : new Date();
    const periodEnd = dto.currentPeriodEnd
      ? new Date(dto.currentPeriodEnd)
      : firstPeriodEnd(now, plan.billingInterval);
    if (periodEnd <= now) throw new BadRequestException('currentPeriodEnd must be after the start date');

    const hasTrial = dto.trialDays && dto.trialDays > 0;
    const trialEnd = hasTrial
      ? new Date(now.getTime() + dto.trialDays! * 24 * 60 * 60 * 1000)
      : null;

    const resolvedStatus = dto.status || (hasTrial ? 'TRIALING' : 'ACTIVE');

    const subscription = await db.subscription.create({
      data: {
        customerId: dto.customerId,
        planId: dto.planId,
        externalId: dto.externalId ?? undefined,
        currency: dto.currency.toUpperCase(),
        billingTiming: plan.billingTiming || 'IN_ARREARS',
        status: resolvedStatus,
        currentPeriodStart: now,
        currentPeriodEnd: hasTrial ? trialEnd! : periodEnd,
        // Periods are counted from here; a trial starts counting when it ends.
        billingAnchor: hasTrial ? null : now,
        trialStart: hasTrial ? now : null,
        trialEnd: trialEnd,
        metadata: (dto.metadata ?? undefined) as any,
        ...(dto.createdAt && { createdAt: new Date(dto.createdAt) }),
        ...(dto.canceledAt && { canceledAt: new Date(dto.canceledAt) }),
      },
      include: { customer: true, plan: true },
    });

    // Notify tenant via webhook
    await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
      tenantId,
      event: 'subscription.created',
      payload: {
        subscriptionId: subscription.id,
        customerId: dto.customerId,
        planId: dto.planId,
        status: subscription.status,
        currency: subscription.currency,
      },
    });

    // Email customer
    if (customer.email) {
      const tenantName = await this.getTenantName(tenantId);
      const price = plan.prices.find(
        (p: any) => p.currency.toUpperCase() === dto.currency.toUpperCase(),
      );
      if (hasTrial) {
        await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
          tenantId,
          to: customer.email,
          subject: `Your free trial has started — ${tenantName}`,
          template: 'trial-started',
          context: {
            tenantName,
            customerName: customer.name || customer.email,
            planName: plan.name,
            trialEnd: trialEnd?.toISOString().split('T')[0] || '',
          },
        });
      } else {
        await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
          tenantId,
          to: customer.email,
          subject: `Subscription confirmed — ${tenantName}`,
          template: 'subscription-activated',
          context: {
            tenantName,
            customerName: customer.name || customer.email,
            planName: plan.name,
            amount: price ? String(price.amount) : '0',
            currency: dto.currency.toUpperCase(),
            interval: plan.billingInterval.toLowerCase(),
          },
        });
      }
    }

    // Generate first invoice immediately for IN_ADVANCE billing (pay upfront)
    // IN_ARREARS invoices are generated at period end by the billing cron job
    if (!hasTrial && subscription.status === 'ACTIVE' && subscription.billingTiming === 'IN_ADVANCE') {
      this.logger.log(`Queueing immediate invoice for IN_ADVANCE subscription ${subscription.id}`);
      await this.queueInvoice({
        tenantId,
        subscriptionId: subscription.id,
        customerId: dto.customerId,
        kind: 'start',
        billingKey: billingKey(subscription.id, 'start', now),
        bases: [{ planId: plan.id, periodStart: now.toISOString(), periodEnd: periodEnd.toISOString() }],
      });
    }

    return subscription;
  }

  async update(db: PrismaClient, id: string, dto: UpdateSubscriptionDto) {
    const subscription = await db.subscription.findUnique({ where: { id } });
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return db.subscription.update({
      where: { id },
      data: {
        ...(dto.metadata !== undefined && { metadata: dto.metadata as any }),
      },
      include: { customer: true, plan: true },
    });
  }

  async cancel(db: PrismaClient, tenantId: string, id: string, dto: CancelSubscriptionDto) {
    const subscription = await db.subscription.findUnique({
      where: { id },
      include: { customer: true },
    });
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.status === 'CANCELED') {
      throw new BadRequestException('Subscription is already canceled');
    }

    let updated;
    if (dto.cancelAt === 'now') {
      const now = new Date();
      const moved = await db.subscription.updateMany({
        where: { id, status: subscription.status, currentPeriodStart: subscription.currentPeriodStart },
        data: { status: 'CANCELED', canceledAt: now },
      });
      if (moved.count === 0) throw new BadRequestException('Subscription changed meanwhile; reload and try again');
      if (subscription.status === 'ACTIVE' || subscription.status === 'PAST_DUE') {
        await this.closePeriodEarly(db, tenantId, subscription, now, 'cancellation', []);
      }
      updated = await db.subscription.findUniqueOrThrow({ where: { id }, include: { customer: true, plan: true } });
    } else {
      updated = await db.subscription.update({
        where: { id },
        data: {
          cancelAt: subscription.currentPeriodEnd,
        },
        include: { customer: true, plan: true },
      });
    }

    // Notify tenant via webhook
    await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
      tenantId,
      event: 'subscription.canceled',
      payload: {
        subscriptionId: id,
        customerId: subscription.customerId,
        cancelAt: dto.cancelAt === 'now' ? 'immediate' : subscription.currentPeriodEnd,
      },
    });

    // Email customer about cancellation
    if (subscription.customer?.email) {
      const tenantName = await this.getTenantName(tenantId);
      await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
        tenantId,
        to: subscription.customer.email,
        subject: `Subscription canceled — ${tenantName}`,
        template: 'subscription-canceled',
        context: {
          tenantName,
          customerName: subscription.customer.name || subscription.customer.email,
          cancelAt:
            dto.cancelAt === 'now'
              ? 'immediately'
              : subscription.currentPeriodEnd?.toISOString().split('T')[0],
        },
      });
    }

    return updated;
  }

  async pause(db: PrismaClient, tenantId: string, id: string) {
    const subscription = await db.subscription.findUnique({
      where: { id },
      include: { customer: true, plan: true },
    });
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.status !== 'ACTIVE') {
      throw new BadRequestException('Only active subscriptions can be paused');
    }

    const updated = await db.subscription.update({
      where: { id },
      data: { status: 'PAUSED' },
      include: { customer: true, plan: true },
    });

    // Email customer
    if (subscription.customer?.email) {
      const tenantName = await this.getTenantName(tenantId);
      await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
        tenantId,
        to: subscription.customer.email,
        subject: `Subscription paused — ${tenantName}`,
        template: 'subscription-paused',
        context: {
          tenantName,
          customerName: subscription.customer.name || subscription.customer.email,
          planName: subscription.plan.name,
        },
      });
    }

    // Webhook
    await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
      tenantId,
      event: 'subscription.paused',
      payload: { subscriptionId: id, customerId: subscription.customerId },
    });

    return updated;
  }

  async resume(db: PrismaClient, tenantId: string, id: string) {
    const subscription = await db.subscription.findUnique({
      where: { id },
      include: { customer: true, plan: true },
    });
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.status !== 'PAUSED') {
      throw new BadRequestException('Only paused subscriptions can be resumed');
    }

    const updated = await db.subscription.update({
      where: { id },
      data: { status: 'ACTIVE' },
      include: { customer: true, plan: true },
    });

    // Email customer
    if (subscription.customer?.email) {
      const tenantName = await this.getTenantName(tenantId);
      await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
        tenantId,
        to: subscription.customer.email,
        subject: `Subscription resumed — ${tenantName}`,
        template: 'subscription-resumed',
        context: {
          tenantName,
          customerName: subscription.customer.name || subscription.customer.email,
          planName: subscription.plan.name,
        },
      });
    }

    // Webhook
    await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
      tenantId,
      event: 'subscription.resumed',
      payload: { subscriptionId: id, customerId: subscription.customerId },
    });

    return updated;
  }

  async changePlan(db: PrismaClient, tenantId: string, id: string, dto: ChangePlanDto) {
    const subscription = await db.subscription.findUnique({
      where: { id },
      include: { plan: { include: { prices: true } }, customer: true },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const newPlan = await db.plan.findUnique({
      where: { id: dto.newPlanId },
      include: { prices: true },
    });

    if (!newPlan || !newPlan.isActive) {
      throw new BadRequestException('New plan not found or inactive');
    }

    const oldPrice = subscription.plan.prices.find(
      (p: any) => p.currency.toUpperCase() === subscription.currency.toUpperCase(),
    );
    const newPrice = newPlan.prices.find(
      (p: any) => p.currency.toUpperCase() === subscription.currency.toUpperCase(),
    );

    if (!newPrice) {
      throw new BadRequestException(`New plan has no price for currency ${subscription.currency}`);
    }

    if (subscription.status !== 'ACTIVE' && subscription.status !== 'TRIALING') {
      throw new BadRequestException(`A ${subscription.status.toLowerCase()} subscription cannot change plan`);
    }
    if (dto.newPlanId === subscription.planId) throw new BadRequestException('The subscription is already on this plan');

    const now = new Date();
    // Compare price per day, so a yearly plan is not an "upgrade" from a monthly one just for costing more per invoice.
    const perDay = (amount: unknown, interval: string) => dec(amount as string).div(INTERVAL_DAYS[interval] ?? 30.4375);
    const isUpgrade = perDay(newPrice.amount, newPlan.billingInterval).gt(perDay(oldPrice?.amount ?? 0, subscription.plan.billingInterval));

    if (subscription.status === 'TRIALING') {
      // Nothing has been billed during a trial: switch plans, and billing starts with the new one.
      const updated = await db.subscription.update({
        where: { id },
        data: { previousPlanId: subscription.planId, planId: newPlan.id, billingTiming: newPlan.billingTiming },
        include: { customer: true, plan: true },
      });
      await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
        tenantId,
        event: 'subscription.plan_changed',
        payload: { subscriptionId: id, customerId: subscription.customerId, oldPlanId: subscription.planId, newPlanId: newPlan.id, effectiveImmediately: true },
      });
      return updated;
    }

    if (isUpgrade) {
      // Upgrade: close the current period now (credit what was paid in advance and
      // not used, bill usage so far), and start a new period on the new plan.
      const periodEnd = firstPeriodEnd(now, newPlan.billingInterval);
      const moved = await db.subscription.updateMany({
        where: { id, status: 'ACTIVE', currentPeriodStart: subscription.currentPeriodStart },
        data: {
          previousPlanId: subscription.planId,
          planId: newPlan.id,
          billingTiming: newPlan.billingTiming,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          billingAnchor: now,
          lastProgressiveBillingAt: null,
          metadata: this.withoutPendingChange(subscription.metadata),
        },
      });
      if (moved.count === 0) throw new BadRequestException('Subscription changed meanwhile; reload and try again');

      const newBases: BaseCharge[] =
        newPlan.billingTiming === 'IN_ADVANCE'
          ? [{ planId: newPlan.id, periodStart: now.toISOString(), periodEnd: periodEnd.toISOString() }]
          : [];
      await this.closePeriodEarly(db, tenantId, subscription, now, 'plan_change', newBases);

      const updated = await db.subscription.findUniqueOrThrow({ where: { id }, include: { customer: true, plan: true } });

      // Notify tenant via webhook
      await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
        tenantId,
        event: 'subscription.plan_changed',
        payload: {
          subscriptionId: id,
          customerId: subscription.customerId,
          oldPlanId: subscription.planId,
          newPlanId: dto.newPlanId,
          proration: { type: 'upgrade', effectiveImmediately: true },
        },
      });

      // Email customer about plan change
      if (subscription.customer?.email) {
        const tenantName = await this.getTenantName(tenantId);
        await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
          tenantId,
          to: subscription.customer.email,
          subject: `Plan upgraded — ${tenantName}`,
          template: 'subscription-plan-changed',
          context: {
            tenantName,
            customerName: subscription.customer.name || subscription.customer.email,
            oldPlanName: subscription.plan.name,
            newPlanName: newPlan.name,
          },
        });
      }

      return updated;
    } else {
      // Downgrade: takes effect at period end
      const updated = await db.subscription.update({
        where: { id },
        data: {
          metadata: {
            ...(subscription.metadata as any || {}),
            pendingPlanChange: {
              newPlanId: dto.newPlanId,
              effectiveAt: subscription.currentPeriodEnd.toISOString(),
            },
          },
        },
        include: { customer: true, plan: true },
      });

      // Notify tenant via webhook
      await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
        tenantId,
        event: 'subscription.plan_change_scheduled',
        payload: {
          subscriptionId: id,
          customerId: subscription.customerId,
          oldPlanId: subscription.planId,
          newPlanId: dto.newPlanId,
          effectiveAt: subscription.currentPeriodEnd.toISOString(),
        },
      });

      if (subscription.customer?.email) {
        const tenantName = await this.getTenantName(tenantId);
        await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
          tenantId,
          to: subscription.customer.email,
          subject: `Plan change scheduled — ${tenantName}`,
          template: 'subscription-plan-changed',
          context: {
            tenantName,
            customerName: subscription.customer.name || subscription.customer.email,
            oldPlanName: subscription.plan.name,
            newPlanName: newPlan.name,
            effectiveAt: subscription.currentPeriodEnd.toISOString().split('T')[0],
          },
        });
      }

      return updated;
    }
  }

  private withoutPendingChange(metadata: Prisma.JsonValue | null): Prisma.InputJsonValue {
    const { pendingPlanChange: _pending, ...rest } = ((metadata as Record<string, unknown> | null) ?? {});
    return rest as Prisma.InputJsonValue;
  }

  private async queueInvoice(data: GenerateInvoiceData): Promise<void> {
    await this.billingQueue.add(BillingJobType.GENERATE_INVOICE, data, data.billingKey ? { jobId: jobIdFor(data.billingKey) } : undefined);
  }

  /**
   * Ends the current period at `now` (an immediate cancellation, or an
   * upgrade): credits the unused part of what was billed in advance for it,
   * and invoices usage so far plus the used part of an in-arrears price,
   * together with any new charges (`extraBases`).
   */
  private async closePeriodEarly(
    db: PrismaClient,
    tenantId: string,
    sub: { id: string; customerId: string; planId: string; currency: string; billingTiming: string; currentPeriodStart: Date; currentPeriodEnd: Date },
    now: Date,
    kind: InvoiceKind,
    extraBases: BaseCharge[],
  ): Promise<void> {
    const start = sub.currentPeriodStart;
    const end = sub.currentPeriodEnd;
    const unused = 1 - fractionOfPeriod(start, end, start, now);

    if (sub.billingTiming === 'IN_ADVANCE' && unused > 0) {
      const advance = await this.advanceBilling(db, sub.id, start);
      if (advance) {
        const credit = roundMoney(advance.amount.mul(unused), sub.currency);
        if (credit.gt(0)) {
          await db.creditNote.create({
            data: {
              invoiceId: advance.invoiceId,
              customerId: sub.customerId,
              amount: credit,
              currency: sub.currency,
              reason: 'ORDER_CHANGE',
              status: 'FINALIZED',
              metadata: {
                type: kind === 'cancellation' ? 'cancellation_proration' : 'proration_credit',
                oldPlanId: sub.planId,
                unusedFraction: Number(unused.toFixed(6)),
                periodStart: start.toISOString(),
                periodEnd: end.toISOString(),
              },
            },
          });
          this.logger.log(`Credit note of ${credit} ${sub.currency} for the unused part of subscription ${sub.id}'s period`);
        }
      }
    }

    const bases: BaseCharge[] = [...extraBases];
    if (sub.billingTiming === 'IN_ARREARS' && unused < 1) {
      bases.unshift({ planId: sub.planId, periodStart: start.toISOString(), periodEnd: end.toISOString(), fraction: 1 - unused });
    }
    await this.queueInvoice({
      tenantId,
      subscriptionId: sub.id,
      customerId: sub.customerId,
      kind,
      billingKey: billingKey(sub.id, kind, now),
      bases,
      usage: { planId: sub.planId, periodStart: start.toISOString(), from: start.toISOString(), to: now.toISOString() },
    });
  }

  /** The invoice that billed this period's price in advance, and the amount it billed for it. */
  private async advanceBilling(db: PrismaClient, subscriptionId: string, periodStart: Date): Promise<{ invoiceId: string; amount: Dec } | null> {
    const candidates = await db.invoice.findMany({
      where: { subscriptionId, status: { in: ['DRAFT', 'PENDING', 'PAID', 'FAILED'] }, createdAt: { gte: new Date(periodStart.getTime() - 7 * 24 * 3600_000) } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    const iso = periodStart.toISOString();
    for (const invoice of candidates) {
      const items = (((invoice.metadata as Record<string, unknown> | null)?.items ?? []) as { type?: string; amount?: string; unitAmount?: number | string; quantity?: number; periodStart?: string }[]);
      const plan = items.find((i) => i.type === 'plan' && i.periodStart === iso)
        // Invoices from before lines carried their period: the newest one billed since the period began.
        ?? (invoice.createdAt >= periodStart ? items.find((i) => i.type === 'plan' && !i.periodStart) : undefined);
      if (plan) return { invoiceId: invoice.id, amount: dec(plan.amount ?? dec(plan.unitAmount ?? 0).mul(plan.quantity ?? 1)) };
    }
    return null;
  }
}
