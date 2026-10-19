import { clearEversendTokenCache, EversendAdapter } from '../../../src/modules/money/adapters/eversend.adapter';
import { ProviderRegistryService } from '../../../src/modules/money/provider-registry.service';
import { parseParty } from '../../../src/modules/money/party';
import { ProviderAmbiguousError } from '../../../src/modules/money/types';
import { countryOfNumber } from '../../../src/modules/money/msisdn';

const res = (status: number, body: unknown) =>
  Promise.resolve({ ok: status < 400, status, json: async () => body, text: async () => JSON.stringify(body) } as Response);

const token = () => res(200, { token: 'tok', expires: new Date(Date.now() + 3600_000).toISOString() });

const chains = { data: [{ id: 'asset-eth', chain: 'ETHEREUM' }, { id: 'asset-trx', chain: 'TRON' }] };

describe('EversendAdapter', () => {
  const creds = { clientId: 'cid', clientSecret: 'secret' };
  beforeEach(() => clearEversendTokenCache());

  it('creates a deposit address on the requested chain', async () => {
    const fetch = jest
      .fn()
      .mockImplementationOnce(token)
      .mockImplementationOnce(() => res(200, chains))
      .mockImplementationOnce(() => res(200, { data: { address: 'TXyz123', memo: null } }));
    const out = await new EversendAdapter(creds, fetch as never).collect({
      reference: 'col_1',
      amount: '25.00',
      currency: 'USDT',
      payer: { type: 'crypto', chain: 'TRON', name: 'Jane' },
      description: 'Annual plan',
    });

    const [authUrl, authInit] = fetch.mock.calls[0] as [string, RequestInit];
    expect(authUrl).toBe('https://api.eversend.co/v1/auth/token');
    expect(authInit.headers).toMatchObject({ clientId: 'cid', clientSecret: 'secret' });
    expect(fetch.mock.calls[1][0]).toBe('https://api.eversend.co/v1/crypto/assets/USDT');
    const [url, init] = fetch.mock.calls[2] as [string, RequestInit];
    expect(url).toBe('https://api.eversend.co/v1/crypto/addresses');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer tok');
    expect(JSON.parse(String(init.body))).toMatchObject({ assetId: 'asset-trx', ownerName: 'Jane', destinationAddressDescription: 'col_1' });
    expect(out).toEqual({
      state: 'pending',
      providerTxnId: 'TXyz123',
      providerStatus: 'AWAITING_DEPOSIT',
      paymentDetails: { kind: 'crypto_address', coin: 'USDT', chain: 'TRON', address: 'TXyz123', amount: '25.00' },
    });
  });

  it('refuses coins other than its stablecoins and unknown chains', async () => {
    const adapter = new EversendAdapter(creds, jest.fn() as never);
    expect(await adapter.collect({ reference: 'c', amount: '1', currency: 'UGX', payer: { type: 'crypto' }, description: 'x' })).toMatchObject({
      state: 'failed',
      failureReason: expect.stringMatching(/USDT or USDC/),
    });

    const fetch = jest.fn().mockImplementationOnce(token).mockImplementationOnce(() => res(200, chains));
    const out = await new EversendAdapter(creds, fetch as never).collect({
      reference: 'c',
      amount: '1',
      currency: 'USDC',
      payer: { type: 'crypto', chain: 'SOLANA' },
      description: 'x',
    });
    expect(out).toMatchObject({ state: 'failed', failureReason: expect.stringMatching(/no USDC chain "SOLANA".*TRON/) });
  });

  it('settles when settled deposits reach the amount, holds underpayments', async () => {
    const check = async (transactions: unknown[]) => {
      clearEversendTokenCache();
      const fetch = jest.fn().mockImplementationOnce(token).mockImplementationOnce(() => res(200, { data: { transactions } }));
      return new EversendAdapter(creds, fetch as never).getCollection('col_1', 'TXyz123', '25.00');
    };

    expect(await check([])).toMatchObject({ state: 'pending', providerStatus: 'AWAITING_DEPOSIT' });
    expect(await check([{ amount: 25, status: 'pending' }])).toMatchObject({ state: 'pending', providerStatus: 'CONFIRMING' });
    expect(await check([{ amount: 10, status: 'successful' }, { amount: 15, status: 'completed' }])).toMatchObject({
      state: 'succeeded',
      providerStatus: 'RECEIVED',
    });
    expect(await check([{ amount: 26.5, status: 'successful' }])).toMatchObject({ state: 'succeeded', providerStatus: 'OVERPAID_26.5' });
    expect(await check([{ amount: 20, status: 'successful' }])).toMatchObject({
      state: 'pending',
      indeterminate: true,
      failureReason: 'Underpaid: received 20 of 25.00',
    });
    // A second deposit still confirming keeps it open instead of flagging it.
    expect(await check([{ amount: 20, status: 'successful' }, { amount: 5, status: 'pending' }])).toMatchObject({
      state: 'pending',
      providerStatus: 'PARTIAL_20',
    });
    // Money sent out of the address and failed deposits do not count.
    expect(await check([{ amount: 25, status: 'successful', type: 'withdrawal' }, { amount: 25, status: 'failed' }])).toMatchObject({
      state: 'pending',
      providerStatus: 'AWAITING_DEPOSIT',
    });
  });

  it('reports authentication and network failures without moving money', async () => {
    const fetch = jest.fn().mockImplementationOnce(() => res(401, { message: 'Invalid client credentials' }));
    expect(
      await new EversendAdapter(creds, fetch as never).collect({ reference: 'c', amount: '1', currency: 'USDT', payer: { type: 'crypto' }, description: 'x' }),
    ).toMatchObject({ state: 'failed', failureReason: 'Invalid client credentials' });

    const down = jest.fn(() => Promise.reject(new TypeError('fetch failed')));
    expect(
      await new EversendAdapter(creds, down as never).collect({ reference: 'c', amount: '1', currency: 'USDT', payer: { type: 'crypto' }, description: 'x' }),
    ).toMatchObject({ state: 'failed', failureReason: 'Could not reach Eversend: fetch failed' });
  });

  it('parses the chain on a crypto party', () => {
    expect(parseParty({ type: 'crypto', chain: 'tron' }, 'payer')).toMatchObject({ type: 'crypto', chain: 'TRON' });
    expect(() => parseParty({ type: 'crypto', chain: 'tron;drop' }, 'payer')).toThrow(/chain/);
  });
});

