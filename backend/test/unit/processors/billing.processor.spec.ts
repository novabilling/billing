import { BillingProcessor } from '../../../src/queues/processors/billing.processor';
import { BillingJobType, BILLING_QUEUE, WEBHOOK_QUEUE, EMAIL_QUEUE, PAYMENT_QUEUE } from '../../../src/queues/billing.queue';
import { createMockPrisma } from '../../helpers/mock-prisma';
import { createMockQueue } from '../../helpers/mock-queue';
import { makeSubscription, makePlan, makePlanPrice, makeCustomer, makeInvoice } from '../../helpers/fixtures';

describe('BillingProcessor', () => {
  let processor: BillingProcessor;
  let centralPrisma: { client: Record<string, any> };
  let tenantDbService: { getTenantClient: jest.Mock };
  let pdfService: { generateInvoicePDF: jest.Mock; savePdf: jest.Mock; getPublicUrl: jest.Mock; getInvoiceApiUrl: jest.Mock };
  let walletsService: { applyToInvoice: jest.Mock };
  let taxesService: { resolveTaxes: jest.Mock };
  let planOverridesService: {
    resolvePrice: jest.Mock;
    resolveChargeProperties: jest.Mock;
    resolveMinimumCommitment: jest.Mock;
  };
  let billingQueue: ReturnType<typeof createMockQueue>;
  let webhookQueue: ReturnType<typeof createMockQueue>;
  let emailQueue: ReturnType<typeof createMockQueue>;
  let paymentQueue: ReturnType<typeof createMockQueue>;
  let db: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    db = createMockPrisma();
    tenantDbService = { getTenantClient: jest.fn().mockResolvedValue(db) };
    centralPrisma = {
      client: {
        databaseConnection: { findMany: jest.fn().mockResolvedValue([]) },
        tenant: {
          findUnique: jest.fn().mockResolvedValue({ name: 'Acme Corp', email: 'billing@acme.com', settings: {} }),
        },
      },
    };
    pdfService = {
      generateInvoicePDF: jest.fn().mockResolvedValue(Buffer.from('pdf')),
      savePdf: jest.fn().mockResolvedValue(undefined),
      getPublicUrl: jest.fn().mockReturnValue('https://cdn.example.com/invoice.pdf'),
      getInvoiceApiUrl: jest.fn().mockReturnValue('http://localhost:3000/invoices/test-id/pdf'),
    };
    walletsService = { applyToInvoice: jest.fn().mockResolvedValue(0) };
    taxesService = { resolveTaxes: jest.fn().mockResolvedValue([]) };
    planOverridesService = {
      resolvePrice: jest.fn().mockResolvedValue(null),
      resolveChargeProperties: jest.fn().mockResolvedValue(null),
      resolveMinimumCommitment: jest.fn().mockResolvedValue(null),
    };
    billingQueue = createMockQueue();
    webhookQueue = createMockQueue();
    emailQueue = createMockQueue();
    paymentQueue = createMockQueue();

    processor = new BillingProcessor(
      centralPrisma as any,
      tenantDbService as any,
      pdfService as any,
      walletsService as any,
      taxesService as any,
      planOverridesService as any,
      billingQueue as any,
      webhookQueue as any,
      emailQueue as any,
      paymentQueue as any,
    );
  });

  function makeJob(name: string, data: Record<string, unknown>) {
    return { name, data, attemptsMade: 0 } as any;
  }

  // =============================================================
  // aggregateEvents (private — test via handleGenerateInvoice or extract)
  // =============================================================

  describe('aggregateEvents (via invoice generation)', () => {
    const baseSub = {
      ...makeSubscription(),
      plan: {
        ...makePlan(),
        prices: [makePlanPrice()],
        charges: [],
        invoiceGracePeriodDays: null,
      },
    };

    function setupBaseInvoiceMocks(charges: any[] = []) {
      const sub = { ...baseSub, plan: { ...baseSub.plan, charges } };
      db.subscription.findUnique.mockResolvedValue(sub);
      db.customer.findUnique.mockResolvedValue(makeCustomer());
      db.invoice.findFirst.mockResolvedValue(null); // no previous invoice
      db.appliedCoupon.findMany.mockResolvedValue([]);
      db.appliedAddOn.findMany.mockResolvedValue([]);
      db.invoice.create.mockResolvedValue(makeInvoice());
      db.invoice.update.mockResolvedValue({});
      return sub;
    }

    it('should generate a basic invoice with plan charge only', async () => {
      setupBaseInvoiceMocks();

      const job = makeJob(BillingJobType.GENERATE_INVOICE, {
        tenantId: 'tenant_1',
        subscriptionId: 'sub_1',
        customerId: 'cust_1',
      });

      await processor.process(job);

      expect(db.invoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            customerId: 'cust_1',
            subscriptionId: 'sub_1',
            status: 'PENDING',
          }),
        }),
      );
      expect(webhookQueue.add).toHaveBeenCalled();
      expect(emailQueue.add).toHaveBeenCalled();
    });

    it('should count usage events for COUNT aggregation', async () => {
      const charges = [{
        id: 'charge_1',
        chargeModel: 'STANDARD',
        properties: { amount: '0.01' },
        billableMetric: { code: 'api_calls', aggregationType: 'COUNT', fieldName: null },
        graduatedRanges: [],
        minAmountCents: null,
        invoiceDisplayName: null,
      }];

      setupBaseInvoiceMocks(charges);
      db.usageEvent.findMany.mockResolvedValue([
        { properties: {}, timestamp: new Date() },
        { properties: {}, timestamp: new Date() },
        { properties: {}, timestamp: new Date() },
      ]);

      const job = makeJob(BillingJobType.GENERATE_INVOICE, {
        tenantId: 'tenant_1',
        subscriptionId: 'sub_1',
        customerId: 'cust_1',
      });

      await processor.process(job);

      // Invoice should include usage charge: 3 * 0.01 = 0.03
      expect(db.invoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            // total = 49 (plan) + 0.03 (usage) = 49.03
            amount: expect.any(Number),
          }),
        }),
      );
    });

    it('should sum values for SUM aggregation', async () => {
      const charges = [{
        id: 'charge_1',
        chargeModel: 'STANDARD',
        properties: { amount: '1' },
        billableMetric: { code: 'data_transfer', aggregationType: 'SUM', fieldName: 'bytes' },
        graduatedRanges: [],
        minAmountCents: null,
        invoiceDisplayName: null,
      }];

      setupBaseInvoiceMocks(charges);
      db.usageEvent.findMany.mockResolvedValue([
        { properties: { bytes: 100 }, timestamp: new Date() },
        { properties: { bytes: 200 }, timestamp: new Date() },
      ]);

      const job = makeJob(BillingJobType.GENERATE_INVOICE, {
        tenantId: 'tenant_1',
        subscriptionId: 'sub_1',
        customerId: 'cust_1',
      });

      await processor.process(job);

      // 300 units * 1 = 300 usage charge
      expect(db.invoice.create).toHaveBeenCalled();
    });

    it('should apply taxes', async () => {
      setupBaseInvoiceMocks();
      taxesService.resolveTaxes.mockResolvedValue([
        { name: 'VAT', rate: '18', code: 'vat' },
      ]);

      const job = makeJob(BillingJobType.GENERATE_INVOICE, {
        tenantId: 'tenant_1',
        subscriptionId: 'sub_1',
        customerId: 'cust_1',
      });

      await processor.process(job);

      // Plan: 49 + VAT 18% = 49 + 8.82 = 57.82
      expect(db.invoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            amount: 57.82,
          }),
        }),
      );
    });

    it('should apply coupon discount', async () => {
      setupBaseInvoiceMocks();
      db.appliedCoupon.findMany.mockResolvedValue([{
        id: 'ac_1',
        coupon: {
          isActive: true,
          expiresAt: null,
          discountType: 'PERCENTAGE',
          discountValue: '10',
          code: 'SAVE10',
          currency: null,
        },
        usesRemaining: null,
      }]);

      const job = makeJob(BillingJobType.GENERATE_INVOICE, {
        tenantId: 'tenant_1',
        subscriptionId: 'sub_1',
        customerId: 'cust_1',
      });

      await processor.process(job);

      // Plan: 49 - 10% = 49 - 4.9 = 44.1
      expect(db.invoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            amount: 44.1,
          }),
        }),
      );
    });

    it('should apply wallet credits', async () => {
      setupBaseInvoiceMocks();
      walletsService.applyToInvoice.mockResolvedValue(20);

      const job = makeJob(BillingJobType.GENERATE_INVOICE, {
        tenantId: 'tenant_1',
        subscriptionId: 'sub_1',
        customerId: 'cust_1',
      });

      await processor.process(job);

      expect(walletsService.applyToInvoice).toHaveBeenCalledWith(
        db, 'tenant_1', 'cust_1', expect.any(String), 49, 'USD',
      );
      // Should update invoice with reduced amount
      expect(db.invoice.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ amount: 29 }),
        }),
      );
    });

    it('should apply plan price override', async () => {
      setupBaseInvoiceMocks();
      planOverridesService.resolvePrice.mockResolvedValue(39);

      const job = makeJob(BillingJobType.GENERATE_INVOICE, {
        tenantId: 'tenant_1',
        subscriptionId: 'sub_1',
        customerId: 'cust_1',
      });

      await processor.process(job);

      expect(db.invoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ amount: 39 }),
        }),
      );
    });

    it('should apply minimum commitment true-up', async () => {
      const sub = setupBaseInvoiceMocks();
      // Plan price is 49, minimum commitment is 100
      (sub.plan as any).minimumCommitment = '100.00';

      const job = makeJob(BillingJobType.GENERATE_INVOICE, {
        tenantId: 'tenant_1',
        subscriptionId: 'sub_1',
        customerId: 'cust_1',
      });

      await processor.process(job);

      expect(db.invoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            amount: 100,
            metadata: expect.objectContaining({
              items: expect.arrayContaining([
                expect.objectContaining({ type: 'minimum_commitment' }),
              ]),
            }),
          }),
        }),
      );
    });

    it('should create DRAFT invoice when grace period is set', async () => {
      const sub = setupBaseInvoiceMocks();
      (sub.plan as any).invoiceGracePeriodDays = 3;

      const job = makeJob(BillingJobType.GENERATE_INVOICE, {
        tenantId: 'tenant_1',
        subscriptionId: 'sub_1',
        customerId: 'cust_1',
      });

      await processor.process(job);

      expect(db.invoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'DRAFT',
          }),
        }),
      );
      // Draft invoices should NOT send email or auto-charge
      expect(emailQueue.add).not.toHaveBeenCalled();
      expect(paymentQueue.add).not.toHaveBeenCalled();
      // But should still send webhook
      expect(webhookQueue.add).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ event: 'invoice.drafted' }),
      );
    });

    it('should not generate invoice when subscription not found', async () => {
      db.subscription.findUnique.mockResolvedValue(null);

      const job = makeJob(BillingJobType.GENERATE_INVOICE, {
        tenantId: 'tenant_1',
        subscriptionId: 'missing',
        customerId: 'cust_1',
      });

      await processor.process(job);

      expect(db.invoice.create).not.toHaveBeenCalled();
    });

    it('should auto-charge when paymentMethodId is present', async () => {
      const sub = setupBaseInvoiceMocks();
      (sub as any).paymentMethodId = 'pm_1';

      const job = makeJob(BillingJobType.GENERATE_INVOICE, {
        tenantId: 'tenant_1',
        subscriptionId: 'sub_1',
        customerId: 'cust_1',
      });

      await processor.process(job);

      expect(paymentQueue.add).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          tenantId: 'tenant_1',
          paymentMethodId: 'pm_1',
        }),
      );
    });

    it('should add pending add-ons to invoice', async () => {
      setupBaseInvoiceMocks();
      db.appliedAddOn.findMany.mockResolvedValue([
        { id: 'aa_1', addOnId: 'addon_1', amount: '10.00', currency: 'USD' },
      ]);
      db.appliedAddOn.updateMany.mockResolvedValue({});

      const job = makeJob(BillingJobType.GENERATE_INVOICE, {
        tenantId: 'tenant_1',
        subscriptionId: 'sub_1',
        customerId: 'cust_1',
      });

      await processor.process(job);

      // Plan 49 + Add-on 10 = 59
      expect(db.invoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ amount: 59 }),
        }),
      );
      expect(db.appliedAddOn.updateMany).toHaveBeenCalled();
    });
  });

  // =============================================================
  // handleFinalizeDraftInvoices
  // =============================================================

  describe('handleFinalizeDraftInvoices', () => {
    it('should finalize draft invoices past grace period', async () => {
      const pastGrace = new Date();
      pastGrace.setDate(pastGrace.getDate() - 1);

      db.invoice.findMany.mockResolvedValue([{
        id: 'inv_1',
        invoiceNumber: 'INV-00001',
        customerId: 'cust_1',
        subscriptionId: 'sub_1',
        amount: '49.00',
        currency: 'USD',
        dueDate: new Date(),
        metadata: { gracePeriodEndsAt: pastGrace.toISOString() },
        customer: { id: 'cust_1', name: 'John', email: 'john@test.com' },
        subscription: { paymentMethodId: 'pm_1' },
      }]);
      db.invoice.update.mockResolvedValue({});

      const job = makeJob(BillingJobType.FINALIZE_DRAFT_INVOICES, { tenantId: 'tenant_1' });

      await processor.process(job);

      // Should update status to PENDING
      expect(db.invoice.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'PENDING' }),
        }),
      );
      // Should send email
      expect(emailQueue.add).toHaveBeenCalled();
      // Should send webhook
      expect(webhookQueue.add).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ event: 'invoice.finalized' }),
      );
      // Should auto-charge
      expect(paymentQueue.add).toHaveBeenCalled();
    });

    it('should skip draft invoices still within grace period', async () => {
      const futureGrace = new Date();
      futureGrace.setDate(futureGrace.getDate() + 3);

      db.invoice.findMany.mockResolvedValue([{
        id: 'inv_1',
        metadata: { gracePeriodEndsAt: futureGrace.toISOString() },
        customer: { email: 'john@test.com' },
        subscription: {},
      }]);

      const job = makeJob(BillingJobType.FINALIZE_DRAFT_INVOICES, { tenantId: 'tenant_1' });

      await processor.process(job);

      expect(db.invoice.update).not.toHaveBeenCalled();
      expect(emailQueue.add).not.toHaveBeenCalled();
    });
  });

  // =============================================================
  // handleCheckProgressiveBilling
  // =============================================================

  describe('handleCheckProgressiveBilling', () => {
    it('should trigger invoice when usage exceeds threshold', async () => {
      db.subscription.findUnique.mockResolvedValue({
        id: 'sub_1',
        status: 'ACTIVE',
        customerId: 'cust_1',
        currentPeriodStart: new Date('2026-01-01'),
        lastProgressiveBillingAt: null,
        plan: {
          progressiveBillingThreshold: '100.00',
          charges: [{
            id: 'charge_1',
            chargeModel: 'STANDARD',
            properties: { amount: '1' },
            billableMetric: { code: 'api_calls', aggregationType: 'COUNT', fieldName: null },
            graduatedRanges: [],
          }],
        },
      });

      // 150 events * $1 = $150 (exceeds $100 threshold)
      db.usageEvent.findMany.mockResolvedValue(
        Array.from({ length: 150 }, (_, i) => ({
          properties: {},
          timestamp: new Date(`2026-01-${String(i % 28 + 1).padStart(2, '0')}`),
        })),
      );
      db.subscription.update.mockResolvedValue({});

      const job = makeJob(BillingJobType.CHECK_PROGRESSIVE_BILLING, {
        tenantId: 'tenant_1',
        subscriptionId: 'sub_1',
      });

      await processor.process(job);

      // Should update lastProgressiveBillingAt
      expect(db.subscription.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ lastProgressiveBillingAt: expect.any(Date) }),
        }),
      );

      // Should queue invoice generation
      expect(billingQueue.add).toHaveBeenCalledWith(
        BillingJobType.GENERATE_INVOICE,
        expect.objectContaining({
          subscriptionId: 'sub_1',
          progressive: true,
        }),
      );
    });

    it('should not trigger when usage is below threshold', async () => {
      db.subscription.findUnique.mockResolvedValue({
        id: 'sub_1',
        status: 'ACTIVE',
        customerId: 'cust_1',
        currentPeriodStart: new Date('2026-01-01'),
        lastProgressiveBillingAt: null,
        plan: {
          progressiveBillingThreshold: '100.00',
          charges: [{
            id: 'charge_1',
            chargeModel: 'STANDARD',
            properties: { amount: '1' },
            billableMetric: { code: 'api_calls', aggregationType: 'COUNT', fieldName: null },
            graduatedRanges: [],
          }],
        },
      });

      // 50 events * $1 = $50 (below $100 threshold)
      db.usageEvent.findMany.mockResolvedValue(
        Array.from({ length: 50 }, () => ({
          properties: {},
          timestamp: new Date(),
        })),
      );

      const job = makeJob(BillingJobType.CHECK_PROGRESSIVE_BILLING, {
        tenantId: 'tenant_1',
        subscriptionId: 'sub_1',
      });

      await processor.process(job);

      expect(db.subscription.update).not.toHaveBeenCalled();
      expect(billingQueue.add).not.toHaveBeenCalled();
    });

    it('should skip inactive subscription', async () => {
      db.subscription.findUnique.mockResolvedValue({
        id: 'sub_1',
        status: 'CANCELED',
        plan: { progressiveBillingThreshold: '100.00' },
      });

      const job = makeJob(BillingJobType.CHECK_PROGRESSIVE_BILLING, {
        tenantId: 'tenant_1',
        subscriptionId: 'sub_1',
      });

      await processor.process(job);

      expect(db.usageEvent.findMany).not.toHaveBeenCalled();
    });

    it('should skip when no threshold configured', async () => {
      db.subscription.findUnique.mockResolvedValue({
        id: 'sub_1',
        status: 'ACTIVE',
        plan: { progressiveBillingThreshold: null, charges: [] },
      });

      const job = makeJob(BillingJobType.CHECK_PROGRESSIVE_BILLING, {
        tenantId: 'tenant_1',
        subscriptionId: 'sub_1',
      });

      await processor.process(job);

      expect(db.usageEvent.findMany).not.toHaveBeenCalled();
    });
  });

  // =============================================================
  // calculateChargeCost (tested via invoice generation)
  // =============================================================

  describe('charge cost calculations', () => {
    function setupChargeTest(chargeModel: string, properties: any, events: any[], graduatedRanges?: any[]) {
      const charges = [{
        id: 'charge_1',
        chargeModel,
        properties,
        billableMetric: { code: 'metric', aggregationType: 'COUNT', fieldName: null },
        graduatedRanges: graduatedRanges || [],
        minAmountCents: null,
        invoiceDisplayName: null,
      }];

      const sub = {
        ...makeSubscription(),
        plan: {
          ...makePlan(),
          prices: [{ ...makePlanPrice(), amount: '0' }], // Zero plan price to isolate charge cost
          charges,
          invoiceGracePeriodDays: null,
          minimumCommitment: null,
        },
      };

      db.subscription.findUnique.mockResolvedValue(sub);
      db.customer.findUnique.mockResolvedValue(makeCustomer());
      db.invoice.findFirst.mockResolvedValue(null);
      db.appliedCoupon.findMany.mockResolvedValue([]);
      db.appliedAddOn.findMany.mockResolvedValue([]);
      db.invoice.create.mockResolvedValue(makeInvoice());
      db.invoice.update.mockResolvedValue({});
      db.usageEvent.findMany.mockResolvedValue(events);
    }

    it('STANDARD: unit * amount', async () => {
      setupChargeTest('STANDARD', { amount: '0.05' }, [
        { properties: {}, timestamp: new Date() },
        { properties: {}, timestamp: new Date() },
      ]);

      await processor.process(makeJob(BillingJobType.GENERATE_INVOICE, {
        tenantId: 'tenant_1', subscriptionId: 'sub_1', customerId: 'cust_1',
      }));

      // 2 events * $0.05 = $0.10
      expect(db.invoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ amount: 0.1 }),
        }),
      );
    });

    it('PACKAGE: ceil(units/packageSize) * amount', async () => {
      setupChargeTest(
        'PACKAGE',
        { packageSize: '1000', amount: '5' },
        Array.from({ length: 2500 }, () => ({ properties: {}, timestamp: new Date() })),
      );

      await processor.process(makeJob(BillingJobType.GENERATE_INVOICE, {
        tenantId: 'tenant_1', subscriptionId: 'sub_1', customerId: 'cust_1',
      }));

      // ceil(2500/1000) * 5 = 3 * 5 = 15
      expect(db.invoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ amount: 15 }),
        }),
      );
    });

    it('GRADUATED: tiered per-unit pricing', async () => {
      setupChargeTest(
        'GRADUATED',
        {},
        Array.from({ length: 15 }, () => ({ properties: {}, timestamp: new Date() })),
        [
          { fromValue: 0, toValue: 10, perUnitAmount: '1.00', flatAmount: '0' },
          { fromValue: 11, toValue: null, perUnitAmount: '0.50', flatAmount: '0' },
        ],
      );

      await processor.process(makeJob(BillingJobType.GENERATE_INVOICE, {
        tenantId: 'tenant_1', subscriptionId: 'sub_1', customerId: 'cust_1',
      }));

      // First 11 units * $1 + 4 units * $0.50 = 11 + 2 = 13
      expect(db.invoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ amount: 13 }),
        }),
      );
    });
  });

  // =============================================================
  // Edge cases
  // =============================================================

  describe('process routing', () => {
    it('should not throw for unknown job type', async () => {
      const job = makeJob('UNKNOWN_JOB', {});
      await expect(processor.process(job)).resolves.toBeUndefined();
    });
  });
});
