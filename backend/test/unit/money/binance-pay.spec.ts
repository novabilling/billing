import { createHmac, createSign, generateKeyPairSync } from 'crypto';
import {
  BinancePayAdapter,
  clearBinanceCertificates,
  fromTradeNo,
  mapBinanceStatus,
  toTradeNo,
} from '../../../src/modules/money/adapters/binance-pay.adapter';
import { ProviderRegistryService } from '../../../src/modules/money/provider-registry.service';

const json = (body: unknown, status = 200) => Promise.resolve({ ok: status < 400, status, json: async () => body } as Response);

describe('BinancePayAdapter', () => {
  const creds = { apiKey: 'bp-key', apiSecret: 'bp-secret' };
  beforeEach(() => clearBinanceCertificates());

  it('signs a v2 order with HMAC-SHA512 and returns the checkout link', async () => {
    const fetch = jest.fn(() => json({ status: 'SUCCESS', code: '000000', data: { prepayId: '298', checkoutUrl: 'https://pay.binance.com/checkout/abc' } }));
    const out = await new BinancePayAdapter(creds, fetch as never).collect({
      reference: 'col_0a1b2c',
      amount: '25.00',
      currency: 'USDT',
      payer: { type: 'crypto', chain: 'BINANCE' },
      description: 'Annual plan',
      notificationUrl: 'https://api.example.com/webhooks/binance_pay/t1/callback',
      callbackUrl: 'https://shop.example.com/thanks',
    });
    const [url, init] = (fetch.mock.calls[0] as unknown) as [string, RequestInit];
    const headers = init.headers as Record<string, string>;
    expect(url).toBe('https://bpay.binanceapi.com/binancepay/openapi/v2/order');
    expect(headers['BinancePay-Certificate-SN']).toBe('bp-key');
    expect(headers['BinancePay-Nonce']).toHaveLength(32);
    const expected = createHmac('sha512', 'bp-secret')
      .update(`${headers['BinancePay-Timestamp']}\n${headers['BinancePay-Nonce']}\n${init.body}\n`)
      .digest('hex')
      .toUpperCase();
    expect(headers['BinancePay-Signature']).toBe(expected);
    expect(JSON.parse(String(init.body))).toMatchObject({
      merchantTradeNo: 'col0a1b2c',
      orderAmount: 25,
      currency: 'USDT',
      webhookUrl: 'https://api.example.com/webhooks/binance_pay/t1/callback',
      returnUrl: 'https://shop.example.com/thanks',
    });
    expect(out).toEqual({ state: 'pending', providerTxnId: '298', providerStatus: 'INITIAL', paymentUrl: 'https://pay.binance.com/checkout/abc' });
  });

  it('refuses coins Binance Pay does not take and reports refused orders', async () => {
    const adapter = new BinancePayAdapter(creds, jest.fn() as never);
    expect(await adapter.collect({ reference: 'c', amount: '1', currency: 'UGX', payer: { type: 'crypto' }, description: 'x' })).toMatchObject({ state: 'failed' });
    const refused = jest.fn(() => json({ status: 'FAIL', code: '400201', errorMessage: 'merchantTradeNo is invalid or duplicated' }));
    expect(
      await new BinancePayAdapter(creds, refused as never).collect({ reference: 'c', amount: '1', currency: 'USDT', payer: { type: 'crypto' }, description: 'x' }),
    ).toEqual({ state: 'failed', failureReason: 'merchantTradeNo is invalid or duplicated' });
  });

  it('settles paid orders only when the amount matches', async () => {
    const query = (data: unknown) => new BinancePayAdapter(creds, jest.fn(() => json({ status: 'SUCCESS', data })) as never);
    expect(await query({ status: 'PAID', orderAmount: '25.00', currency: 'USDT', transactionId: 'T1' }).getCollection('col_0a', null, '25.00')).toMatchObject({
      state: 'succeeded',
      providerTxnId: 'T1',
    });
    expect(await query({ status: 'PAID', orderAmount: '20.00', currency: 'USDT' }).getCollection('col_0a', null, '25.00')).toMatchObject({
      state: 'pending',
      indeterminate: true,
    });
    expect(await query({ status: 'EXPIRED' }).getCollection('col_0a', null, '25')).toMatchObject({ state: 'failed' });
    expect(mapBinanceStatus('REFUNDED')).toEqual({ state: 'pending', indeterminate: true });
    expect(mapBinanceStatus('INITIAL')).toEqual({ state: 'pending' });
  });

  it('verifies notifications with the RSA certificate Binance publishes, and rejects forgeries and replays', async () => {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    const pem = publicKey.export({ type: 'spki', format: 'pem' }).toString();
    const fetch = jest.fn(() => json({ status: 'SUCCESS', data: [{ certSerial: 'SN1', certPublic: pem }] }));
    const adapter = new BinancePayAdapter(creds, fetch as never);
    const body = JSON.stringify({ bizType: 'PAY', bizIdStr: '29383', bizStatus: 'PAY_SUCCESS', data: '{"merchantTradeNo":"col0a1b"}' });
    const ts = String(Date.now());
    const sign = (text: string) => createSign('RSA-SHA256').update(text).sign(privateKey).toString('base64');
    const headers = (signature: string, timestamp = ts) => ({
      'binancepay-timestamp': timestamp,
      'binancepay-nonce': 'n0nce',
      'binancepay-signature': signature,
      'binancepay-certificate-sn': 'SN1',
    });

    expect(await adapter.verifyNotification(body, headers(sign(`${ts}\nn0nce\n${body}\n`)))).toBe(true);
    expect(await adapter.verifyNotification(body.replace('PAY_SUCCESS', 'PAY_CLOSED'), headers(sign(`${ts}\nn0nce\n${body}\n`)))).toBe(false);
    const old = String(Date.now() - 3600_000);
    expect(await adapter.verifyNotification(body, headers(sign(`${old}\nn0nce\n${body}\n`), old))).toBe(false);
    expect(await adapter.verifyNotification(body, { ...headers('x'), 'binancepay-certificate-sn': 'UNKNOWN' })).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(2); // certificate fetched, cached, refetched once for the unknown serial
  });

  it('round-trips our references through merchantTradeNo', () => {
    expect(toTradeNo('col_0f3a9b')).toBe('col0f3a9b');
    expect(fromTradeNo('col0f3a9b')).toBe('col_0f3a9b');
  });
});

describe('Binance and BNB Chain routing', () => {
  const registry = new ProviderRegistryService({} as never);
  const all = ['eversend', 'tron_usdt', 'binance_pay', 'bsc_usdt'].map((providerName, i) => ({ providerName, isActive: true, priority: i + 1 }));
  const db = { paymentProvider: { findMany: jest.fn().mockResolvedValue(all) } };

  it('sends a named chain or Binance account to the connection made for it', async () => {
    expect(await registry.pick(db as never, 'collect', 'crypto', { type: 'crypto', chain: 'BINANCE' }, 'USDT')).toBe('binance_pay');
    expect(await registry.pick(db as never, 'collect', 'crypto', { type: 'crypto', chain: 'BSC' }, 'USDT')).toBe('bsc_usdt');
    expect(await registry.pick(db as never, 'collect', 'crypto', { type: 'crypto', chain: 'TRON' }, 'USDT')).toBe('tron_usdt');
    expect(await registry.pick(db as never, 'collect', 'crypto', { type: 'crypto', chain: 'POLYGON' }, 'USDT')).toBe('eversend');
    expect(await registry.pick(db as never, 'collect', 'crypto', { type: 'crypto' }, 'USDT')).toBe('eversend');
  });
});