describe('crypto routing', () => {
  const registry = new ProviderRegistryService({} as never);
  const configs = ['nowpayments', 'eversend'].map((providerName, i) => ({ providerName, isActive: true, priority: i + 1 }));
  const db = { paymentProvider: { findMany: jest.fn().mockResolvedValue(configs) } };

  it('sends stablecoin collections to Eversend and fiat-priced ones to NOWPayments', async () => {
    expect(await registry.pick(db as never, 'collect', 'crypto', { type: 'crypto' }, 'USDT')).toBe('eversend');
    expect(await registry.pick(db as never, 'collect', 'crypto', { type: 'crypto' }, 'usdc')).toBe('eversend');
    expect(await registry.pick(db as never, 'collect', 'crypto', { type: 'crypto' }, 'UGX')).toBe('nowpayments');
  });

  it('sends USDT on TRON to the watch-only connection when it comes first, and other chains elsewhere', async () => {
    const withTron = ['tron_usdt', 'eversend', 'nowpayments'].map((providerName, i) => ({ providerName, isActive: true, priority: i + 1 }));
    const tdb = { paymentProvider: { findMany: jest.fn().mockResolvedValue(withTron) } };
    expect(await registry.pick(tdb as never, 'collect', 'crypto', { type: 'crypto', chain: 'TRON' }, 'USDT')).toBe('tron_usdt');
    expect(await registry.pick(tdb as never, 'collect', 'crypto', { type: 'crypto', chain: 'ETHEREUM' }, 'USDT')).toBe('eversend');
    expect(await registry.pick(tdb as never, 'collect', 'crypto', { type: 'crypto' }, 'USDC')).toBe('eversend');
    expect(await registry.pick(tdb as never, 'collect', 'crypto', { type: 'crypto' }, 'USD')).toBe('nowpayments');
  });
});

