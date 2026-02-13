import { Processor, WorkerHost, InjectQueue } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Job, Queue } from 'bullmq';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { TenantDatabaseService } from '../../database/tenant-database.service';
import { PdfService } from '../../services/pdf.service';
import {
  BILLING_QUEUE,
  WEBHOOK_QUEUE,
  EMAIL_QUEUE,
  PAYMENT_QUEUE,
  BillingJobType,
  WebhookJobType,
  EmailJobType,
  PaymentJobType,
  GenerateInvoiceData,
} from '../billing.queue';
import { WalletsService } from '../../modules/wallets/wallets.service';
import { TaxesService } from '../../modules/taxes/taxes.service';
import { PlanOverridesService } from '../../modules/plan-overrides/plan-overrides.service';

@Processor(BILLING_QUEUE)
export class BillingProcessor extends WorkerHost {
  private readonly logger = new Logger(BillingProcessor.name);

  constructor(
    private readonly centralPrisma: CentralPrismaService,
    private readonly tenantDbService: TenantDatabaseService,
    private readonly pdfService: PdfService,
    private readonly walletsService: WalletsService,
    private readonly taxesService: TaxesService,
    private readonly planOverridesService: PlanOverridesService,
    @InjectQueue(BILLING_QUEUE) private readonly billingQueue: Queue,
    @InjectQueue(WEBHOOK_QUEUE) private readonly webhookQueue: Queue,
    @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
    @InjectQueue(PAYMENT_QUEUE) private readonly paymentQueue: Queue,
  ) {
    super();
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async scheduleDailyBilling(): Promise<void> {
    this.logger.log('Scheduling daily billing cycle job');
    await this.billingQueue.add(BillingJobType.DAILY_BILLING_CYCLE, {});
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async schedulePaymentReminders(): Promise<void> {
    this.logger.log('Scheduling payment reminder checks');
    const connections = await this.centralPrisma.client.databaseConnection.findMany({
      where: { isHealthy: true },
      include: { tenant: { select: { id: true, isActive: true } } },
    });

    for (const conn of connections) {
      if (!conn.tenant.isActive) continue;
      await this.billingQueue.add(BillingJobType.PAYMENT_REMINDERS, {
        tenantId: conn.tenantId,
      });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async scheduleSubscriptionRenewals(): Promise<void> {
    this.logger.log('Scheduling subscription renewal checks');
    const connections = await this.centralPrisma.client.databaseConnection.findMany({
      where: { isHealthy: true },
      include: { tenant: { select: { id: true, isActive: true } } },
    });

    for (const conn of connections) {
      if (!conn.tenant.isActive) continue;
      await this.billingQueue.add(BillingJobType.SUBSCRIPTION_RENEWAL, {
        tenantId: conn.tenantId,
      });
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async scheduleDraftFinalization(): Promise<void> {
    this.logger.log('Scheduling draft invoice finalization checks');
    const connections = await this.centralPrisma.client.databaseConnection.findMany({
      where: { isHealthy: true },
      include: { tenant: { select: { id: true, isActive: true } } },
    });

    for (const conn of connections) {
      if (!conn.tenant.isActive) continue;
      await this.billingQueue.add(BillingJobType.FINALIZE_DRAFT_INVOICES, {
        tenantId: conn.tenantId,
      });
    }
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case BillingJobType.DAILY_BILLING_CYCLE:
        return this.handleDailyBillingCycle(job);
      case BillingJobType.GENERATE_INVOICE:
        return this.handleGenerateInvoice(job);
      case BillingJobType.SUBSCRIPTION_RENEWAL:
        return this.handleSubscriptionRenewal(job);
      case BillingJobType.PAYMENT_REMINDERS:
        return this.handlePaymentReminders(job);
      case BillingJobType.FINALIZE_DRAFT_INVOICES:
        return this.handleFinalizeDraftInvoices(job);
      case BillingJobType.CHECK_PROGRESSIVE_BILLING:
        return this.handleCheckProgressiveBilling(job);
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }

  private async handleDailyBillingCycle(_job: Job): Promise<void> {
    this.logger.log('Starting daily billing cycle');

    const connections = await this.centralPrisma.client.databaseConnection.findMany({
      where: { isHealthy: true },
      include: { tenant: { select: { id: true, name: true, isActive: true } } },
    });

    for (const conn of connections) {
      if (!conn.tenant.isActive) continue;

      try {
        const db = await this.tenantDbService.getTenantClient(conn.tenantId);

        // Find subscriptions ending within 3 days
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

        const expiringSubs = await db.subscription.findMany({
          where: {
            status: 'ACTIVE',
            currentPeriodEnd: { lte: threeDaysFromNow },
          },
          include: { customer: true },
        });

        this.logger.log(
          `Tenant ${conn.tenant.name}: ${expiringSubs.length} subscriptions expiring`,
        );

        for (const sub of expiringSubs) {
          await this.billingQueue.add(BillingJobType.GENERATE_INVOICE, {
            tenantId: conn.tenantId,
            subscriptionId: sub.id,
            customerId: sub.customerId,
          } as GenerateInvoiceData);
          this.logger.log(`Queued invoice generation for subscription ${sub.id}`);
        }

        // Check for trials ending within 3 days and send reminder emails
        const expiringTrials = await db.subscription.findMany({
          where: {
            status: 'TRIALING',
            trialEnd: { lte: threeDaysFromNow, gt: new Date() },
          },
          include: { customer: true, plan: true },
        });

        for (const trial of expiringTrials) {
          if (trial.customer?.email) {
            await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
              tenantId: conn.tenantId,
              to: trial.customer.email,
              subject: 'Your free trial is ending soon',
              template: 'trial-ending-soon',
              context: {
                customerName: trial.customer.name || trial.customer.email,
                planName: trial.plan.name,
                trialEnd: trial.trialEnd?.toISOString().split('T')[0] || '',
              },
            });
          }
        }

        if (expiringTrials.length > 0) {
          this.logger.log(
            `Tenant ${conn.tenant.name}: Sent ${expiringTrials.length} trial ending soon reminders`,
          );
        }
      } catch (error) {
        this.logger.error(`Failed to process billing for tenant ${conn.tenant.name}`, error);
      }
    }

    this.logger.log('Daily billing cycle complete');
  }

  private async handleGenerateInvoice(job: Job<GenerateInvoiceData>): Promise<void> {
    const { tenantId, subscriptionId, customerId } = job.data;
    this.logger.log(`Generating invoice for subscription ${subscriptionId}`);

    try {
      const db = await this.tenantDbService.getTenantClient(tenantId);

      const subscription = await db.subscription.findUnique({
        where: { id: subscriptionId },
        include: { plan: { include: { prices: true, charges: { include: { billableMetric: true, graduatedRanges: { orderBy: { order: 'asc' } } } } } } },
      });

      if (!subscription) {
        this.logger.warn(`Subscription ${subscriptionId} not found`);
        return;
      }

      // Cast plan from include - generated Prisma types may be stale
      const plan = (subscription as any).plan;

      const price = plan.prices.find((p: any) => p.currency === subscription.currency);

      if (!price) {
        this.logger.warn(`No price found for currency ${subscription.currency}`);
        return;
      }

      const customer = await db.customer.findUnique({
        where: { id: customerId },
      });

      // Resolve net payment terms: customer → plan → org default → 30 days
      const tenantForTerms = await this.centralPrisma.client.tenant.findUnique({
        where: { id: tenantId },
        select: { settings: true },
      });
      const termsSettings = (tenantForTerms?.settings || {}) as Record<string, unknown>;
      const netPaymentTerms =
        (customer as any)?.netPaymentTerms ??
        (subscription as any).plan?.netPaymentTerms ??
        (termsSettings.netPaymentTerms as number | undefined) ??
        30;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + netPaymentTerms);

      // Generate sequential invoice number
      const lastInvoice = await db.invoice.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { invoiceNumber: true },
      });
      let nextSeq = 1;
      if (lastInvoice?.invoiceNumber) {
        const match = lastInvoice.invoiceNumber.match(/INV-(\d+)/);
        if (match) nextSeq = parseInt(match[1], 10) + 1;
      }
      const invoiceNumber = `INV-${String(nextSeq).padStart(5, '0')}`;

      // --- Build line items ---
      const lineItems: Array<{
        description: string;
        quantity: number;
        unitAmount: number;
        type: string;
      }> = [];

      // Check for plan override (customer-specific pricing)
      const priceOverride = await this.planOverridesService.resolvePrice(
        db, customerId, subscription.planId, subscription.currency,
      );
      const basePlanAmount = priceOverride ?? Number(price.amount);
      let totalAmount = basePlanAmount;

      // 1) Base plan charge
      lineItems.push({
        description: `${plan.name} (${plan.billingInterval.toLowerCase()})${priceOverride !== null ? ' [custom pricing]' : ''}`,
        quantity: 1,
        unitAmount: basePlanAmount,
        type: 'plan',
      });

      // 2) Usage-based charges (from Charges linked to BillableMetrics)
      const charges = plan.charges || [];
      for (const charge of charges) {
        try {
          // Aggregate usage events for this metric in the current billing period
          const events = await db.usageEvent.findMany({
            where: {
              subscriptionId,
              code: charge.billableMetric.code,
              timestamp: {
                gte: subscription.currentPeriodStart,
                lt: subscription.currentPeriodEnd,
              },
            },
            orderBy: { timestamp: 'desc' },
          });

          const units = this.aggregateEvents(
            events,
            charge.billableMetric.aggregationType,
            charge.billableMetric.fieldName,
          );

          if (units > 0) {
            // Check for charge-level plan override
            const chargeOverride = await this.planOverridesService.resolveChargeProperties(
              db, customerId, subscription.planId, charge.id,
            );
            const chargeProps = (chargeOverride?.properties as Record<string, any>) ?? (charge.properties as Record<string, any>) ?? {};
            const chargeRanges = chargeOverride?.graduatedRanges ?? charge.graduatedRanges;

            const chargeCost = this.calculateChargeCost(
              charge.chargeModel,
              units,
              chargeProps,
              chargeRanges,
            );

            // Apply minimum amount if configured
            const finalCost = charge.minAmountCents
              ? Math.max(chargeCost, charge.minAmountCents / 100)
              : chargeCost;

            if (finalCost > 0) {
              lineItems.push({
                description: charge.invoiceDisplayName || `${charge.billableMetric.name} (${units} units)`,
                quantity: units,
                unitAmount: finalCost / units,
                type: 'usage',
              });
              totalAmount += finalCost;
            }
          }
        } catch (chargeError) {
          this.logger.error(`Failed to calculate charge ${charge.id}`, chargeError);
        }
      }

      // 3) Minimum commitment check (with override support)
      const commitmentOverride = await this.planOverridesService.resolveMinimumCommitment(
        db, customerId, subscription.planId,
      );
      const effectiveMinCommitment = commitmentOverride ?? (plan.minimumCommitment ? Number(plan.minimumCommitment) : null);
      if (effectiveMinCommitment) {
        const minCommitment = effectiveMinCommitment;
        if (totalAmount < minCommitment) {
          const trueUpAmount = minCommitment - totalAmount;
          lineItems.push({
            description: 'Minimum commitment true-up',
            quantity: 1,
            unitAmount: trueUpAmount,
            type: 'minimum_commitment',
          });
          totalAmount = minCommitment;
        }
      }

      // 4) Apply coupons
      let discountAmount = 0;
      const appliedCoupons = await db.appliedCoupon.findMany({
        where: {
          customerId,
          OR: [{ subscriptionId }, { subscriptionId: null }],
        },
        include: { coupon: true },
      });

      for (const ac of appliedCoupons) {
        if (!ac.coupon.isActive) continue;
        if (ac.coupon.expiresAt && ac.coupon.expiresAt < new Date()) continue;
        if (ac.usesRemaining !== null && ac.usesRemaining <= 0) continue;

        let discount = 0;
        if (ac.coupon.discountType === 'PERCENTAGE') {
          discount = (totalAmount * Number(ac.coupon.discountValue)) / 100;
        } else if (ac.coupon.discountType === 'FIXED_AMOUNT') {
          if (!ac.coupon.currency || ac.coupon.currency === subscription.currency) {
            discount = Number(ac.coupon.discountValue);
          }
        }

        if (discount > 0) {
          discountAmount += discount;
          lineItems.push({
            description: `Coupon: ${ac.coupon.code} (${ac.coupon.discountType === 'PERCENTAGE' ? `${ac.coupon.discountValue}%` : `-${ac.coupon.discountValue}`})`,
            quantity: 1,
            unitAmount: -discount,
            type: 'coupon',
          });

          // Decrement usesRemaining
          if (ac.usesRemaining !== null) {
            await db.appliedCoupon.update({
              where: { id: ac.id },
              data: { usesRemaining: ac.usesRemaining - 1 },
            });
            // Auto-remove exhausted coupons
            if (ac.usesRemaining - 1 <= 0) {
              await db.appliedCoupon.delete({ where: { id: ac.id } });
            }
          }
        }
      }

      totalAmount -= discountAmount;

      // 5) Collect pending add-on charges
      const pendingAddOns = await db.appliedAddOn.findMany({
        where: {
          customerId,
          invoiceId: null,
          currency: subscription.currency,
        },
      });

      for (const addon of pendingAddOns) {
        lineItems.push({
          description: `Add-on charge (${addon.addOnId})`,
          quantity: 1,
          unitAmount: Number(addon.amount),
          type: 'add_on',
        });
        totalAmount += Number(addon.amount);
      }

      // 6) Calculate taxes
      let taxAmount = 0;
      try {
        const taxes = await this.taxesService.resolveTaxes(
          db,
          customerId,
          subscription.planId,
        );

        if (taxes.length > 0) {
          const taxableAmount = totalAmount > 0 ? totalAmount : 0;
          for (const tax of taxes) {
            const amount = (taxableAmount * Number(tax.rate)) / 100;
            taxAmount += amount;
            lineItems.push({
              description: `Tax: ${tax.name} (${tax.rate}%)`,
              quantity: 1,
              unitAmount: amount,
              type: 'tax',
            });
          }
          totalAmount += taxAmount;
          this.logger.log(
            `Applied ${taxes.length} tax(es) totaling ${taxAmount} ${subscription.currency}`,
          );
        }
      } catch (taxError) {
        this.logger.error(`Failed to calculate taxes for invoice`, taxError);
      }

      // Ensure total doesn't go negative
      if (totalAmount < 0) totalAmount = 0;

      // Resolve grace period: plan setting → org default → 0
      const gracePeriodDays =
        plan?.invoiceGracePeriodDays ??
        (termsSettings.invoiceGracePeriodDays as number | undefined) ??
        0;
      const isDraft = gracePeriodDays > 0;
      let gracePeriodEndsAt: string | undefined;
      if (isDraft) {
        const gpEnd = new Date();
        gpEnd.setDate(gpEnd.getDate() + gracePeriodDays);
        gracePeriodEndsAt = gpEnd.toISOString();
      }

      const invoice = await db.invoice.create({
        data: {
          invoiceNumber,
          subscriptionId,
          customerId,
          amount: totalAmount,
          currency: subscription.currency,
          dueDate,
          status: isDraft ? 'DRAFT' as any : 'PENDING',
          metadata: {
            planName: plan.name,
            billingInterval: plan.billingInterval,
            items: lineItems,
            taxAmount,
            ...(gracePeriodEndsAt && { gracePeriodEndsAt }),
          },
        },
      });

      // 6) Apply wallet / prepaid credits (after coupons and add-ons, like Lago)
      let walletDeduction = 0;
      if (totalAmount > 0) {
        try {
          walletDeduction = await this.walletsService.applyToInvoice(
            db,
            tenantId,
            customerId,
            invoice.id,
            totalAmount,
            subscription.currency,
          );
          if (walletDeduction > 0) {
            lineItems.push({
              description: 'Prepaid credits applied',
              quantity: 1,
              unitAmount: -walletDeduction,
              type: 'wallet_credit',
            });
            totalAmount -= walletDeduction;
            if (totalAmount < 0) totalAmount = 0;

            // Update invoice with reduced amount
            await db.invoice.update({
              where: { id: invoice.id },
              data: {
                amount: totalAmount,
                metadata: {
                  planName: plan.name,
                  billingInterval: plan.billingInterval,
                  items: lineItems,
                  prepaidCreditAmount: walletDeduction,
                },
              },
            });

            this.logger.log(`Applied ${walletDeduction} ${subscription.currency} in wallet credits to invoice ${invoice.id}`);
          }
        } catch (walletError) {
          this.logger.error(`Failed to apply wallet credits for invoice ${invoice.id}`, walletError);
        }
      }

      // Mark add-ons as invoiced
      if (pendingAddOns.length > 0) {
        await db.appliedAddOn.updateMany({
          where: { id: { in: pendingAddOns.map((a) => a.id) } },
          data: { invoiceId: invoice.id },
        });
        this.logger.log(`Attached ${pendingAddOns.length} add-on charges to invoice ${invoice.id}`);
      }

      // Fetch tenant info for PDF header
      const tenant = await this.centralPrisma.client.tenant.findUnique({
        where: { id: tenantId },
        select: { name: true, email: true, settings: true },
      });
      const tenantSettings = (tenant?.settings || {}) as Record<string, unknown>;
      const tenantInfo = {
        name: tenant?.name || 'Invoice',
        email: tenant?.email,
        address: tenantSettings.address as string | undefined,
        country: tenantSettings.country as string | undefined,
        taxId: tenantSettings.taxId as string | undefined,
      };

      // Generate PDF for the invoice
      let pdfUrl: string | undefined;
      try {
        const pdfBuffer = await this.pdfService.generateInvoicePDF(
          {
            id: invoice.id,
            invoiceNumber,
            amount: String(totalAmount),
            currency: subscription.currency,
            status: invoice.status,
            dueDate,
            createdAt: invoice.createdAt,
            metadata: { items: lineItems },
          },
          {
            name: customer?.name,
            email: customer?.email || '',
            country: customer?.country,
          },
          tenantInfo,
        );
        const filename = `invoice-${invoice.id}.pdf`;
        await this.pdfService.savePdf(pdfBuffer, filename);
        pdfUrl = this.pdfService.getPublicUrl(filename);

        await db.invoice.update({
          where: { id: invoice.id },
          data: { pdfUrl },
        });

        this.logger.log(`PDF generated for invoice ${invoice.id}`);
      } catch (pdfError) {
        this.logger.error(`Failed to generate PDF for invoice ${invoice.id}`, pdfError);
      }

      // Notify tenant via webhook
      await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
        tenantId,
        event: isDraft ? 'invoice.drafted' : 'invoice.created',
        payload: {
          invoiceId: invoice.id,
          invoiceNumber,
          customerId,
          subscriptionId,
          amount: totalAmount,
          currency: subscription.currency,
          dueDate: dueDate.toISOString(),
          status: isDraft ? 'DRAFT' : 'PENDING',
        },
      });

      // Skip email and auto-charge for DRAFT invoices (grace period active)
      if (!isDraft) {
        // Send invoice email to customer
        if (customer?.email) {
          await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
            tenantId,
            to: customer.email,
            subject: `Invoice ${invoiceNumber} from ${tenantInfo.name}`,
            template: 'invoice',
            context: {
              tenantName: tenantInfo.name,
              customerName: customer.name || customer.email,
              invoiceId: invoiceNumber,
              amount: String(totalAmount),
              currency: subscription.currency,
              dueDate: dueDate.toISOString().split('T')[0],
              pdfUrl: pdfUrl || '',
            },
          });
        }

