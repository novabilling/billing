import { registerTenant, waitForApi, createApiClient, TestTenant } from './setup';

jest.setTimeout(60_000);

beforeAll(() => waitForApi(), 30_000);

describe('Subscriptions E2E', () => {
  let tenant: TestTenant;
  let api: ReturnType<typeof createApiClient>;
  let customerId: string;
  let planId: string;
  let plan2Id: string;

  beforeAll(async () => {
    tenant = await registerTenant('subscriptions');
    api = createApiClient(tenant.apiKey);

    // Create a customer
    const cust = await api.post('/customers', {
      externalId: 'sub_cust_1',
      email: 'sub-customer@example.com',
      name: 'Sub Customer',
      currency: 'USD',
    });
    customerId = cust.data.id;

    // Create two plans with USD prices
    const p1 = await api.post('/plans', {
      name: 'Basic Plan',
      code: 'basic_sub',
      billingInterval: 'MONTHLY',
      prices: [{ currency: 'USD', amount: 29 }],
    });
    planId = p1.data.id;

    const p2 = await api.post('/plans', {
      name: 'Pro Plan',
      code: 'pro_sub',
      billingInterval: 'MONTHLY',
      prices: [{ currency: 'USD', amount: 79 }],
    });
    plan2Id = p2.data.id;
  });

  describe('lifecycle', () => {
    let subscriptionId: string;

    it('POST /subscriptions — should create a subscription', async () => {
      const res = await api.post('/subscriptions', {
        customerId,
        planId,
        currency: 'USD',
      });

      expect(res.status).toBe(201);
      expect(res.data.id).toBeDefined();
      expect(res.data.status).toBe('ACTIVE');
      expect(res.data.customerId).toBe(customerId);
      expect(res.data.planId).toBe(planId);
      expect(res.data.currency).toBe('USD');
      expect(res.data.currentPeriodStart).toBeDefined();
      expect(res.data.currentPeriodEnd).toBeDefined();
      subscriptionId = res.data.id;
    });

    it('GET /subscriptions — should list subscriptions', async () => {
      const res = await api.get('/subscriptions');
      expect(res.status).toBe(200);
      expect(res.data.data).toBeDefined();
      expect(res.data.data.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /subscriptions/:id — should return subscription with plan', async () => {
      const res = await api.get(`/subscriptions/${subscriptionId}`);
      expect(res.status).toBe(200);
      expect(res.data.id).toBe(subscriptionId);
      expect(res.data.plan).toBeDefined();
      expect(res.data.customer).toBeDefined();
    });

    it('GET /subscriptions?customerId — should filter by customer', async () => {
      const res = await api.get(`/subscriptions?customerId=${customerId}`);
      expect(res.status).toBe(200);
      expect(res.data.data.length).toBeGreaterThanOrEqual(1);
      res.data.data.forEach((s: any) => {
        expect(s.customerId).toBe(customerId);
      });
    });

    it('PATCH /subscriptions/:id — should update metadata', async () => {
      const res = await api.patch(`/subscriptions/${subscriptionId}`, {
        metadata: { source: 'e2e-test' },
      });
      expect(res.status).toBe(200);
    });

    it('POST /subscriptions/:id/cancel — should cancel at period end', async () => {
      const res = await api.post(`/subscriptions/${subscriptionId}/cancel`, {
        cancelAt: 'period_end',
      });
      expect(res.ok).toBe(true);
      expect(res.data.cancelAt).toBeDefined();
    });
  });

  describe('trial', () => {
    it('should create subscription with trial period', async () => {
      const res = await api.post('/subscriptions', {
        customerId,
        planId,
        currency: 'USD',
        trialDays: 14,
      });
      expect(res.ok).toBe(true);
      expect(res.data.status).toBe('TRIALING');
      expect(res.data.trialEnd).toBeDefined();
    });
  });

  describe('plan change', () => {
    let subscriptionId: string;

    beforeAll(async () => {
      const res = await api.post('/subscriptions', {
        customerId,
        planId,
        currency: 'USD',
      });
      subscriptionId = res.data.id;
    });

    it('POST /subscriptions/:id/change-plan — should upgrade plan', async () => {
      const res = await api.post(`/subscriptions/${subscriptionId}/change-plan`, {
        newPlanId: plan2Id,
      });
      expect(res.ok).toBe(true);
      expect(res.data.planId).toBe(plan2Id);
    });
  });

  describe('pause/resume', () => {
    let subscriptionId: string;

    beforeAll(async () => {
      const res = await api.post('/subscriptions', {
        customerId,
        planId: plan2Id,
        currency: 'USD',
      });
      subscriptionId = res.data.id;
    });

    it('POST /subscriptions/:id/pause — should pause', async () => {
      const res = await api.post(`/subscriptions/${subscriptionId}/pause`);
      expect(res.ok).toBe(true);
      expect(res.data.status).toBe('PAUSED');
    });

    it('POST /subscriptions/:id/resume — should resume', async () => {
      const res = await api.post(`/subscriptions/${subscriptionId}/resume`);
      expect(res.ok).toBe(true);
      expect(res.data.status).toBe('ACTIVE');
    });
  });

  describe('validation', () => {
    it('should reject missing customerId', async () => {
      const res = await api.post('/subscriptions', {
        planId,
        currency: 'USD',
      });
      expect(res.status).toBe(400);
    });

    it('should 404 for non-existent subscription', async () => {
      const res = await api.get('/subscriptions/nonexistent_id');
      expect(res.status).toBe(404);
    });
  });
});
