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

  describe('getAccessToken (via registerIpn)', () => {
    it('should throw when auth request returns a non-2xx status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({}),
      });

      const provider = new PesapalProvider(credentials);
      await expect(provider.registerIpn('https://example.com/webhooks/pesapal')).rejects.toThrow(
        'Pesapal authentication failed: 401 Unauthorized',
      );
    });

    it('should throw with API error message when token is missing from auth response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          error: { message: 'Invalid consumer key' },
        }),
      });

      const provider = new PesapalProvider(credentials);
      await expect(provider.registerIpn('https://example.com/webhooks/pesapal')).rejects.toThrow(
        'Invalid consumer key',
      );
    });

    it('should throw with top-level message when token is missing and error object is absent', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Bad credentials' }),
      });

      const provider = new PesapalProvider(credentials);
      await expect(provider.registerIpn('https://example.com/webhooks/pesapal')).rejects.toThrow(
        'Bad credentials',
      );
    });

    it('should throw default message when auth response has no token and no error details', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const provider = new PesapalProvider(credentials);
      await expect(provider.registerIpn('https://example.com/webhooks/pesapal')).rejects.toThrow(
        'Pesapal authentication failed: no token returned',
      );
    });
  });

  describe('registerIpn', () => {
    it('should register an IPN URL and return the ipn_id', async () => {
      // Auth token request
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
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
          ok: true,
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
          ok: true,
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
          ok: true,
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
          ok: true,
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

  describe('charge — success and error responses', () => {
    const credsWithIpn = { ...credentials, ipnId: 'test-ipn-uuid' };

    const authMock = {
      ok: true,
      json: async () => ({
        token: 'test_token',
        expiryDate: new Date(Date.now() + 3600_000).toISOString(),
      }),
    };

    it('should return success when Pesapal responds with string status "200" and order_tracking_id', async () => {
      mockFetch
        .mockResolvedValueOnce(authMock)
        .mockResolvedValueOnce({
          json: async () => ({
            status: '200',
            order_tracking_id: 'track-001',
            redirect_url: 'https://pesapal.com/pay/track-001',
            error: null,
          }),
        });

      const provider = new PesapalProvider(credsWithIpn);
      const result = await provider.charge({
        amount: 10,
        currency: 'USD',
        email: 'customer@example.com',
        reference: 'inv-usd-10',
      });

      expect(result.success).toBe(true);
      expect(result.paymentUrl).toBe('https://pesapal.com/pay/track-001');
      expect(result.transactionId).toBe('track-001');
    });

    it('should return success when Pesapal responds with numeric status 200 and order_tracking_id', async () => {
      mockFetch
        .mockResolvedValueOnce(authMock)
        .mockResolvedValueOnce({
          json: async () => ({
            status: 200,
            order_tracking_id: 'track-002',
            redirect_url: 'https://pesapal.com/pay/track-002',
            error: null,
          }),
        });

      const provider = new PesapalProvider(credsWithIpn);
      const result = await provider.charge({
        amount: 10,
        currency: 'USD',
        email: 'customer@example.com',
        reference: 'inv-usd-10b',
      });

      expect(result.success).toBe(true);
      expect(result.transactionId).toBe('track-002');
    });

    it('should return failure with error.message when Pesapal returns "Transaction amount exceeds limit" via error object', async () => {
      mockFetch
        .mockResolvedValueOnce(authMock)
        .mockResolvedValueOnce({
          json: async () => ({
            status: '200',
            order_tracking_id: null,
            redirect_url: null,
            error: {
              error_type: 'transaction_limit',
              code: 'E500',
              message: 'Transaction amount exceeds limit.Contact support for assistance',
            },
            message: null,
          }),
        });

      const provider = new PesapalProvider(credsWithIpn);
      const result = await provider.charge({
        amount: 10,
        currency: 'USD',
        email: 'customer@example.com',
        reference: 'inv-usd-10c',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'Transaction amount exceeds limit.Contact support for assistance',
      );
    });

    it('should return failure with top-level message when Pesapal returns error via message field', async () => {
      mockFetch
        .mockResolvedValueOnce(authMock)
        .mockResolvedValueOnce({
          json: async () => ({
            status: '400',
            message: 'Transaction amount exceeds limit.Contact support for assistance',
            error: null,
          }),
        });

      const provider = new PesapalProvider(credsWithIpn);
      const result = await provider.charge({
        amount: 10,
        currency: 'USD',
        email: 'customer@example.com',
        reference: 'inv-usd-10d',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'Transaction amount exceeds limit.Contact support for assistance',
      );
    });

    it('should send amount rounded to 2 decimal places in the request body', async () => {
      mockFetch
        .mockResolvedValueOnce(authMock)
        .mockResolvedValueOnce({
          json: async () => ({
            status: '200',
            order_tracking_id: 'track-003',
            redirect_url: 'https://pesapal.com/pay/track-003',
          }),
        });

      const provider = new PesapalProvider(credsWithIpn);
      await provider.charge({
        amount: 10.999,
        currency: 'USD',
        email: 'customer@example.com',
        reference: 'inv-decimal',
      });

      const [, orderOptions] = mockFetch.mock.calls[1];
      const body = JSON.parse(orderOptions.body);
      expect(body.amount).toBe(11.0);
    });

    it('should include Accept header in the SubmitOrderRequest call', async () => {
      mockFetch
        .mockResolvedValueOnce(authMock)
        .mockResolvedValueOnce({
          json: async () => ({
            status: '200',
            order_tracking_id: 'track-004',
            redirect_url: 'https://pesapal.com/pay/track-004',
          }),
        });

      const provider = new PesapalProvider(credsWithIpn);
      await provider.charge({
        amount: 10,
        currency: 'USD',
        email: 'customer@example.com',
        reference: 'inv-headers',
      });

      const [, orderOptions] = mockFetch.mock.calls[1];
      expect(orderOptions.headers['Accept']).toBe('application/json');
    });

    it('should return fallback error message when both error.message and message are absent', async () => {
      mockFetch
        .mockResolvedValueOnce(authMock)
        .mockResolvedValueOnce({
          json: async () => ({
            status: '400',
            error: null,
            message: null,
          }),
        });

      const provider = new PesapalProvider(credsWithIpn);
      const result = await provider.charge({
        amount: 10,
        currency: 'USD',
        email: 'customer@example.com',
        reference: 'inv-fallback',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Order submission failed');
    });
  });
});
