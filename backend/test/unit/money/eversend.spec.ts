import { clearEversendTokenCache, EversendAdapter } from '../../../src/modules/money/adapters/eversend.adapter';
import { ProviderRegistryService } from '../../../src/modules/money/provider-registry.service';
import { parseParty } from '../../../src/modules/money/party';

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
});
