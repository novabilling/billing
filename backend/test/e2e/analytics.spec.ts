import { registerTenant, waitForApi, createApiClient, TestTenant } from './setup';

jest.setTimeout(60_000);

beforeAll(() => waitForApi(), 30_000);

describe('Analytics E2E', () => {
  let tenant: TestTenant;
  let api: ReturnType<typeof createApiClient>;

  beforeAll(async () => {
    tenant = await registerTenant('analytics');
    api = createApiClient(tenant.apiKey);
  });

  it('GET /analytics/revenue — should return revenue analytics', async () => {
    const res = await api.get('/analytics/revenue');
    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
  });

  it('GET /analytics/subscriptions — should return subscription analytics', async () => {
    const res = await api.get('/analytics/subscriptions');
    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
  });

  it('GET /analytics/customers — should return customer analytics', async () => {
    const res = await api.get('/analytics/customers');
    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
  });

  it('GET /analytics/payments — should return payment analytics', async () => {
    const res = await api.get('/analytics/payments');
    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
  });

  it('GET /analytics/mrr-breakdown — should return MRR breakdown', async () => {
    const res = await api.get('/analytics/mrr-breakdown');
    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
  });

  it('GET /analytics/net-revenue — should return net revenue', async () => {
    const res = await api.get('/analytics/net-revenue');
    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
  });

  it('GET /analytics/churn-cohorts — should return churn data', async () => {
    const res = await api.get('/analytics/churn-cohorts');
    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
  });

  it('GET /analytics/ltv — should return LTV metrics', async () => {
    const res = await api.get('/analytics/ltv');
    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
  });

  it('should accept date range filters', async () => {
    const from = '2025-01-01';
    const to = '2026-12-31';
    const res = await api.get(`/analytics/revenue?dateFrom=${from}&dateTo=${to}`);
    expect(res.status).toBe(200);
  });
});
