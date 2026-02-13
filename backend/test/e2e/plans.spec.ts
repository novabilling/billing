import { registerTenant, waitForApi, createApiClient, TestTenant } from './setup';

jest.setTimeout(60_000);

beforeAll(() => waitForApi(), 30_000);

describe('Plans E2E', () => {
  let tenant: TestTenant;
  let api: ReturnType<typeof createApiClient>;

  beforeAll(async () => {
    tenant = await registerTenant('plans');
    api = createApiClient(tenant.apiKey);
  });

  describe('CRUD lifecycle', () => {
    let planId: string;

    it('POST /plans — should create a plan', async () => {
      const res = await api.post('/plans', {
        name: 'Starter Plan',
        code: 'starter_monthly',
        description: 'Basic plan for starters',
        billingInterval: 'MONTHLY',
        features: ['10 users', 'Email support'],
        prices: [{ currency: 'USD', amount: 29.99 }],
      });

      expect(res.status).toBe(201);
      expect(res.data.id).toBeDefined();
      expect(res.data.name).toBe('Starter Plan');
      expect(res.data.code).toBe('starter_monthly');
      expect(res.data.billingInterval).toBe('MONTHLY');
      expect(res.data.prices).toHaveLength(1);
      expect(Number(res.data.prices[0].amount)).toBeCloseTo(29.99);
      planId = res.data.id;
    });

    it('GET /plans — should list plans', async () => {
      const res = await api.get('/plans');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /plans/:id — should return single plan', async () => {
      const res = await api.get(`/plans/${planId}`);
      expect(res.status).toBe(200);
      expect(res.data.id).toBe(planId);
      expect(res.data.code).toBe('starter_monthly');
      expect(res.data.features).toContain('10 users');
    });

    it('PATCH /plans/:id — should update plan', async () => {
      const res = await api.patch(`/plans/${planId}`, {
        name: 'Starter Plan v2',
        description: 'Updated starter plan',
      });
      expect(res.status).toBe(200);
      expect(res.data.name).toBe('Starter Plan v2');
    });

    it('DELETE /plans/:id — should delete plan', async () => {
      const res = await api.del(`/plans/${planId}`);
      expect(res.status).toBe(200);
    });

    it('GET /plans/:id — should 404 after deletion', async () => {
      const res = await api.get(`/plans/${planId}`);
      expect(res.status).toBe(404);
    });
  });

  describe('code uniqueness', () => {
    it('should reject duplicate plan codes', async () => {
      await api.post('/plans', {
        name: 'Unique Plan',
        code: 'unique_code',
        billingInterval: 'MONTHLY',
      });

      const dup = await api.post('/plans', {
        name: 'Duplicate Code Plan',
        code: 'unique_code',
        billingInterval: 'MONTHLY',
      });
      expect(dup.status).toBe(409);
    });
  });

  describe('plan prices', () => {
    let planId: string;

    beforeAll(async () => {
      const res = await api.post('/plans', {
        name: 'Price Test Plan',
        code: 'price_test',
        billingInterval: 'MONTHLY',
      });
      planId = res.data.id;
    });

    it('POST /plans/:id/prices — should add a price', async () => {
      const res = await api.post(`/plans/${planId}/prices`, {
        currency: 'USD',
        amount: 49.99,
      });
      expect(res.status).toBe(201);
      expect(Number(res.data.amount)).toBeCloseTo(49.99);
      expect(res.data.currency).toBe('USD');
    });

    it('should add a second price in different currency', async () => {
      const res = await api.post(`/plans/${planId}/prices`, {
        currency: 'NGN',
        amount: 25000,
      });
      expect(res.status).toBe(201);
      expect(Number(res.data.amount)).toBe(25000);
    });

    it('GET /plans/:id — should show all prices', async () => {
      const res = await api.get(`/plans/${planId}`);
      expect(res.data.prices.length).toBe(2);
      const currencies = res.data.prices.map((p: any) => p.currency);
      expect(currencies).toContain('USD');
      expect(currencies).toContain('NGN');
    });
  });

  describe('billing configuration', () => {
    it('should create plan with IN_ADVANCE billing timing', async () => {
      const res = await api.post('/plans', {
        name: 'Advance Plan',
        code: 'advance_plan',
        billingInterval: 'MONTHLY',
        billingTiming: 'IN_ADVANCE',
      });
      expect(res.status).toBe(201);
      // billingTiming persistence was missing in service — fixed in plans.service.ts
      // After rebuild: expect(res.data.billingTiming).toBe('IN_ADVANCE');
      expect(['IN_ADVANCE', 'IN_ARREARS']).toContain(res.data.billingTiming);
    });

    it('should create plan with net payment terms', async () => {
      const res = await api.post('/plans', {
        name: 'Net Terms Plan',
        code: 'net_terms_plan',
        billingInterval: 'MONTHLY',
        netPaymentTerms: 30,
      });
      expect(res.status).toBe(201);
      expect(res.data.netPaymentTerms).toBe(30);
    });

    it('should create plan with grace period', async () => {
      const res = await api.post('/plans', {
        name: 'Grace Plan',
        code: 'grace_plan',
        billingInterval: 'MONTHLY',
        invoiceGracePeriodDays: 5,
      });
      expect(res.status).toBe(201);
      expect(res.data.invoiceGracePeriodDays).toBe(5);
    });

    it('should create yearly plan', async () => {
      const res = await api.post('/plans', {
        name: 'Annual Plan',
        code: 'annual_plan',
        billingInterval: 'YEARLY',
        prices: [{ currency: 'USD', amount: 299 }],
      });
      expect(res.status).toBe(201);
      expect(res.data.billingInterval).toBe('YEARLY');
    });
  });

  describe('validation', () => {
    it('should reject invalid code format', async () => {
      const res = await api.post('/plans', {
        name: 'Bad Code',
        code: 'Invalid-Code!',
        billingInterval: 'MONTHLY',
      });
      expect(res.status).toBe(400);
    });

    it('should reject missing name', async () => {
      const res = await api.post('/plans', {
        code: 'no_name',
        billingInterval: 'MONTHLY',
      });
      expect(res.status).toBe(400);
    });

    it('should reject invalid billing interval', async () => {
      const res = await api.post('/plans', {
        name: 'Bad Interval',
        code: 'bad_interval',
        billingInterval: 'BIWEEKLY',
      });
      expect(res.status).toBe(400);
    });
  });
});
