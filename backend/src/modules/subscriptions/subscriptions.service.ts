import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaClient } from '../../generated/prisma-tenant/client';
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
} from '../../queues/billing.queue';

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

    const now = new Date();
    const periodEnd = this.calculatePeriodEnd(now, plan.billingInterval);

    const hasTrial = dto.trialDays && dto.trialDays > 0;
    const trialEnd = hasTrial
      ? new Date(now.getTime() + dto.trialDays! * 24 * 60 * 60 * 1000)
      : null;

    const subscription = await db.subscription.create({
      data: {
        customerId: dto.customerId,
        planId: dto.planId,
        externalId: (dto as any).externalId ?? undefined,
        currency: dto.currency.toUpperCase(),
        billingTiming: plan.billingTiming || 'IN_ARREARS',
        status: hasTrial ? 'TRIALING' : 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: hasTrial ? trialEnd! : periodEnd,
        trialStart: hasTrial ? now : null,
        trialEnd: trialEnd,
        metadata: (dto.metadata ?? undefined) as any,
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
      await this.billingQueue.add(BillingJobType.GENERATE_INVOICE, {
        tenantId,
        subscriptionId: subscription.id,
        customerId: dto.customerId,
      } as GenerateInvoiceData);
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

      // Issue pro-rated credit note for unused days
      const plan = await db.plan.findUnique({
        where: { id: subscription.planId },
        include: { prices: true },
      });
      if (plan) {
        const price = plan.prices.find(
          (p: any) => p.currency.toUpperCase() === ((subscription as any).currency || 'USD').toUpperCase(),
        );
        if (price) {
          const totalDays = this.daysBetween(subscription.currentPeriodStart, subscription.currentPeriodEnd);
          const usedDays = this.daysBetween(subscription.currentPeriodStart, now);
          const remainingDays = Math.max(0, totalDays - usedDays);

          if (remainingDays > 0 && totalDays > 0) {
            const creditAmount = (Number(price.amount) * remainingDays) / totalDays;
            if (creditAmount > 0) {
              const lastInvoice = await db.invoice.findFirst({
                where: { subscriptionId: id },
                orderBy: { createdAt: 'desc' },
              });
              if (lastInvoice) {
                await db.creditNote.create({
                  data: {
                    invoiceId: lastInvoice.id,
                    customerId: subscription.customerId,
                    amount: creditAmount,
                    currency: (subscription as any).currency || 'USD',
                    reason: 'ORDER_CHANGE',
                    status: 'FINALIZED',
                    metadata: {
                      type: 'cancellation_proration',
                      planName: plan.name,
                      remainingDays,
                      totalDays,
                    },
                  },
                });
                this.logger.log(
                  `Pro-rated credit note: ${creditAmount} for ${remainingDays}/${totalDays} unused days on subscription ${id}`,
                );
              }
            }
          }
        }
      }

      updated = await db.subscription.update({
        where: { id },
        data: {
          status: 'CANCELED',
          canceledAt: now,
        },
        include: { customer: true, plan: true },
      });
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

    const now = new Date();
    const isUpgrade = Number(newPrice.amount) > Number(oldPrice?.amount || 0);

    if (isUpgrade) {
      // Upgrade: apply immediately with proration
      const totalDays = this.daysBetween(subscription.currentPeriodStart, subscription.currentPeriodEnd);
      const usedDays = this.daysBetween(subscription.currentPeriodStart, now);
      const remainingDays = Math.max(0, totalDays - usedDays);

      // Create credit note for unused days on old plan
      if (oldPrice && remainingDays > 0 && totalDays > 0) {
        const creditAmount = (Number(oldPrice.amount) * remainingDays) / totalDays;

        if (creditAmount > 0) {
          const lastInvoice = await db.invoice.findFirst({
            where: { subscriptionId: id },
            orderBy: { createdAt: 'desc' },
          });

          if (lastInvoice) {
            await db.creditNote.create({
              data: {
                invoiceId: lastInvoice.id,
                customerId: subscription.customerId,
                amount: creditAmount,
                currency: subscription.currency,
                reason: 'ORDER_CHANGE',
                status: 'FINALIZED',
                metadata: {
                  type: 'proration_credit',
                  oldPlanId: subscription.planId,
                  oldPlanName: subscription.plan.name,
                  remainingDays,
                  totalDays,
                },
              },
            });
          }
        }
      }

      const periodEnd = this.calculatePeriodEnd(now, newPlan.billingInterval);

      const updated = await db.subscription.update({
        where: { id },
        data: {
          previousPlanId: subscription.planId,
          planId: dto.newPlanId,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        },
        include: { customer: true, plan: true },
      });

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
          previousPlanId: subscription.planId,
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

  private calculatePeriodEnd(start: Date, interval: string): Date {
    const end = new Date(start);

    switch (interval) {
      case 'HOURLY':
        end.setHours(end.getHours() + 1);
        break;
      case 'DAILY':
        end.setDate(end.getDate() + 1);
        break;
      case 'WEEKLY':
        end.setDate(end.getDate() + 7);
        break;
      case 'MONTHLY':
        end.setMonth(end.getMonth() + 1);
        break;
      case 'QUARTERLY':
        end.setMonth(end.getMonth() + 3);
        break;
      case 'YEARLY':
        end.setFullYear(end.getFullYear() + 1);
        break;
      default:
        end.setMonth(end.getMonth() + 1);
    }

    return end;
  }

  private daysBetween(start: Date, end: Date): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.max(0, Math.round((end.getTime() - start.getTime()) / msPerDay));
  }
}
