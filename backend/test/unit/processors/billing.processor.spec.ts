import { Prisma } from '../../../src/generated/prisma-tenant/client';
import { BillingProcessor } from '../../../src/queues/processors/billing.processor';
import { BillingJobType } from '../../../src/queues/billing.queue';
import { createMockPrisma } from '../../helpers/mock-prisma';
import { createMockQueue } from '../../helpers/mock-queue';
import { makeCustomer, makePlan, makePlanPrice } from '../../helpers/fixtures';

const iso = (s: string) => new Date(s).toISOString();

describe('BillingProcessor', () => {
  let processor: BillingProcessor;
  let db: ReturnType<typeof createMockPrisma> & { $queryRaw: jest.Mock };
  let billingQueue: ReturnType<typeof createMockQueue>;
  let webhookQueue: ReturnType<typeof createMockQueue>;
  let emailQueue: ReturnType<typeof createMockQueue>;
  let paymentQueue: ReturnType<typeof createMockQueue>;
  let walletsService: { applyToInvoice: jest.Mock };
  let taxesService: { resolveTaxes: jest.Mock };
  let planOverrides: { resolvePrice: jest.Mock; resolveChargeProperties: jest.Mock; resolveMinimumCommitment: jest.Mock };
  let usageUnits: number;
  let invoiceSeq: number;

  const job = (name: string, data: Record<string, unknown>) => ({ name, data, attemptsMade: 0 }) as any;

  beforeEach(() => {
    db = createMockPrisma() as any;
    usageUnits = 0;
    invoiceSeq = 41;
    // Raw SQL: the invoice counter (tagged template) and usage aggregation (Prisma.sql).
    db.$queryRaw = jest.fn(async (query: unknown) => {
      const text = Array.isArray(query) ? query.join('?') : (query as Prisma.Sql).sql;
      if (text.includes('"Sequence"')) return [{ value: ++invoiceSeq }];
      if (text.includes('"UsageEvent"')) return [{ v: String(usageUnits) }];
      return [];
    });
    db.$transaction.mockImplementation((fn: (tx: unknown) => unknown) => fn(db));

    billingQueue = createMockQueue();
    webhookQueue = createMockQueue();
    emailQueue = createMockQueue();
    paymentQueue = createMockQueue();
    walletsService = { applyToInvoice: jest.fn().mockResolvedValue(0) };
    taxesService = { resolveTaxes: jest.fn().mockResolvedValue([]) };
    planOverrides = {
      resolvePrice: jest.fn().mockResolvedValue(null),
      resolveChargeProperties: jest.fn().mockResolvedValue(null),
      resolveMinimumCommitment: jest.fn().mockResolvedValue(null),
    };

    processor = new BillingProcessor(
      {
        client: {
          databaseConnection: { findMany: jest.fn().mockResolvedValue([]) },
          tenant: { findUnique: jest.fn().mockResolvedValue({ name: 'Acme', email: 'billing@acme.com', settings: {} }) },
        },
      } as any,
      { getTenantClient: jest.fn().mockResolvedValue(db) } as any,
      {
        generateInvoicePDF: jest.fn().mockResolvedValue(Buffer.from('pdf')),
        savePdf: jest.fn().mockResolvedValue(undefined),
        getPublicUrl: jest.fn().mockReturnValue('/api/invoices/inv_new/pdf'),
      } as any,
      walletsService as any,
      taxesService as any,
      planOverrides as any,
      billingQueue as any,
      webhookQueue as any,
      emailQueue as any,
      paymentQueue as any,
    );
  });

  // ============================================================
  // Renewal
  // ============================================================

  describe('renewal', () => {
    const start = new Date('2026-01-31T00:00:00Z');
    const end = new Date('2026-02-28T00:00:00Z');
    const sub = (overrides: Record<string, unknown> = {}) => ({
      id: 'sub_1',
      customerId: 'cust_1',
      planId: 'plan_1',
      status: 'ACTIVE',
      currency: 'USD',
      billingTiming: 'IN_ARREARS',
      currentPeriodStart: start,
      currentPeriodEnd: end,
      billingAnchor: start,
      cancelAt: null,
      metadata: null,
      plan: makePlan({ billingInterval: 'MONTHLY', billingTiming: 'IN_ARREARS' }),
      ...overrides,
    });

    beforeEach(() => {
      jest.useFakeTimers({ now: new Date('2026-02-28T03:00:00Z'), doNotFake: ['nextTick', 'setImmediate'] });
      db.subscription.findMany.mockImplementation(async (args: any) => (args.where.status === 'ACTIVE' ? [sub()] : []));
      db.subscription.updateMany.mockResolvedValue({ count: 1 });
    });
    afterEach(() => jest.useRealTimers());

    it('closes the ended period once and bills its usage and in-arrears price, keyed on the period end', async () => {
      await processor.process(job(BillingJobType.SUBSCRIPTION_RENEWAL, { tenantId: 't1' }));

      expect(db.subscription.updateMany).toHaveBeenCalledWith({
        where: { id: 'sub_1', status: 'ACTIVE', currentPeriodEnd: end },
        data: expect.objectContaining({
          currentPeriodStart: end,
          // Anchored on the 31st: March 31, not March 28.
          currentPeriodEnd: new Date('2026-03-31T00:00:00Z'),
        }),
      });
      const [name, data, opts] = billingQueue.add.mock.calls[0];
      expect(name).toBe(BillingJobType.GENERATE_INVOICE);
      expect(data).toMatchObject({
        kind: 'renewal',
        billingKey: `sub_1|renewal|${end.toISOString()}`,
        bases: [{ planId: 'plan_1', periodStart: start.toISOString(), periodEnd: end.toISOString() }],
        usage: { planId: 'plan_1', periodStart: start.toISOString(), from: start.toISOString(), to: end.toISOString() },
      });
      expect(opts.jobId).not.toContain(':');
    });

    it('bills an in-advance price for the next period instead', async () => {
      db.subscription.findMany.mockImplementation(async (args: any) =>
        args.where.status === 'ACTIVE' ? [sub({ billingTiming: 'IN_ADVANCE', plan: makePlan({ billingTiming: 'IN_ADVANCE' }) })] : [],
      );
      await processor.process(job(BillingJobType.SUBSCRIPTION_RENEWAL, { tenantId: 't1' }));
      expect(billingQueue.add.mock.calls[0][1].bases).toEqual([
        { planId: 'plan_1', periodStart: end.toISOString(), periodEnd: iso('2026-03-31T00:00:00Z') },
      ]);
    });

    it('applies a scheduled plan change at the boundary', async () => {
      db.subscription.findMany.mockImplementation(async (args: any) =>
        args.where.status === 'ACTIVE' ? [sub({ metadata: { pendingPlanChange: { newPlanId: 'plan_small' }, note: 'kept' } })] : [],
      );
      db.plan.findUnique.mockResolvedValue(makePlan({ id: 'plan_small', billingInterval: 'MONTHLY', billingTiming: 'IN_ADVANCE' }));

      await processor.process(job(BillingJobType.SUBSCRIPTION_RENEWAL, { tenantId: 't1' }));

      const update = db.subscription.updateMany.mock.calls[0][0];
      expect(update.data).toMatchObject({ planId: 'plan_small', previousPlanId: 'plan_1', billingTiming: 'IN_ADVANCE', metadata: { note: 'kept' } });
      const data = billingQueue.add.mock.calls[0][1];
      // Usage and arrears price of the old plan for the old period; advance price of the new plan for the new one.
      expect(data.usage.planId).toBe('plan_1');
      expect(data.bases.map((b: any) => b.planId)).toEqual(['plan_1', 'plan_small']);
      expect(webhookQueue.add).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ event: 'subscription.plan_changed' }));
    });

    it('does nothing when another run already closed the period', async () => {
      db.subscription.updateMany.mockResolvedValue({ count: 0 });
      await processor.process(job(BillingJobType.SUBSCRIPTION_RENEWAL, { tenantId: 't1' }));
      expect(billingQueue.add).not.toHaveBeenCalled();
    });

    it('ends a subscription canceled at period end with a final invoice and no next period', async () => {
      db.subscription.findMany.mockImplementation(async (args: any) =>
        args.where.status === 'ACTIVE' ? [sub({ cancelAt: end })] : [],
      );
      await processor.process(job(BillingJobType.SUBSCRIPTION_RENEWAL, { tenantId: 't1' }));
      expect(db.subscription.updateMany.mock.calls[0][0].data).toMatchObject({ status: 'CANCELED', canceledAt: end });
      expect(billingQueue.add.mock.calls[0][1]).toMatchObject({ kind: 'cancellation', usage: { to: end.toISOString() } });
      expect(billingQueue.add).toHaveBeenCalledTimes(1);
    });

    it('catches up on several missed hourly periods, one invoice each', async () => {
      const hStart = new Date('2026-02-28T00:00:00Z');
      db.subscription.findMany.mockImplementation(async (args: any) =>
        args.where.status === 'ACTIVE'
          ? [sub({ currentPeriodStart: hStart, currentPeriodEnd: new Date('2026-02-28T01:00:00Z'), billingAnchor: hStart, plan: makePlan({ billingInterval: 'HOURLY' }) })]
          : [],
      );
      await processor.process(job(BillingJobType.SUBSCRIPTION_RENEWAL, { tenantId: 't1' }));
      // Periods ending 01:00, 02:00 and 03:00 have all ended at 03:00.
      expect(billingQueue.add.mock.calls.map((c: any[]) => c[1].billingKey)).toEqual([
        'sub_1|renewal|2026-02-28T01:00:00.000Z',
        'sub_1|renewal|2026-02-28T02:00:00.000Z',
        'sub_1|renewal|2026-02-28T03:00:00.000Z',
      ]);
    });
  });

  // ============================================================
  // Invoice generation
  // ============================================================

  describe('invoice generation', () => {
    const periodStart = '2026-01-01T00:00:00.000Z';
    const periodEnd = '2026-02-01T00:00:00.000Z';
    const data = (overrides: Record<string, unknown> = {}) => ({
      tenantId: 't1',
      subscriptionId: 'sub_1',
      customerId: 'cust_1',
      kind: 'renewal',
      billingKey: `sub_1|renewal|${periodEnd}`,
      bases: [{ planId: 'plan_1', periodStart, periodEnd }],
      ...overrides,
    });

    beforeEach(() => {
      db.subscription.findUnique.mockResolvedValue({
        id: 'sub_1',
        planId: 'plan_1',
        currency: 'USD',
        currentPeriodStart: new Date(periodEnd),
        currentPeriodEnd: new Date('2026-03-01T00:00:00Z'),
      });
      db.customer.findUnique.mockResolvedValue(makeCustomer());
      db.plan.findUnique.mockResolvedValue({ ...makePlan(), prices: [makePlanPrice({ amount: '49.00' })] });
      db.invoice.findUnique.mockImplementation(async (args: any) => (args.where.billingKey ? null : null));
      db.invoice.findMany.mockResolvedValue([]);
      db.appliedCoupon.findMany.mockResolvedValue([]);
      db.appliedAddOn.findMany.mockResolvedValue([]);
      db.charge.findMany.mockResolvedValue([]);
      db.invoice.create.mockImplementation(async (args: any) => ({ id: 'inv_new', ...args.data }));
      db.invoice.findUniqueOrThrow.mockImplementation(async () => ({
        ...db.invoice.create.mock.calls[0][0].data,
        id: 'inv_new',
        createdAt: new Date(),
        customer: makeCustomer(),
        subscription: { paymentMethodId: 'pm_1' },
      }));
      db.invoice.update.mockImplementation(async (args: any) => ({
        ...db.invoice.create.mock.calls[0][0].data,
        ...args.data,
        id: 'inv_new',
        createdAt: new Date(),
        customer: makeCustomer(),
        subscription: { paymentMethodId: 'pm_1' },
      }));
      db.subscription.update.mockResolvedValue({});
    });

    const created = () => db.invoice.create.mock.calls[0][0].data;

    it('creates one invoice per billing key, numbered from the atomic counter', async () => {
      await processor.process(job(BillingJobType.GENERATE_INVOICE, data()));
      expect(created()).toMatchObject({
        invoiceNumber: 'INV-00042',
        billingKey: `sub_1|renewal|${periodEnd}`,
        kind: 'renewal',
        status: 'PENDING',
      });
      expect(created().amount.toString()).toBe('49');
      expect(paymentQueue.add).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.objectContaining({ jobId: 'charge-inv_new' }));
    });

    it('does not create a second invoice for a key that exists', async () => {
      db.invoice.findUnique.mockImplementation(async (args: any) =>
        args.where.billingKey ? { id: 'inv_old', metadata: { postProcessed: true } } : null,
      );
      await processor.process(job(BillingJobType.GENERATE_INVOICE, data()));
      expect(db.invoice.create).not.toHaveBeenCalled();
    });

    it('treats a unique-key race with another worker as done', async () => {
      db.invoice.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('dup', { code: 'P2002', clientVersion: 'x', meta: { target: ['billingKey'] } }),
      );
      await expect(processor.process(job(BillingJobType.GENERATE_INVOICE, data()))).resolves.toBeUndefined();
    });

    it('bills usage aggregated in the database for the period that ended', async () => {
      usageUnits = 1500;
      db.charge.findMany.mockResolvedValue([
        {
          id: 'ch_1',
          chargeModel: 'STANDARD',
          properties: { amount: '0.01' },
          billableMetric: { code: 'api_calls', name: 'API calls', aggregationType: 'COUNT', fieldName: null },
          graduatedRanges: [],
          minAmountCents: null,
          invoiceDisplayName: null,
        },
      ]);
      await processor.process(job(BillingJobType.GENERATE_INVOICE, data({ usage: { planId: 'plan_1', periodStart, from: periodStart, to: periodEnd } })));

      const usageQuery = db.$queryRaw.mock.calls.find((c: any[]) => !Array.isArray(c[0]) && c[0].sql.includes('"UsageEvent"'))[0];
      expect(usageQuery.values).toEqual(expect.arrayContaining(['sub_1', 'api_calls', new Date(periodStart), new Date(periodEnd)]));
      expect(created().amount.toString()).toBe('64'); // 49 + 1500 × 0.01
      expect(created().metadata.usageByCharge).toEqual({ ch_1: '15' });
    });

    it('subtracts usage already billed by progressive invoices in the same period', async () => {
      usageUnits = 1500;
      db.charge.findMany.mockResolvedValue([
        { id: 'ch_1', chargeModel: 'STANDARD', properties: { amount: '0.01' }, billableMetric: { code: 'c', name: 'C', aggregationType: 'COUNT', fieldName: null }, graduatedRanges: [], minAmountCents: null, invoiceDisplayName: null },
      ]);
      db.invoice.findMany.mockResolvedValue([{ metadata: { usageByCharge: { ch_1: '10' } } }]);
      await processor.process(job(BillingJobType.GENERATE_INVOICE, data({ bases: [], usage: { planId: 'plan_1', periodStart, from: periodStart, to: periodEnd } })));
      expect(created().amount.toString()).toBe('5');
    });

    it('applies coupons and taxes in decimal, claiming coupon uses atomically', async () => {
      db.appliedCoupon.findMany.mockResolvedValue([
        { id: 'ac_1', usesRemaining: 2, coupon: { code: 'TEN', isActive: true, expiresAt: null, discountType: 'PERCENTAGE', discountValue: '10', currency: null, appliesToPlanIds: [] } },
      ]);
      db.appliedCoupon.updateMany.mockResolvedValue({ count: 1 });
      taxesService.resolveTaxes.mockResolvedValue([{ name: 'VAT', rate: '16' }]);

      await processor.process(job(BillingJobType.GENERATE_INVOICE, data()));

      expect(db.appliedCoupon.updateMany).toHaveBeenCalledWith({ where: { id: 'ac_1', usesRemaining: 2 }, data: { usesRemaining: 1 } });
      // 49 − 4.90 = 44.10; VAT 16% = 7.056 → 7.06; total 51.16
      expect(created().amount.toString()).toBe('51.16');
      expect(created().metadata.taxAmount).toBe('7.06');
    });

    it('keeps the grace period and tax total when wallet credits are applied to a draft', async () => {
      db.plan.findUnique.mockResolvedValue({ ...makePlan({ invoiceGracePeriodDays: 3 }), prices: [makePlanPrice({ amount: '49.00' })] });
      walletsService.applyToInvoice.mockResolvedValue(20);

      await processor.process(job(BillingJobType.GENERATE_INVOICE, data()));

      expect(created().status).toBe('DRAFT');
      const walletUpdate = db.invoice.update.mock.calls.find((c: any[]) => c[0].data.prepaidCreditAmount !== undefined || c[0].data.metadata?.prepaidCreditAmount);
      expect(walletUpdate[0].data.amount.toString()).toBe('29');
      expect(walletUpdate[0].data.metadata.gracePeriodEndsAt).toBeDefined();
      expect(walletUpdate[0].data.metadata.taxAmount).toBe('0');
      // Drafts are not emailed or charged until finalized.
      expect(paymentQueue.add).not.toHaveBeenCalled();
    });

    it('creates nothing when there is nothing to bill', async () => {
      await processor.process(job(BillingJobType.GENERATE_INVOICE, data({ bases: [], usage: { planId: 'plan_1', periodStart, from: periodStart, to: periodEnd } })));
      expect(db.invoice.create).not.toHaveBeenCalled();
    });
  });

  // ============================================================
  // Drafts and progressive billing
  // ============================================================

  it('finalizes a draft past its grace period exactly once', async () => {
    db.invoice.findMany.mockResolvedValue([
      {
        id: 'inv_d',
        invoiceNumber: 'INV-00007',
        status: 'DRAFT',
        amount: '10',
        currency: 'USD',
        dueDate: new Date(),
        createdAt: new Date(),
        customerId: 'cust_1',
        subscriptionId: 'sub_1',
        metadata: { gracePeriodEndsAt: '2020-01-01T00:00:00Z' },
        customer: makeCustomer(),
        subscription: { paymentMethodId: 'pm_1' },
      },
    ]);
    db.invoice.updateMany.mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 0 });

    await processor.process(job(BillingJobType.FINALIZE_DRAFT_INVOICES, { tenantId: 't1' }));
    await processor.process(job(BillingJobType.FINALIZE_DRAFT_INVOICES, { tenantId: 't1' }));

    expect(db.invoice.updateMany).toHaveBeenCalledWith({ where: { id: 'inv_d', status: 'DRAFT' }, data: { status: 'PENDING' } });
    expect(webhookQueue.add.mock.calls.filter((c: any[]) => c[1].event === 'invoice.finalized')).toHaveLength(1);
  });

  it('queues a progressive invoice only for usage not yet billed this period', async () => {
    db.subscription.findUnique.mockResolvedValue({
      id: 'sub_1',
      status: 'ACTIVE',
      planId: 'plan_1',
      customerId: 'cust_1',
      currency: 'USD',
      currentPeriodStart: new Date('2026-01-01T00:00:00Z'),
      plan: makePlan({ progressiveBillingThreshold: '100' }),
    });
    db.charge.findMany.mockResolvedValue([
      { id: 'ch_1', chargeModel: 'STANDARD', properties: { amount: '1' }, billableMetric: { code: 'c', name: 'C', aggregationType: 'COUNT', fieldName: null }, graduatedRanges: [], minAmountCents: null, invoiceDisplayName: null },
    ]);
    usageUnits = 150;
    db.invoice.findMany.mockResolvedValue([{ metadata: { usageByCharge: { ch_1: '100' } } }]);

    await processor.process(job(BillingJobType.CHECK_PROGRESSIVE_BILLING, { tenantId: 't1', subscriptionId: 'sub_1' }));
    // 150 used, 100 already billed: 50 is under the threshold.
    expect(billingQueue.add).not.toHaveBeenCalled();

    usageUnits = 250;
    await processor.process(job(BillingJobType.CHECK_PROGRESSIVE_BILLING, { tenantId: 't1', subscriptionId: 'sub_1' }));
    expect(billingQueue.add.mock.calls[0][1]).toMatchObject({ kind: 'progressive', usage: { periodStart: iso('2026-01-01T00:00:00Z') } });
  });
});