        // Auto-charge saved payment method if available
        const paymentMethodId = (subscription as any).paymentMethodId as string | null;
        if (totalAmount > 0 && paymentMethodId) {
          this.logger.log(
            `Queueing auto-charge for invoice ${invoice.id} using payment method ${paymentMethodId}`,
          );
          await this.paymentQueue.add(PaymentJobType.AUTO_CHARGE_PAYMENT_METHOD, {
            tenantId,
            invoiceId: invoice.id,
            subscriptionId,
            paymentMethodId,
          });
        }
      } else {
        this.logger.log(`Invoice ${invoice.id} created as DRAFT (grace period: ${gracePeriodDays} days)`);
      }

      this.logger.log(`Invoice ${invoice.id} generated for subscription ${subscriptionId}`);
    } catch (error) {
      this.logger.error(`Failed to generate invoice for ${subscriptionId}`, error);
      throw error;
    }
  }

  private async handleSubscriptionRenewal(job: Job<{ tenantId: string }>): Promise<void> {
    const { tenantId } = job.data;
    this.logger.log(`Processing subscription renewals for tenant ${tenantId}`);

    try {
      const db = await this.tenantDbService.getTenantClient(tenantId);
      const now = new Date();

      // --- Convert expired trials to ACTIVE ---
      const expiredTrials = await db.subscription.findMany({
        where: {
          status: 'TRIALING',
          trialEnd: { lte: now },
        },
        include: { plan: { include: { prices: true } }, customer: true },
      });

      for (const trial of expiredTrials) {
        const periodEnd = new Date(now);
        switch (trial.plan.billingInterval) {
          case 'HOURLY':
            periodEnd.setHours(periodEnd.getHours() + 1);
            break;
          case 'DAILY':
            periodEnd.setDate(periodEnd.getDate() + 1);
            break;
          case 'WEEKLY':
            periodEnd.setDate(periodEnd.getDate() + 7);
            break;
          case 'MONTHLY':
            periodEnd.setMonth(periodEnd.getMonth() + 1);
            break;
          case 'QUARTERLY':
            periodEnd.setMonth(periodEnd.getMonth() + 3);
            break;
          case 'YEARLY':
            periodEnd.setFullYear(periodEnd.getFullYear() + 1);
            break;
        }

        await db.subscription.update({
          where: { id: trial.id },
          data: {
            status: 'ACTIVE',
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
            trialStart: null,
            trialEnd: null,
          },
        });

        // Generate first invoice only for IN_ADVANCE billing (pay upfront)
        // IN_ARREARS will be invoiced at period end by the daily billing cycle
        if ((trial as any).billingTiming === 'IN_ADVANCE') {
          await this.billingQueue.add(BillingJobType.GENERATE_INVOICE, {
            tenantId,
            subscriptionId: trial.id,
            customerId: trial.customerId,
          } as GenerateInvoiceData);
        }

        // Notify tenant via webhook
        await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
          tenantId,
          event: 'subscription.trial_ended',
          payload: {
            subscriptionId: trial.id,
            customerId: trial.customerId,
            planId: trial.planId,
            status: 'ACTIVE',
          },
        });

        // Email customer about trial conversion
        if (trial.customer?.email) {
          const price = trial.plan.prices.find((p: any) => p.currency === trial.currency);
          await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
            tenantId,
            to: trial.customer.email,
            subject: 'Your trial has ended - Subscription is now active',
            template: 'trial-converted',
            context: {
              customerName: trial.customer.name || trial.customer.email,
              planName: trial.plan.name,
              amount: price ? String(price.amount) : '0',
              currency: trial.currency,
            },
          });
        }

        this.logger.log(`Converted trial subscription ${trial.id} to ACTIVE`);
      }

      if (expiredTrials.length > 0) {
        this.logger.log(
          `Converted ${expiredTrials.length} trial subscriptions for tenant ${tenantId}`,
        );
      }

      // --- Renew expired active subscriptions ---
      const expiredSubs = await db.subscription.findMany({
        where: {
          status: 'ACTIVE',
          currentPeriodEnd: { lte: now },
          cancelAt: null,
        },
        include: { plan: true },
      });

      for (const sub of expiredSubs) {
        const newEnd = new Date(sub.currentPeriodEnd);

        switch (sub.plan.billingInterval) {
          case 'HOURLY':
            newEnd.setHours(newEnd.getHours() + 1);
            break;
          case 'DAILY':
            newEnd.setDate(newEnd.getDate() + 1);
            break;
          case 'WEEKLY':
            newEnd.setDate(newEnd.getDate() + 7);
            break;
          case 'MONTHLY':
            newEnd.setMonth(newEnd.getMonth() + 1);
            break;
          case 'QUARTERLY':
            newEnd.setMonth(newEnd.getMonth() + 3);
            break;
          case 'YEARLY':
            newEnd.setFullYear(newEnd.getFullYear() + 1);
            break;
        }

        await db.subscription.update({
          where: { id: sub.id },
          data: {
            currentPeriodStart: sub.currentPeriodEnd,
            currentPeriodEnd: newEnd,
          },
        });

        // Generate invoice for the new period (IN_ADVANCE) or completed period (IN_ARREARS)
        await this.billingQueue.add(BillingJobType.GENERATE_INVOICE, {
          tenantId,
          subscriptionId: sub.id,
          customerId: sub.customerId,
        } as GenerateInvoiceData);

        // Notify via webhook
        await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
          tenantId,
          event: 'subscription.renewed',
          payload: {
            subscriptionId: sub.id,
            customerId: sub.customerId,
            planId: sub.planId,
            currentPeriodStart: sub.currentPeriodEnd.toISOString(),
            currentPeriodEnd: newEnd.toISOString(),
          },
        });

        this.logger.log(`Renewed subscription ${sub.id} until ${newEnd.toISOString()}`);
      }

      // Handle subscriptions marked for cancellation
      const cancelingSubs = await db.subscription.findMany({
        where: {
          cancelAt: { lte: now },
          status: { not: 'CANCELED' },
        },
      });

      for (const sub of cancelingSubs) {
        await db.subscription.update({
          where: { id: sub.id },
          data: { status: 'CANCELED', canceledAt: now },
        });
        this.logger.log(`Canceled subscription ${sub.id}`);
      }

      // Handle pending plan downgrades
      const allActiveSubs = await db.subscription.findMany({
        where: {
          status: 'ACTIVE',
          currentPeriodEnd: { lte: now },
        },
      });

      for (const sub of allActiveSubs) {
        const meta = (sub.metadata as any) || {};
        if (meta.pendingPlanChange?.newPlanId) {
          const newPlan = await db.plan.findUnique({
            where: { id: meta.pendingPlanChange.newPlanId },
          });

          if (newPlan) {
            const { pendingPlanChange, ...restMeta } = meta;
            await db.subscription.update({
              where: { id: sub.id },
              data: {
                previousPlanId: sub.planId,
                planId: newPlan.id,
                metadata: restMeta,
              },
            });
            this.logger.log(`Applied deferred plan change for subscription ${sub.id} to plan ${newPlan.id}`);
          }
        }
      }
    } catch (error) {
      this.logger.error(`Failed to process renewals for tenant ${tenantId}`, error);
      throw error;
    }
  }

  // ============================================================
  // Payment Reminders
  // ============================================================

  private async handlePaymentReminders(job: Job<{ tenantId: string }>): Promise<void> {
    const { tenantId } = job.data;
    this.logger.log(`Processing payment reminders for tenant ${tenantId}`);

    try {
      const db = await this.tenantDbService.getTenantClient(tenantId);
      const now = new Date();

      const tenant = await this.centralPrisma.client.tenant.findUnique({
        where: { id: tenantId },
        select: { name: true },
      });
      const tenantName = tenant?.name || 'Your billing provider';

      // Find all unpaid invoices (PENDING or FAILED)
      const unpaidInvoices = await db.invoice.findMany({
        where: {
          status: { in: ['PENDING', 'FAILED'] },
        },
        include: { customer: true },
      }) as Array<any>;

      let sentCount = 0;

      for (const invoice of unpaidInvoices) {
        if (!invoice.customer?.email || !invoice.dueDate) continue;

        const dueDateStr = invoice.dueDate.toISOString().split('T')[0];
        const msPerDay = 24 * 60 * 60 * 1000;
        const daysUntilDue = Math.round(
          (invoice.dueDate.getTime() - now.getTime()) / msPerDay,
        );

        const meta = (invoice.metadata as Record<string, unknown>) || {};
        const remindersSent = (meta.remindersSent as string[]) || [];

        let reminderKey: string | null = null;
        let template: string | null = null;
        let subject: string | null = null;

        if (daysUntilDue >= 2 && daysUntilDue <= 3 && !remindersSent.includes('upcoming')) {
          reminderKey = 'upcoming';
          template = 'payment-reminder-upcoming';
          subject = `Payment reminder: ${invoice.invoiceNumber} due ${dueDateStr} — ${tenantName}`;
        } else if (daysUntilDue >= 0 && daysUntilDue < 1 && !remindersSent.includes('due_today')) {
          reminderKey = 'due_today';
          template = 'payment-reminder-due-today';
          subject = `Payment due today: ${invoice.invoiceNumber} — ${tenantName}`;
        } else if (daysUntilDue <= -3 && daysUntilDue > -4 && !remindersSent.includes('overdue_3')) {
          reminderKey = 'overdue_3';
          template = 'payment-reminder-overdue';
          subject = `Overdue: ${invoice.invoiceNumber} was due ${dueDateStr} — ${tenantName}`;
        } else if (daysUntilDue <= -7 && daysUntilDue > -8 && !remindersSent.includes('overdue_7')) {
          reminderKey = 'overdue_7';
          template = 'payment-reminder-overdue';
          subject = `Overdue: ${invoice.invoiceNumber} was due ${dueDateStr} — ${tenantName}`;
        } else if (daysUntilDue <= -14 && daysUntilDue > -15 && !remindersSent.includes('overdue_14')) {
          reminderKey = 'overdue_14';
          template = 'payment-reminder-overdue';
          subject = `Final notice: ${invoice.invoiceNumber} is ${Math.abs(daysUntilDue)} days overdue — ${tenantName}`;
        }

        if (reminderKey && template && subject) {
          await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
            tenantId,
            to: invoice.customer.email,
            subject,
            template,
            context: {
              tenantName,
              customerName: invoice.customer.name || invoice.customer.email,
              invoiceId: invoice.invoiceNumber,
              amount: String(invoice.amount),
              currency: invoice.currency,
              dueDate: dueDateStr,
              daysOverdue: daysUntilDue < 0 ? String(Math.abs(daysUntilDue)) : '0',
              pdfUrl: invoice.pdfUrl || '',
            },
          });

          // Track which reminders have been sent
          await db.invoice.update({
            where: { id: invoice.id },
            data: {
              metadata: {
                ...meta,
                remindersSent: [...remindersSent, reminderKey],
              },
            },
          });

          sentCount++;
        }
      }

      if (sentCount > 0) {
        this.logger.log(`Sent ${sentCount} payment reminders for tenant ${tenantId}`);
      }
    } catch (error) {
      this.logger.error(`Failed to process payment reminders for tenant ${tenantId}`, error);
      throw error;
    }
  }

  // ============================================================
  // Usage Aggregation Helpers
  // ============================================================

  private aggregateEvents(
    events: Array<{ properties: any; timestamp: Date }>,
    aggregationType: string,
    fieldName?: string | null,
  ): number {
    if (events.length === 0) return 0;

    switch (aggregationType) {
      case 'COUNT':
        return events.length;

      case 'SUM':
        return events.reduce((sum, e) => {
          const val = Number(e.properties?.[fieldName!]) || 0;
          return sum + val;
        }, 0);

      case 'MAX':
        return Math.max(
          ...events.map((e) => Number(e.properties?.[fieldName!]) || 0),
        );

      case 'UNIQUE_COUNT': {
        const uniqueValues = new Set(
          events.map((e) => String(e.properties?.[fieldName!] ?? '')),
        );
        return uniqueValues.size;
      }

      case 'LATEST':
        return Number(events[0].properties?.[fieldName!]) || 0;

      case 'WEIGHTED_SUM':
        return events.reduce((sum, e) => {
          const val = Number(e.properties?.[fieldName!]) || 0;
          const weight = Number(e.properties?.['weight']) || 1;
          return sum + val * weight;
        }, 0);

      default:
        return 0;
    }
  }

  private calculateChargeCost(
    chargeModel: string,
    units: number,
    properties: Record<string, any>,
    graduatedRanges?: Array<{ fromValue: number; toValue: number | null; perUnitAmount: any; flatAmount: any }>,
  ): number {
    switch (chargeModel) {
      case 'STANDARD': {
        const amount = Number(properties.amount) || 0;
        return units * amount;
      }

      case 'GRADUATED': {
        if (!graduatedRanges || graduatedRanges.length === 0) return 0;
        let total = 0;
        let remaining = units;

        for (const range of graduatedRanges) {
          if (remaining <= 0) break;
          const rangeSize = range.toValue !== null
            ? range.toValue - range.fromValue + 1
            : remaining;
          const unitsInRange = Math.min(remaining, rangeSize);
          total += unitsInRange * Number(range.perUnitAmount);
          total += Number(range.flatAmount) || 0;
          remaining -= unitsInRange;
        }
        return total;
      }

      case 'VOLUME': {
        if (!graduatedRanges || graduatedRanges.length === 0) return 0;
        for (const range of graduatedRanges) {
          const inRange = range.toValue === null
            ? units >= range.fromValue
            : units >= range.fromValue && units <= range.toValue;
          if (inRange) {
            return units * Number(range.perUnitAmount) + (Number(range.flatAmount) || 0);
          }
        }
        return 0;
      }

      case 'PACKAGE': {
        const packageSize = Number(properties.packageSize) || 1;
        const amount = Number(properties.amount) || 0;
        return Math.ceil(units / packageSize) * amount;
      }

      case 'PERCENTAGE': {
        const rate = Number(properties.rate) || 0;
        const fixedAmount = Number(properties.fixedAmount) || 0;
        const freeUnits = Number(properties.freeUnitsPerTotalAggregation) || 0;
        const billableUnits = Math.max(0, units - freeUnits);
        return billableUnits * (rate / 100) + (billableUnits > 0 ? fixedAmount : 0);
      }

      default:
        return 0;
    }
  }

  // ============================================================
  // Grace Period: Finalize Draft Invoices
  // ============================================================

  private async handleFinalizeDraftInvoices(job: Job<{ tenantId: string }>): Promise<void> {
    const { tenantId } = job.data;
    this.logger.log(`Checking draft invoices for finalization (tenant ${tenantId})`);

    try {
      const db = await this.tenantDbService.getTenantClient(tenantId);
      const now = new Date();

      // Find DRAFT invoices whose grace period has ended
      const draftInvoices = await db.invoice.findMany({
        where: { status: 'DRAFT' as any },
        include: {
          customer: true,
          subscription: true,
        },
      });

      let finalizedCount = 0;
      for (const invoice of draftInvoices) {
        const meta = (invoice.metadata as any) || {};
        const gracePeriodEndsAt = meta.gracePeriodEndsAt ? new Date(meta.gracePeriodEndsAt) : null;

        if (!gracePeriodEndsAt || gracePeriodEndsAt > now) continue;

        // Finalize: transition DRAFT → PENDING
        await db.invoice.update({
          where: { id: invoice.id },
          data: { status: 'PENDING' },
        });

        // Fetch tenant info for email
        const tenant = await this.centralPrisma.client.tenant.findUnique({
          where: { id: tenantId },
          select: { name: true },
        });
        const tenantName = tenant?.name || 'Your billing provider';

        // Send invoice email
        if (invoice.customer?.email) {
          await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
            tenantId,
            to: invoice.customer.email,
            subject: `Invoice ${invoice.invoiceNumber} from ${tenantName}`,
            template: 'invoice',
            context: {
              tenantName,
              customerName: invoice.customer.name || invoice.customer.email,
              invoiceId: invoice.invoiceNumber,
              amount: String(invoice.amount),
              currency: invoice.currency,
              dueDate: invoice.dueDate?.toISOString().split('T')[0] || '',
              pdfUrl: (invoice as any).pdfUrl || '',
            },
          });
        }

        // Send webhook
        await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
          tenantId,
          event: 'invoice.finalized',
          payload: {
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            customerId: invoice.customerId,
            amount: Number(invoice.amount),
            currency: invoice.currency,
          },
        });

        // Auto-charge if payment method available
        const paymentMethodId = (invoice.subscription as any)?.paymentMethodId as string | null;
        if (Number(invoice.amount) > 0 && paymentMethodId && invoice.subscriptionId) {
          await this.paymentQueue.add(PaymentJobType.AUTO_CHARGE_PAYMENT_METHOD, {
            tenantId,
            invoiceId: invoice.id,
            subscriptionId: invoice.subscriptionId,
            paymentMethodId,
          });
        }

        finalizedCount++;
      }

      if (finalizedCount > 0) {
        this.logger.log(`Finalized ${finalizedCount} draft invoices for tenant ${tenantId}`);
      }
    } catch (error) {
      this.logger.error(`Failed to finalize draft invoices for tenant ${tenantId}`, error);
      throw error;
    }
  }

  // ============================================================
  // Progressive Billing: Threshold-based mid-cycle invoicing
  // ============================================================

  private async handleCheckProgressiveBilling(job: Job<{ tenantId: string; subscriptionId: string }>): Promise<void> {
    const { tenantId, subscriptionId } = job.data;

    try {
      const db = await this.tenantDbService.getTenantClient(tenantId);

      const subscription = await (db as any).subscription.findUnique({
        where: { id: subscriptionId },
        include: {
          plan: { include: { charges: { include: { billableMetric: true, graduatedRanges: { orderBy: { order: 'asc' } } } } } },
        },
      });

      if (!subscription || subscription.status !== 'ACTIVE') return;

      const threshold = Number(subscription.plan?.progressiveBillingThreshold);
      if (!threshold || threshold <= 0) return;

      // Calculate usage cost since last progressive billing or period start
      const sinceDate = subscription.lastProgressiveBillingAt || subscription.currentPeriodStart;
      const charges = subscription.plan.charges || [];
      let usageCost = 0;

      for (const charge of charges) {
        const events = await (db as any).usageEvent.findMany({
          where: {
            subscriptionId,
            code: charge.billableMetric.code,
            timestamp: { gte: sinceDate, lt: new Date() },
          },
          orderBy: { timestamp: 'desc' },
        });

        const units = this.aggregateEvents(
          events,
          charge.billableMetric.aggregationType,
          charge.billableMetric.fieldName,
        );

        if (units > 0) {
          usageCost += this.calculateChargeCost(
            charge.chargeModel,
            units,
            (charge.properties as Record<string, any>) || {},
            charge.graduatedRanges,
          );
        }
      }

      if (usageCost >= threshold) {
        this.logger.log(
          `Progressive billing triggered for subscription ${subscriptionId}: usage ${usageCost} >= threshold ${threshold}`,
        );

        // Update lastProgressiveBillingAt
        await db.subscription.update({
          where: { id: subscriptionId },
          data: { lastProgressiveBillingAt: new Date() } as any,
        });

        // Queue invoice generation with progressive flag
        await this.billingQueue.add(BillingJobType.GENERATE_INVOICE, {
          tenantId,
          subscriptionId,
          customerId: subscription.customerId,
          progressive: true,
        } as GenerateInvoiceData);
      }
    } catch (error) {
      this.logger.error(`Failed to check progressive billing for subscription ${subscriptionId}`, error);
    }
  }
}
