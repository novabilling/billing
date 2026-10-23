import { PayPalProvider } from '../../../src/providers/paypal.provider';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const ok = (body: unknown) => ({ ok: true, status: 200, json: async () => body });
const fail = (status: number, body: unknown) => ({ ok: false, status, json: async () => body });

const headers = JSON.stringify({
  authAlgo: 'SHA256withRSA',
  certUrl: 'https://api.paypal.com/cert',
  transmissionId: 'tx-1',
  transmissionSig: 'c2lnbmF0dXJl==',
  transmissionTime: '2026-10-19T10:00:00Z',
});

describe('PayPalProvider.handleWebhook', () => {
  const provider = new PayPalProvider({
    clientId: 'id',
    clientSecret: 'secret',
    webhookId: 'WH-1',
    environment: 'sandbox',
  });

  beforeEach(() => mockFetch.mockReset());

  const token = () => mockFetch.mockResolvedValueOnce(ok({ access_token: 'tok' }));
  const verified = () => mockFetch.mockResolvedValueOnce(ok({ verification_status: 'SUCCESS' }));

  it('rejects notifications without transmission headers', async () => {
    await expect(provider.handleWebhook({ event_type: 'PAYMENT.CAPTURE.COMPLETED' }, '')).rejects.toThrow(
      /missing transmission headers/,
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('rejects notifications PayPal does not verify', async () => {
    token();
    mockFetch.mockResolvedValueOnce(ok({ verification_status: 'FAILURE' }));
    await expect(provider.handleWebhook({ event_type: 'PAYMENT.CAPTURE.COMPLETED' }, headers)).rejects.toThrow(
      /verification failed/,
    );
  });

  it('sends the transmission headers and webhook id to PayPal for verification', async () => {
    token();
    verified();
    await provider.handleWebhook({ event_type: 'PAYMENT.CAPTURE.PENDING', resource: {} }, headers);
    const body = JSON.parse(mockFetch.mock.calls[1][1].body);
    expect(mockFetch.mock.calls[1][0]).toContain('/v1/notifications/verify-webhook-signature');
    expect(body).toMatchObject({ transmission_sig: 'c2lnbmF0dXJl==', webhook_id: 'WH-1' });
  });

  it('captures an approved order and reports success only once captured', async () => {
    token();
    verified();
    token();
    mockFetch.mockResolvedValueOnce(
      ok({
        status: 'COMPLETED',
        purchase_units: [{ payments: { captures: [{ id: 'CAP-1', status: 'COMPLETED', amount: { value: '25.00', currency_code: 'USD' } }] } }],
      }),
    );

    const result = await provider.handleWebhook(
      {
        event_type: 'CHECKOUT.ORDER.APPROVED',
        resource: { id: 'ORDER-1', purchase_units: [{ reference_id: 'inv_1', amount: { value: '25.00', currency_code: 'USD' } }] },
      },
      headers,
    );

    expect(mockFetch.mock.calls[3][0]).toContain('/v2/checkout/orders/ORDER-1/capture');
    expect(mockFetch.mock.calls[3][1].headers['PayPal-Request-Id']).toBe('capture-ORDER-1');
    expect(result).toEqual({ status: 'succeeded', transactionId: 'ORDER-1', amount: 25, currency: 'USD', invoiceId: 'inv_1', referenceVerified: true });
  });

  it('keeps the payment pending when the capture fails', async () => {
    token();
    verified();
    token();
    mockFetch.mockResolvedValueOnce(fail(422, { details: [{ issue: 'INSTRUMENT_DECLINED' }] }));

    const result = await provider.handleWebhook(
      { event_type: 'CHECKOUT.ORDER.APPROVED', resource: { id: 'ORDER-2', purchase_units: [] } },
      headers,
    );
    expect(result.status).toBe('pending');
  });

  it('maps capture events back to the order id', async () => {
    token();
    verified();
    const result = await provider.handleWebhook(
      {
        event_type: 'PAYMENT.CAPTURE.COMPLETED',
        resource: {
          id: 'CAP-9',
          amount: { value: '10.00', currency_code: 'EUR' },
          supplementary_data: { related_ids: { order_id: 'ORDER-9' } },
        },
      },
      headers,
    );
    expect(result).toMatchObject({ status: 'succeeded', transactionId: 'ORDER-9', amount: 10, currency: 'EUR' });
  });
});

describe('paypalId', () => {
  it('passes PayPal ids and refuses anything that could change the request path', () => {
    const { paypalId } = jest.requireActual('../../../src/providers/paypal.provider');
    expect(paypalId('5O190127TN364715T')).toBe('5O190127TN364715T');
    for (const bad of ['../v1/oauth2/token', 'abc/capture', 'x?y=1', 'a b', '', '@evil.com', undefined]) {
      expect(() => paypalId(bad)).toThrow('Invalid PayPal id');
    }
  });
});
