import { PesapalProvider } from '../../../src/providers/pesapal.provider';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('PesapalProvider', () => {
  const credentials = {
    consumerKey: 'ck_test',
    consumerSecret: 'cs_test',
    environment: 'sandbox' as const,
  };

  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('registerIpn', () => {
    it('should register an IPN URL and return the ipn_id', async () => {
      // Auth token request
      mockFetch
        .mockResolvedValueOnce({
          json: async () => ({
            token: 'test_token',
            expiryDate: new Date(Date.now() + 3600_000).toISOString(),
          }),
        })
        // RegisterIPN request
        .mockResolvedValueOnce({
          json: async () => ({
            url: 'https://example.com/webhooks/pesapal',
            created_date: '2024-01-01T00:00:00Z',
            ipn_id: 'fe078e53-78da-4a83-aa89-e7ded5c456e6',
            ipn_status: 1,
            ipn_status_description: 'Active',
            ipn_notification_type_description: 'POST',
          }),
        });

      const provider = new PesapalProvider(credentials);
      const ipnId = await provider.registerIpn('https://example.com/webhooks/pesapal');

      expect(ipnId).toBe('fe078e53-78da-4a83-aa89-e7ded5c456e6');

      // Verify the RegisterIPN call
      const [registerUrl, registerOptions] = mockFetch.mock.calls[1];
      expect(registerUrl).toContain('/api/URLSetup/RegisterIPN');
      expect(JSON.parse(registerOptions.body)).toMatchObject({
        url: 'https://example.com/webhooks/pesapal',
        ipn_notification_type: 'POST',
      });
      expect(registerOptions.headers['Authorization']).toBe('Bearer test_token');
    });

    it('should throw if Pesapal returns no ipn_id', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: async () => ({
            token: 'test_token',
            expiryDate: new Date(Date.now() + 3600_000).toISOString(),
          }),
        })
        .mockResolvedValueOnce({
          json: async () => ({
            error: { message: 'Invalid credentials' },
          }),
        });

      const provider = new PesapalProvider(credentials);
      await expect(provider.registerIpn('https://example.com/webhooks/pesapal')).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw with default message when error field is absent', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: async () => ({
            token: 'test_token',
            expiryDate: new Date(Date.now() + 3600_000).toISOString(),
          }),
        })
        .mockResolvedValueOnce({
          json: async () => ({}),
        });

      const provider = new PesapalProvider(credentials);
      await expect(provider.registerIpn('https://example.com/webhooks/pesapal')).rejects.toThrow(
        'Pesapal IPN registration failed: no ipn_id returned',
      );
    });
  });

  describe('charge with ipnId', () => {
    it('should send ipnId as notification_id when present in credentials', async () => {
      const credsWithIpn = { ...credentials, ipnId: 'test-ipn-uuid' };

      mockFetch
        .mockResolvedValueOnce({
          json: async () => ({
            token: 'test_token',
            expiryDate: new Date(Date.now() + 3600_000).toISOString(),
          }),
        })
        .mockResolvedValueOnce({
          json: async () => ({
            status: '200',
            order_tracking_id: 'order-123',
            redirect_url: 'https://pesapal.com/pay/order-123',
          }),
        });

      const provider = new PesapalProvider(credsWithIpn);
      const result = await provider.charge({
        amount: 100,
        currency: 'KES',
        email: 'customer@example.com',
        reference: 'inv-001',
      });

      expect(result.success).toBe(true);
      const [, orderOptions] = mockFetch.mock.calls[1];
      expect(JSON.parse(orderOptions.body)).toMatchObject({ notification_id: 'test-ipn-uuid' });
    });

    it('should send empty string as notification_id when ipnId is absent', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: async () => ({
            token: 'test_token',
            expiryDate: new Date(Date.now() + 3600_000).toISOString(),
          }),
        })
        .mockResolvedValueOnce({
          json: async () => ({
            status: '200',
            order_tracking_id: 'order-456',
            redirect_url: 'https://pesapal.com/pay/order-456',
          }),
        });

      const provider = new PesapalProvider(credentials);
      await provider.charge({
        amount: 100,
        currency: 'KES',
        email: 'customer@example.com',
        reference: 'inv-002',
      });

      const [, orderOptions] = mockFetch.mock.calls[1];
      expect(JSON.parse(orderOptions.body)).toMatchObject({ notification_id: '' });
    });
  });
});