describe('Eversend payouts', () => {
  const creds = { clientId: 'cid', clientSecret: 'secret' };
  beforeEach(() => clearEversendTokenCache());
  const quote = () => res(200, { data: { token: 'q-token', totalFees: 1500 } });

  it('quotes for the exact amount, then pays a mobile money number with our reference', async () => {
    const fetch = jest
      .fn()
      .mockImplementationOnce(token)
      .mockImplementationOnce(quote)
      .mockImplementationOnce(() => res(200, { data: { transaction: { transactionId: 'EV123', status: 'pending' } } }));
    const out = await new EversendAdapter(creds, fetch as never).payout({
      reference: 'pay_1',
      amount: '50000',
      currency: 'KES',
      payee: { type: 'mobile_money', msisdn: '254712345678', name: 'Wanjiku Kamau Njeri' },
      description: 'Refund',
    });

    const [qUrl, qInit] = fetch.mock.calls[1] as [string, RequestInit];
    expect(qUrl).toBe('https://api.eversend.co/v1/payouts/quotation');
    expect(JSON.parse(String(qInit.body))).toEqual({
      sourceWallet: 'KES',
      type: 'momo',
      amount: 50000,
      destinationCountry: 'KE',
      destinationCurrency: 'KES',
      amountType: 'DESTINATION',
    });
    const [pUrl, pInit] = fetch.mock.calls[2] as [string, RequestInit];
    expect(pUrl).toBe('https://api.eversend.co/v1/payouts');
    expect(JSON.parse(String(pInit.body))).toEqual({
      token: 'q-token',
      transactionRef: 'pay_1',
      firstName: 'Wanjiku',
      lastName: 'Kamau Njeri',
      phoneNumber: '+254712345678',
      country: 'KE',
    });
    expect(out).toEqual({ state: 'pending', providerTxnId: 'EV123', providerStatus: 'PENDING', fee: 1500 });
  });

  it('pays bank accounts from another wallet, without claiming a fee in the wrong currency', async () => {
    const fetch = jest
      .fn()
      .mockImplementationOnce(token)
      .mockImplementationOnce(quote)
      .mockImplementationOnce(() => res(201, { data: { transactionId: 'EV9', status: 'successful' } }));
    const out = await new EversendAdapter({ ...creds, payoutSourceWallet: 'usd', contactPhone: '+256700000001' }, fetch as never).payout({
      reference: 'pay_2',
      amount: '1000000',
      currency: 'UGX',
      payee: { type: 'bank', accountName: 'Okello John', accountNumber: '9030001', bankCode: '014', bankName: 'Stanbic', country: 'ug' },
      description: 'Supplier',
    });
    expect(JSON.parse(String((fetch.mock.calls[1] as [string, RequestInit])[1].body))).toMatchObject({ sourceWallet: 'USD', type: 'bank', destinationCountry: 'UG' });
    expect(JSON.parse(String((fetch.mock.calls[2] as [string, RequestInit])[1].body))).toMatchObject({
      phoneNumber: '+256700000001',
      bankCode: '014',
      bankAccountNumber: '9030001',
      bankAccountName: 'Okello John',
    });
    expect(out).toEqual({ state: 'succeeded', providerTxnId: 'EV9', providerStatus: 'SUCCESSFUL' });
  });

  it('refuses before quoting when Eversend would reject the payee', async () => {
    const fetch = jest.fn();
    const adapter = new EversendAdapter(creds, fetch as never);
    const base = { reference: 'p', amount: '1000', currency: 'UGX', description: 'x' };
    expect(await adapter.payout({ ...base, payee: { type: 'mobile_money', msisdn: '0772123456', name: 'Cher' } })).toMatchObject({
      state: 'failed',
      failureReason: expect.stringMatching(/first and last name/),
    });
    expect(await adapter.payout({ ...base, payee: { type: 'bank', accountName: 'A B', accountNumber: '1', bankCode: '1' } })).toMatchObject({
      failureReason: expect.stringMatching(/phone number/),
    });
    expect(await adapter.payout({ ...base, payee: { type: 'paypal', email: 'a@b.co' } })).toMatchObject({ state: 'failed' });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('fails cleanly on a refused quotation and treats a lost payout reply as ambiguous', async () => {
    const payee = { type: 'mobile_money' as const, msisdn: '256772123456', name: 'Jane Doe' };
    const refused = jest.fn().mockImplementationOnce(token).mockImplementationOnce(() => res(400, { message: 'Insufficient balance' }));
    expect(
      await new EversendAdapter(creds, refused as never).payout({ reference: 'p', amount: '1', currency: 'UGX', payee, description: 'x' }),
    ).toEqual({ state: 'failed', failureReason: 'Insufficient balance' });

    clearEversendTokenCache();
    const lost = jest
      .fn()
      .mockImplementationOnce(token)
      .mockImplementationOnce(quote)
      .mockImplementationOnce(() => Promise.reject(new TypeError('socket hang up')));
    await expect(
      new EversendAdapter(creds, lost as never).payout({ reference: 'p', amount: '1', currency: 'UGX', payee, description: 'x' }),
    ).rejects.toBeInstanceOf(ProviderAmbiguousError);

    clearEversendTokenCache();
    const down = jest.fn().mockImplementationOnce(token).mockImplementationOnce(quote).mockImplementationOnce(() => res(502, null));
    expect(
      await new EversendAdapter(creds, down as never).payout({ reference: 'p', amount: '1', currency: 'UGX', payee, description: 'x' }),
    ).toMatchObject({ state: 'pending', indeterminate: true });
  });

  it('checks status by Eversend id, or finds the payout by our reference', async () => {
    const byId = jest.fn().mockImplementationOnce(token).mockImplementationOnce(() => res(200, { data: { transaction: { transactionId: 'EV1', status: 'failed', reason: 'Invalid account' } } }));
    expect(await new EversendAdapter(creds, byId as never).getPayout('pay_1', 'EV1')).toEqual({
      state: 'failed',
      providerTxnId: 'EV1',
      providerStatus: 'FAILED',
      failureReason: 'Invalid account',
    });
    expect(byId.mock.calls[1][0]).toBe('https://api.eversend.co/v1/transactions/EV1');

    clearEversendTokenCache();
    const byRef = jest.fn().mockImplementationOnce(token).mockImplementationOnce(() =>
      res(200, { data: { transactions: [{ transactionRef: 'other', status: 'failed' }, { transactionRef: 'pay_1', transactionId: 'EV2', status: 'successful' }] } }),
    );
    expect(await new EversendAdapter(creds, byRef as never).getPayout('pay_1', null)).toMatchObject({ state: 'succeeded', providerTxnId: 'EV2' });

    clearEversendTokenCache();
    const missing = jest.fn().mockImplementationOnce(token).mockImplementationOnce(() => res(200, { data: { transactions: [] } }));
    expect(await new EversendAdapter(creds, missing as never).getPayout('pay_1', null)).toEqual({ state: 'pending', providerStatus: 'NOT_FOUND_BY_REFERENCE' });
  });

  it('parses a bank payee phone', () => {
    expect(parseParty({ type: 'bank', accountNumber: '1', accountName: 'A B', phone: '+256 700-000001' }, 'payee')).toMatchObject({ phone: '256700000001' });
    expect(() => parseParty({ type: 'bank', accountNumber: '1', accountName: 'A B', phone: 'call me' }, 'payee')).toThrow(/phone/);
  });
});

describe('countryOfNumber', () => {
  it('reads the country from the calling code', () => {
    expect(countryOfNumber('256772123456')).toBe('UG');
    expect(countryOfNumber('254712345678')).toBe('KE');
    expect(countryOfNumber('27821234567')).toBe('ZA');
    expect(countryOfNumber('2567')).toBeUndefined();
  });
});

describe('Eversend mobile money collections', () => {
  const creds = { clientId: 'cid', clientSecret: 'secret' };
  beforeEach(() => clearEversendTokenCache());
  const payer = { type: 'mobile_money' as const, msisdn: '0772123456', name: 'Jane Doe' };

  it('prompts the payer with our reference and passes a one-time code through', async () => {
    const fetch = jest
      .fn()
      .mockImplementationOnce(token)
      .mockImplementationOnce(() => res(200, { data: { transaction: { transactionId: 'EVC1', status: 'pending' } } }));
    const out = await new EversendAdapter(creds, fetch as never).collect({
      reference: 'col_7',
      amount: '20000',
      currency: 'UGX',
      payer,
      description: 'Order 7',
      otp: { pinId: 'pin-1', pin: '123456' },
    });
    const [url, init] = fetch.mock.calls[1] as [string, RequestInit];
    expect(url).toBe('https://api.eversend.co/v1/collections/momo');
    expect(JSON.parse(String(init.body))).toEqual({
      amount: 20000,
      currency: 'UGX',
      country: 'UG',
      phone: '+256772123456',
      transactionRef: 'col_7',
      customer: { name: 'Jane Doe' },
      otp: { pin: '123456', pinId: 'pin-1' },
    });
    expect(out).toEqual({ state: 'pending', providerTxnId: 'EVC1', providerStatus: 'PENDING' });
  });

  it('sends Ghana payers to the redirect page and refuses cleanly on 4xx', async () => {
    const gh = jest
      .fn()
      .mockImplementationOnce(token)
      .mockImplementationOnce(() => res(200, { data: { transactionId: 'EVG', status: 'pending', redirectUrl: 'https://pay.example/gh' } }));
    const out = await new EversendAdapter(creds, gh as never).collect({
      reference: 'col_8',
      amount: '50',
      currency: 'GHS',
      payer: { type: 'mobile_money', msisdn: '233241234567' },
      description: 'x',
      callbackUrl: 'https://shop.example/back',
    });
    expect(JSON.parse(String((gh.mock.calls[1] as [string, RequestInit])[1].body))).toMatchObject({ country: 'GH', redirect_url: 'https://shop.example/back' });
    expect(out).toMatchObject({ state: 'pending', paymentUrl: 'https://pay.example/gh' });

    clearEversendTokenCache();
    const refused = jest.fn().mockImplementationOnce(token).mockImplementationOnce(() => res(400, { message: 'Invalid OTP' }));
    expect(
      await new EversendAdapter(creds, refused as never).collect({ reference: 'c', amount: '1', currency: 'UGX', payer, description: 'x' }),
    ).toMatchObject({ state: 'failed', failureReason: 'Invalid OTP' });

    clearEversendTokenCache();
    const lost = jest.fn().mockImplementationOnce(token).mockImplementationOnce(() => Promise.reject(new TypeError('socket hang up')));
    await expect(
      new EversendAdapter(creds, lost as never).collect({ reference: 'c', amount: '1', currency: 'UGX', payer, description: 'x' }),
    ).rejects.toBeInstanceOf(ProviderAmbiguousError);
  });

  it('checks mobile money collections as transactions, not deposit addresses', async () => {
    const fetch = jest.fn().mockImplementationOnce(token).mockImplementationOnce(() => res(200, { data: { transaction: { transactionId: 'EVC1', status: 'successful' } } }));
    expect(await new EversendAdapter(creds, fetch as never).getCollection('col_7', 'EVC1', '20000', 'mobile_money')).toMatchObject({
      state: 'succeeded',
      providerTxnId: 'EVC1',
    });
    expect(fetch.mock.calls[1][0]).toBe('https://api.eversend.co/v1/transactions/EVC1');
  });

  it('sends the payer a one-time code', async () => {
    const fetch = jest.fn().mockImplementationOnce(token).mockImplementationOnce(() => res(200, { data: { pinId: 'pin-9' } }));
    expect(await new EversendAdapter(creds, fetch as never).requestPayerOtp('0772123456')).toEqual({ pinId: 'pin-9' });
    expect(JSON.parse(String((fetch.mock.calls[1] as [string, RequestInit])[1].body))).toEqual({ phone: '+256772123456' });
  });
});
