import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from '../../../src/modules/analytics/analytics.service';
import { createMockPrisma, MockPrisma } from '../../helpers/mock-prisma';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let db: MockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticsService],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    db = createMockPrisma();
  });

  const dateRange = { dateFrom: '2026-01-01', dateTo: '2026-01-31' };

  describe('getRevenueAnalytics', () => {
    it('should return revenue metrics', async () => {
      // getRevenueAnalytics calls: invoice.findMany, invoice.count, subscription.findMany
      db.invoice.findMany.mockResolvedValue([
        { amount: '5000.00', currency: 'USD' },
      ]);
      db.invoice.count.mockResolvedValue(50);
      db.subscription.findMany.mockResolvedValue([
        {
          plan: { prices: [{ amount: '49.00', currency: 'USD' }], billingInterval: 'MONTHLY' },
          currency: 'USD',
        },
      ]);

      const result = await service.getRevenueAnalytics(db as never, dateRange);

      expect(result).toHaveProperty('totalRevenue');
      expect(result).toHaveProperty('invoiceCount');
      expect(result).toHaveProperty('mrr');
      expect(result).toHaveProperty('arr');
      expect(result.invoiceCount).toBe(50);
    });
  });

  describe('getSubscriptionAnalytics', () => {
    it('should return subscription breakdown', async () => {
      // 6 subscription.count calls: total, active, canceled, trialing, paused, new
      db.subscription.count
        .mockResolvedValueOnce(100)  // total
        .mockResolvedValueOnce(80)   // active
        .mockResolvedValueOnce(5)    // canceled
        .mockResolvedValueOnce(3)    // trialing
        .mockResolvedValueOnce(2)    // paused
        .mockResolvedValueOnce(10);  // new

      const result = await service.getSubscriptionAnalytics(db as never, dateRange);

      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('active');
      expect(result).toHaveProperty('churnRate');
      expect(result).toHaveProperty('retentionRate');
      expect(result.total).toBe(100);
      expect(result.active).toBe(80);
    });
  });

  describe('getCustomerAnalytics', () => {
    it('should return customer metrics', async () => {
      // customer.count (total), customer.count (new), invoice.findMany (paid)
      db.customer.count
        .mockResolvedValueOnce(200)  // total
        .mockResolvedValueOnce(15);  // new
      db.invoice.findMany.mockResolvedValue([
        { amount: '10000.00', currency: 'USD' },
      ]);

      const result = await service.getCustomerAnalytics(db as never, dateRange);

      expect(result).toHaveProperty('totalCustomers');
      expect(result).toHaveProperty('newCustomers');
      expect(result).toHaveProperty('arpu');
      expect(result.totalCustomers).toBe(200);
      expect(result.newCustomers).toBe(15);
    });
  });

  describe('getMrrBreakdown', () => {
    it('should return MRR breakdown with byPlan', async () => {
      db.subscription.findMany.mockResolvedValue([
        {
          id: 'sub_1',
          status: 'ACTIVE',
          currency: 'USD',
          planId: 'plan_1',
          plan: { id: 'plan_1', name: 'Pro', prices: [{ currency: 'USD', amount: '49.00' }], billingInterval: 'MONTHLY' },
          createdAt: new Date('2026-01-15'),
        },
      ]);

      const result = await service.getMrrBreakdown(db as never, dateRange);

      expect(result).toHaveProperty('totalMrr');
      expect(result).toHaveProperty('byPlan');
      expect(Array.isArray(result.byPlan)).toBe(true);
    });
  });

  describe('getNetRevenue', () => {
    it('should return gross, refunds, credit notes, and net', async () => {
      db.invoice.findMany.mockResolvedValue([
        { amount: '5000.00', currency: 'USD' },
      ]);
      db.payment.findMany.mockResolvedValue([
        { amount: '200.00', currency: 'USD' },
      ]);
      db.creditNote.findMany.mockResolvedValue([
        { amount: '100.00', currency: 'USD' },
      ]);

      const result = await service.getNetRevenue(db as never, dateRange);

      expect(result).toHaveProperty('grossRevenue');
      expect(result).toHaveProperty('refunds');
      expect(result).toHaveProperty('creditNotes');
      expect(result).toHaveProperty('netRevenue');
      expect(result.netRevenue).toBe(4700);
    });
  });

  describe('getChurnCohorts', () => {
    it('should return cohort retention matrix', async () => {
      db.subscription.findMany.mockResolvedValue([]);

      const result = await service.getChurnCohorts(db as never, { months: 6 });

      expect(result).toHaveProperty('months');
      expect(result).toHaveProperty('cohorts');
      expect(Array.isArray(result.cohorts)).toBe(true);
    });
  });

  describe('getLtv', () => {
    it('should return LTV metrics', async () => {
      db.subscription.findMany.mockResolvedValue([
        {
          id: 'sub_1',
          planId: 'plan_1',
          plan: { id: 'plan_1', name: 'Pro' },
          invoices: [
            { amount: '49.00', currency: 'USD' },
            { amount: '49.00', currency: 'USD' },
          ],
          createdAt: new Date('2025-01-01'),
          canceledAt: new Date('2025-07-01'),
        },
      ]);

      const result = await service.getLtv(db as never);

      expect(result).toHaveProperty('avgLtv');
      expect(result).toHaveProperty('avgLifespanDays');
      expect(result).toHaveProperty('byPlan');
      expect(result.byPlan).toHaveLength(1);
      expect(result.byPlan[0].planName).toBe('Pro');
    });

    it('should return zeros when no subscriptions', async () => {
      db.subscription.findMany.mockResolvedValue([]);

      const result = await service.getLtv(db as never);

      expect(result.avgLtv).toBe(0);
      expect(result.avgLifespanDays).toBe(0);
      expect(result.byPlan).toHaveLength(0);
    });
  });

  describe('getPaymentAnalytics', () => {
    it('should return payment success/failure stats', async () => {
      // 3 payment.count calls: total, succeeded, failed
      db.payment.count
        .mockResolvedValueOnce(100)   // total
        .mockResolvedValueOnce(90)    // succeeded
        .mockResolvedValueOnce(10);   // failed

      const result = await service.getPaymentAnalytics(db as never, dateRange);

      expect(result).toHaveProperty('totalPayments');
      expect(result).toHaveProperty('succeeded');
      expect(result).toHaveProperty('successRate');
      expect(result.totalPayments).toBe(100);
      expect(result.succeeded).toBe(90);
    });
  });
});
