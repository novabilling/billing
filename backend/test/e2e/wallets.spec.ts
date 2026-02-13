import { registerTenant, waitForApi, createApiClient, TestTenant } from './setup';

jest.setTimeout(60_000);

beforeAll(() => waitForApi(), 30_000);

describe('Wallets E2E', () => {
  let tenant: TestTenant;
  let api: ReturnType<typeof createApiClient>;
  let customerId: string;

  beforeAll(async () => {
    tenant = await registerTenant('wallets');
    api = createApiClient(tenant.apiKey);

    const cust = await api.post('/customers', {
      externalId: 'wallet_cust_1',
      email: 'wallet-cust@example.com',
      name: 'Wallet Customer',
      currency: 'USD',
    });
    customerId = cust.data.id;
  });

  describe('wallet lifecycle', () => {
    let walletId: string;

    it('POST /wallets — should create a wallet', async () => {
      const res = await api.post('/wallets', {
        customerId,
        currency: 'USD',
        name: 'Main Wallet',
      });

      expect(res.status).toBe(201);
      expect(res.data.id).toBeDefined();
      expect(res.data.customerId).toBe(customerId);
      expect(res.data.currency).toBe('USD');
      expect(res.data.status).toBe('ACTIVE');
      walletId = res.data.id;
    });

    it('GET /wallets — should list wallets', async () => {
      const res = await api.get('/wallets');
      expect(res.status).toBe(200);
      expect(res.data.data).toBeDefined();
      expect(res.data.data.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /wallets/:id — should return wallet', async () => {
      const res = await api.get(`/wallets/${walletId}`);
      expect(res.status).toBe(200);
      expect(res.data.id).toBe(walletId);
    });

    it('POST /wallets/transactions — should top up wallet (purchased)', async () => {
      const res = await api.post('/wallets/transactions', {
        walletId,
        paidCredits: 100,
      });
      expect(res.ok).toBe(true);
      expect(res.data).toBeDefined();
    });

    it('POST /wallets/transactions — should top up wallet (granted)', async () => {
      const res = await api.post('/wallets/transactions', {
        walletId,
        grantedCredits: 50,
      });
      expect(res.ok).toBe(true);
    });

    it('GET /wallets/:id — should reflect balance after top-ups', async () => {
      const res = await api.get(`/wallets/${walletId}`);
      expect(res.status).toBe(200);
      expect(Number(res.data.balance)).toBeGreaterThanOrEqual(150);
    });

    it('GET /wallets/:id/transactions — should list transactions', async () => {
      const res = await api.get(`/wallets/${walletId}/transactions`);
      expect(res.status).toBe(200);
      expect(res.data.data).toBeDefined();
      expect(res.data.data.length).toBeGreaterThanOrEqual(2);
    });

    it('DELETE /wallets/:id — should terminate wallet', async () => {
      const res = await api.del(`/wallets/${walletId}`);
      expect(res.status).toBe(200);
    });

    it('GET /wallets/:id — should show TERMINATED status', async () => {
      const res = await api.get(`/wallets/${walletId}`);
      expect(res.status).toBe(200);
      expect(res.data.status).toBe('TERMINATED');
    });
  });

  describe('filter by customer', () => {
    it('GET /wallets?customerId — should filter', async () => {
      const res = await api.get(`/wallets?customerId=${customerId}`);
      expect(res.status).toBe(200);
      res.data.data.forEach((w: any) => {
        expect(w.customerId).toBe(customerId);
      });
    });
  });
});
