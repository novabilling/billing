import { registerTenant, waitForApi, createApiClient, TestTenant } from './setup';

jest.setTimeout(60_000);

beforeAll(() => waitForApi(), 30_000);

describe('Customers E2E', () => {
  let tenant: TestTenant;
  let api: ReturnType<typeof createApiClient>;

  beforeAll(async () => {
    tenant = await registerTenant('customers');
    api = createApiClient(tenant.apiKey);
  });

  describe('CRUD lifecycle', () => {
    let customerId: string;

    it('POST /customers — should create a customer', async () => {
      const res = await api.post('/customers', {
        externalId: 'ext_cust_001',
        email: 'customer1@example.com',
        name: 'Jane Doe',
        country: 'NG',
        currency: 'NGN',
        metadata: { plan: 'starter' },
      });

      expect(res.status).toBe(201);
      expect(res.data.id).toBeDefined();
      expect(res.data.externalId).toBe('ext_cust_001');
      expect(res.data.email).toBe('customer1@example.com');
      expect(res.data.name).toBe('Jane Doe');
      expect(res.data.currency).toBe('NGN');
      customerId = res.data.id;
    });

    it('GET /customers — should list customers', async () => {
      const res = await api.get('/customers');
      expect(res.status).toBe(200);
      expect(res.data.data).toBeDefined();
      expect(res.data.data.length).toBeGreaterThanOrEqual(1);
      expect(res.data.meta).toBeDefined();
      expect(res.data.meta.total).toBeGreaterThanOrEqual(1);
    });

    it('GET /customers/:id — should return single customer', async () => {
      const res = await api.get(`/customers/${customerId}`);
      expect(res.status).toBe(200);
      expect(res.data.id).toBe(customerId);
      expect(res.data.email).toBe('customer1@example.com');
    });

    it('PATCH /customers/:id — should update customer', async () => {
      const res = await api.patch(`/customers/${customerId}`, {
        name: 'Jane Smith',
        country: 'US',
      });
      expect(res.status).toBe(200);
      expect(res.data.name).toBe('Jane Smith');
      expect(res.data.country).toBe('US');
    });

    it('GET /customers/:id/subscriptions — should return empty list', async () => {
      const res = await api.get(`/customers/${customerId}/subscriptions`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
    });

    it('GET /customers/:id/invoices — should return empty list', async () => {
      const res = await api.get(`/customers/${customerId}/invoices`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
    });

    it('DELETE /customers/:id — should delete customer', async () => {
      const res = await api.del(`/customers/${customerId}`);
      expect(res.status).toBe(200);
    });

    it('GET /customers/:id — should 404 after deletion', async () => {
      const res = await api.get(`/customers/${customerId}`);
      expect(res.status).toBe(404);
    });
  });

  describe('validation', () => {
    it('should reject missing required fields', async () => {
      const res = await api.post('/customers', { name: 'No Email' });
      expect(res.status).toBe(400);
    });

    it('should reject invalid email', async () => {
      const res = await api.post('/customers', {
        externalId: 'ext_bad',
        email: 'not-an-email',
        currency: 'USD',
      });
      expect(res.status).toBe(400);
    });
  });

  describe('pagination', () => {
    beforeAll(async () => {
      for (let i = 0; i < 5; i++) {
        await api.post('/customers', {
          externalId: `page_cust_${i}`,
          email: `page${i}@example.com`,
          name: `Page Customer ${i}`,
          currency: 'USD',
        });
      }
    });

    it('should paginate results', async () => {
      const page1 = await api.get('/customers?page=1&limit=2');
      expect(page1.status).toBe(200);
      expect(page1.data.data.length).toBe(2);
      expect(page1.data.meta.total).toBeGreaterThanOrEqual(5);

      const page2 = await api.get('/customers?page=2&limit=2');
      expect(page2.status).toBe(200);
      expect(page2.data.data.length).toBe(2);
      expect(page2.data.data[0].id).not.toBe(page1.data.data[0].id);
    });
  });

  describe('netPaymentTerms', () => {
    it('should store net payment terms on customer', async () => {
      const res = await api.post('/customers', {
        externalId: 'npt_cust',
        email: 'npt@example.com',
        currency: 'USD',
        netPaymentTerms: 30,
      });
      expect(res.status).toBe(201);
      expect(res.data.netPaymentTerms).toBe(30);
    });
  });
});
