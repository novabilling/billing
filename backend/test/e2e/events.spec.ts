import { registerTenant, waitForApi, createApiClient, TestTenant } from './setup';

jest.setTimeout(60_000);

beforeAll(() => waitForApi(), 30_000);

describe('Events E2E', () => {
  let tenant: TestTenant;
  let api: ReturnType<typeof createApiClient>;
  let customerId: string;
  let planId: string;
  let subscriptionId: string;
  let metricId: string;

  beforeAll(async () => {
    tenant = await registerTenant('events');
    api = createApiClient(tenant.apiKey);

    // Create customer
    const cust = await api.post('/customers', {
      externalId: 'evt_cust_1',
      email: 'event-cust@example.com',
      name: 'Event Customer',
      currency: 'USD',
    });
    customerId = cust.data.id;

    // Create plan
    const plan = await api.post('/plans', {
      name: 'Event Plan',
      code: 'event_plan',
      billingInterval: 'MONTHLY',
      prices: [{ currency: 'USD', amount: 10 }],
    });
    planId = plan.data.id;

    // Create subscription
    const sub = await api.post('/subscriptions', {
      customerId,
      planId,
      currency: 'USD',
    });
    subscriptionId = sub.data.id;

    // Create billable metric
    const metric = await api.post('/billable-metrics', {
      name: 'API Calls',
      code: 'api_calls',
      aggregationType: 'COUNT',
    });
    metricId = metric.data.id;
  });

  describe('POST /events', () => {
    it('should ingest a single event', async () => {
      const res = await api.post('/events', {
        transactionId: `txn_${Date.now()}_1`,
        subscriptionId,
        code: 'api_calls',
        timestamp: new Date().toISOString(),
        properties: { endpoint: '/api/users' },
      });

      expect(res.status).toBe(201);
      expect(res.data.id).toBeDefined();
    });

    it('should enforce idempotency via transactionId', async () => {
      const txnId = `txn_idem_${Date.now()}`;
      const eventData = {
        transactionId: txnId,
        subscriptionId,
        code: 'api_calls',
        timestamp: new Date().toISOString(),
        properties: {},
      };

      const first = await api.post('/events', eventData);
      expect(first.status).toBe(201);

      const second = await api.post('/events', eventData);
      // Should return existing event or 409
      expect([200, 201, 409]).toContain(second.status);
    });
  });

  describe('POST /events/batch', () => {
    it('should ingest a batch of events', async () => {
      const events = Array.from({ length: 3 }, (_, i) => ({
        transactionId: `txn_batch_${Date.now()}_${i}`,
        subscriptionId,
        code: 'api_calls',
        timestamp: new Date().toISOString(),
        properties: { index: i },
      }));

      const res = await api.post('/events/batch', { events });
      expect(res.status).toBe(201);
    });
  });

  describe('GET /events', () => {
    it('GET /events/subscription/:id — should list events for subscription', async () => {
      const res = await api.get(`/events/subscription/${subscriptionId}`);
      expect(res.status).toBe(200);
      expect(res.data.data).toBeDefined();
      expect(res.data.data.length).toBeGreaterThanOrEqual(1);
    });

    it('should filter by code', async () => {
      const res = await api.get(`/events/subscription/${subscriptionId}?code=api_calls`);
      expect(res.status).toBe(200);
      res.data.data.forEach((e: any) => {
        expect(e.code).toBe('api_calls');
      });
    });
  });
});
