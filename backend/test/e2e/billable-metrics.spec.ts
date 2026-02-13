import { registerTenant, waitForApi, createApiClient, TestTenant } from './setup';

jest.setTimeout(60_000);

beforeAll(() => waitForApi(), 30_000);

describe('Billable Metrics E2E', () => {
  let tenant: TestTenant;
  let api: ReturnType<typeof createApiClient>;

  beforeAll(async () => {
    tenant = await registerTenant('metrics');
    api = createApiClient(tenant.apiKey);
  });

  describe('CRUD lifecycle', () => {
    let metricId: string;

    it('POST /billable-metrics — should create a metric', async () => {
      const res = await api.post('/billable-metrics', {
        name: 'API Requests',
        code: 'api_requests',
        aggregationType: 'COUNT',
        description: 'Number of API requests made',
      });

      expect(res.status).toBe(201);
      expect(res.data.id).toBeDefined();
      expect(res.data.name).toBe('API Requests');
      expect(res.data.code).toBe('api_requests');
      expect(res.data.aggregationType).toBe('COUNT');
      metricId = res.data.id;
    });

    it('GET /billable-metrics — should list metrics', async () => {
      const res = await api.get('/billable-metrics');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /billable-metrics/:id — should return metric', async () => {
      const res = await api.get(`/billable-metrics/${metricId}`);
      expect(res.status).toBe(200);
      expect(res.data.id).toBe(metricId);
      expect(res.data.code).toBe('api_requests');
    });

    it('PATCH /billable-metrics/:id — should update metric', async () => {
      const res = await api.patch(`/billable-metrics/${metricId}`, {
        name: 'API Requests v2',
        description: 'Updated description',
      });
      expect(res.status).toBe(200);
      expect(res.data.name).toBe('API Requests v2');
    });

    it('DELETE /billable-metrics/:id — should delete metric', async () => {
      const res = await api.del(`/billable-metrics/${metricId}`);
      expect(res.status).toBe(200);
    });

    it('GET /billable-metrics/:id — should 404 after deletion', async () => {
      const res = await api.get(`/billable-metrics/${metricId}`);
      expect(res.status).toBe(404);
    });
  });

  describe('aggregation types', () => {
    const types = ['COUNT', 'SUM', 'MAX', 'UNIQUE_COUNT', 'LATEST', 'WEIGHTED_SUM'];

    types.forEach((aggType) => {
      it(`should create metric with ${aggType} aggregation`, async () => {
        const res = await api.post('/billable-metrics', {
          name: `${aggType} Metric`,
          code: `metric_${aggType.toLowerCase()}`,
          aggregationType: aggType,
          ...(aggType !== 'COUNT' && { fieldName: 'value' }),
        });
        expect(res.status).toBe(201);
        expect(res.data.aggregationType).toBe(aggType);
      });
    });
  });

  describe('code uniqueness', () => {
    it('should reject duplicate metric codes', async () => {
      await api.post('/billable-metrics', {
        name: 'Unique Metric',
        code: 'unique_metric',
        aggregationType: 'COUNT',
      });

      const dup = await api.post('/billable-metrics', {
        name: 'Dup Metric',
        code: 'unique_metric',
        aggregationType: 'SUM',
        fieldName: 'amount',
      });
      expect(dup.status).toBe(409);
    });
  });
});
