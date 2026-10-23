import { createHmac } from 'crypto';
import { StripeProvider } from '../../../src/providers/stripe.provider';
import { PaystackProvider } from '../../../src/providers/paystack.provider';
import { FlutterwaveProvider } from '../../../src/providers/flutterwave.provider';
import { PayUProvider } from '../../../src/providers/payu.provider';
import { DpoProvider } from '../../../src/providers/dpo.provider';

const mockFetch = jest.fn();
global.fetch = mockFetch as any;
const json = (body: unknown, status = 200) => ({ ok: status < 400, status, json: async () => body, text: async () => JSON.stringify(body) });

beforeEach(() => mockFetch.mockReset());

describe('Stripe webhooks', () => {
  const secret = 'whsec_test';
  const forged = {
    type: 'checkout.session.completed',
    data: { object: { id: 'cs_1', amount_total: 4900, currency: 'usd', metadata: { reference: 'inv_1' } } },
  };
  const sign = (body: string, t = Math.floor(Date.now() / 1000)) =>
    `t=${t},v1=${createHmac('sha256', secret).update(`${t}.${body}`).digest('hex')}`;

  it('rejects a notification with no signature (the forged "paid" event)', async () => {
    const stripe = new StripeProvider({ secretKey: 'sk', webhookSecret: secret });
    await expect(stripe.handleWebhook(forged, '', JSON.stringify(forged))).rejects.toThrow('Unsigned');
  });

  it('rejects everything when no webhook secret is configured', async () => {
    const stripe = new StripeProvider({ secretKey: 'sk', webhookSecret: '' });
    const raw = JSON.stringify(forged);
    await expect(stripe.handleWebhook(forged, sign(raw), raw)).rejects.toThrow('not configured');
  });

  it('rejects a bad or stale signature and accepts a valid one', async () => {
    const stripe = new StripeProvider({ secretKey: 'sk', webhookSecret: secret });
    const raw = JSON.stringify(forged);
    await expect(stripe.handleWebhook(forged, 't=1,v1=00', raw)).rejects.toThrow();
    await expect(stripe.handleWebhook(forged, sign(raw, Math.floor(Date.now() / 1000) - 3600), raw)).rejects.toThrow('too old');
    await expect(stripe.handleWebhook(forged, sign(raw), raw)).resolves.toMatchObject({ status: 'succeeded', referenceVerified: true });
  });
});

describe('Paystack webhooks', () => {
  it('verifies the HMAC over the raw body', async () => {
    const paystack = new PaystackProvider({ publicKey: 'pk', secretKey: 'sk_paystack' });
    const payload = { event: 'charge.success', data: { status: 'success', reference: 'pay_1', amount: 4900, currency: 'NGN' } };
    // Byte-for-byte what Paystack sent, which may differ from JSON.stringify of the parsed body.
    const raw = '{"event":"charge.success","data":{"status":"success","reference":"pay_1","amount":4900,"currency":"NGN"}}  ';
    const sig = createHmac('sha512', 'sk_paystack').update(raw).digest('hex');
    await expect(paystack.handleWebhook(payload, sig, raw)).resolves.toMatchObject({ status: 'succeeded', invoiceId: 'pay_1' });
    await expect(paystack.handleWebhook(payload, 'bad', raw)).rejects.toThrow();
    await expect(paystack.handleWebhook(payload, '', raw)).rejects.toThrow();
  });
});

describe('Flutterwave webhooks', () => {
  const payload = { event: 'charge.completed', data: { id: 123, status: 'successful', amount: 49, currency: 'NGN', tx_ref: 'inv_1' } };

  it('accepts nothing without a configured secret hash', async () => {
    const fw = new FlutterwaveProvider({ publicKey: 'pk', secretKey: 'sk', encryptionKey: 'ek' });
    await expect(fw.handleWebhook(payload, 'anything')).rejects.toThrow('not configured');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('rejects a wrong verif-hash', async () => {
    const fw = new FlutterwaveProvider({ publicKey: 'pk', secretKey: 'sk', encryptionKey: 'ek', secretHash: 'h' });
    await expect(fw.handleWebhook(payload, 'nope')).rejects.toThrow('Invalid');
  });

  it("takes the outcome, amount and reference from Flutterwave's verify API, not the payload", async () => {
    const fw = new FlutterwaveProvider({ publicKey: 'pk', secretKey: 'sk', encryptionKey: 'ek', secretHash: 'h' });
    mockFetch.mockResolvedValue(json({ data: { status: 'successful', amount: 1, currency: 'NGN', tx_ref: 'pay_real' } }));
    const result = await fw.handleWebhook(payload, 'h');
    expect(mockFetch.mock.calls[0][0]).toContain('/transactions/123/verify');
    expect(result).toMatchObject({ status: 'succeeded', amount: 1, invoiceId: 'pay_real', referenceVerified: true });
  });
});

describe('PayU IPNs (unsigned)', () => {
  it('ignores the state in the notification and asks PayU', async () => {
    const payu = new PayUProvider({ apiKey: 'a', safeKey: 's' } as any);
    mockFetch.mockResolvedValue(json({ return: { transactionState: 'FAILED', basket: { amountInCents: 4900, currencyCode: 'ZAR' } } }));
    const forged = { MerchantReference: 'pay_1', TransactionState: 'SUCCESSFUL', AmountInCents: 4900, CurrencyCode: 'ZAR' };
    const result = await payu.handleWebhook(forged, '');
    expect(mockFetch).toHaveBeenCalled();
    expect(result.status).toBe('failed');
  });
});

describe('DPO callbacks (unsigned)', () => {
  it('escapes the token in the verify request and does not trust the CompanyRef sent', async () => {
    const dpo = new DpoProvider({ companyToken: 'ct', serviceType: '1' } as any);
    mockFetch.mockResolvedValue({ ok: true, status: 200, text: async () => '<API3G><Result>000</Result><TransactionApproval>00</TransactionApproval><TransactionAmount>49</TransactionAmount><TransactionCurrency>USD</TransactionCurrency></API3G>' });
    const result = await dpo.handleWebhook({ TransToken: 'tok</TransactionToken><Request>x', CompanyRef: 'someone_elses_invoice' }, '');
    const body = mockFetch.mock.calls[0][1].body as string;
    expect(body).toContain('tok&lt;/TransactionToken&gt;&lt;Request&gt;x');
    expect(result).toMatchObject({ status: 'succeeded', invoiceId: undefined, referenceVerified: false });
  });

  it('keeps a pending DPO transaction pending (it used to be reported as failed)', async () => {
    const dpo = new DpoProvider({ companyToken: 'ct', serviceType: '1' } as any);
    mockFetch.mockResolvedValue({ ok: true, status: 200, text: async () => '<API3G><Result>000</Result><TransactionApproval>01</TransactionApproval></API3G>' });
    expect((await dpo.handleWebhook({ TransToken: 'tok' }, '')).status).toBe('pending');
  });
});
