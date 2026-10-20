import { createHmac } from 'crypto';
import { mapNowPaymentsStatus, NowPaymentsAdapter } from '../../../src/modules/money/adapters/nowpayments.adapter';
import { parseParty } from '../../../src/modules/money/party';

const json = (status: number, body: unknown) => Promise.resolve({ ok: status < 400, status, json: async () => body } as Response);

describe('NowPaymentsAdapter', () => {
  const creds = { apiKey: 'np-key', ipnSecret: 'ipn-secret' };

  it('creates a hosted invoice priced in the collection currency', async () => {
    const fetch = jest.fn(() => json(200, { id: 551, invoice_url: 'https://nowpayments.io/payment/?iid=551' }));
    const out = await new NowPaymentsAdapter(creds, fetch as never).collect({
      reference: 'col_9',
      amount: '25.00',
      currency: 'USD',
      payer: { type: 'crypto', payCurrency: 'usdttrc20' },
      description: 'Annual plan',
      notificationUrl: 'https://api.example.com/webhooks/nowpayments/t1/callback',
      callbackUrl: 'https://shop.example.com/thanks',
    });
    const [url, init] = (fetch.mock.calls[0] as unknown) as [string, RequestInit];
    expect(url).toBe('https://api.nowpayments.io/v1/invoice');
    expect((init.headers as Record<string, string>)['x-api-key']).toBe('np-key');
    expect(JSON.parse(String(init.body))).toMatchObject({
      price_amount: 25,
      price_currency: 'usd',
      pay_currency: 'usdttrc20',
      order_id: 'col_9',
      ipn_callback_url: 'https://api.example.com/webhooks/nowpayments/t1/callback',
      success_url: 'https://shop.example.com/thanks',
    });
    expect(out).toMatchObject({ state: 'pending', paymentUrl: 'https://nowpayments.io/payment/?iid=551' });
  });

  it('verifies notifications signed over key-sorted JSON', () => {
    const body = { payment_status: 'finished', order_id: 'col_9', payment_id: 123, price_amount: 25, price_currency: 'usd', fee: { depositFee: 0, currency: 'usdt' } };
    const sorted = { fee: { currency: 'usdt', depositFee: 0 }, order_id: 'col_9', payment_id: 123, payment_status: 'finished', price_amount: 25, price_currency: 'usd' };
    const sig = createHmac('sha512', 'ipn-secret').update(JSON.stringify(sorted)).digest('hex');
    const np = new NowPaymentsAdapter(creds);
    expect(np.verifyNotification(body, sig)).toBe(true);
    expect(np.verifyNotification({ ...body, price_amount: 1 }, sig)).toBe(false);
    expect(np.verifyNotification(body, undefined)).toBe(false);
  });

  it('maps payment statuses, holding underpayments for review', () => {
    expect(mapNowPaymentsStatus('finished')).toEqual({ state: 'succeeded' });
    expect(mapNowPaymentsStatus('confirming')).toEqual({ state: 'pending' });
    expect(mapNowPaymentsStatus('partially_paid')).toEqual({ state: 'pending', indeterminate: true });
    expect(mapNowPaymentsStatus('expired')).toEqual({ state: 'failed' });
    expect(
      new NowPaymentsAdapter(creds).fromPayment({ payment_id: 7, payment_status: 'partially_paid', actually_paid: 10, pay_amount: 25, pay_currency: 'usdttrc20' }),
    ).toMatchObject({ indeterminate: true, providerTxnId: '7', failureReason: 'Underpaid: received 10 of 25 USDTTRC20' });
  });

  it('accepts a crypto payer with an optional coin', () => {
    expect(parseParty({ type: 'crypto', payCurrency: 'BTC' }, 'payer')).toEqual({ type: 'crypto', email: undefined, name: undefined, payCurrency: 'btc' });
    expect(() => parseParty({ type: 'crypto', payCurrency: 'bad coin!' }, 'payer')).toThrow(/coin code/);
  });
});
