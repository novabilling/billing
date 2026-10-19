/**
 * Watch-only USDT on TRON against a real tenant database: unique amounts,
 * matching confirmed transfers, expiry and manual assignment. TronGrid is
 * scripted. See ledger.integration.spec.ts for setup.
 */
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma-tenant/client';
import { MoneyService } from '../../src/modules/money/money.service';
import { isTronAddress, resetTronScanThrottle, TronUsdtAdapter } from '../../src/modules/money/adapters/tron-usdt.adapter';
import { WalletsService } from '../../src/modules/wallets/wallets.service';
import { createMockQueue } from '../helpers/mock-queue';

const url = process.env.LEDGER_TEST_DATABASE_URL;
const describeDb = url ? describe : describe.skip;

const MERCHANT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
const USDT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

describeDb('USDT on TRON, watch-only (postgres)', () => {
  let db: PrismaClient;
  let adapter: TronUsdtAdapter;
  let transfers: Record<string, unknown>[] = [];
  let tx = 0;
  const fetch = jest.fn(async () => ({ ok: true, status: 200, json: async () => ({ data: transfers, meta: {} }) }) as unknown as Response);
  const registry = { get: jest.fn(async () => adapter), pick: jest.fn(async () => 'tron_usdt'), assertNetwork: jest.fn() };
  const money = new MoneyService(registry as never, new WalletsService(createMockQueue() as never), { client: {} } as never, createMockQueue() as never);
  const tenant = { id: 't1', settings: { money: { collections: true } } };

  /** A confirmed transfer of `amount` USDT to the merchant, `secondsAgo` before now. */
  const send = (amount: string, secondsAgo = 0, to = MERCHANT) => {
    const [whole, frac = ''] = amount.split('.');
    const value = BigInt(whole) * 1_000_000n + BigInt((frac + '000000').slice(0, 6));
    const hash = `tx${++tx}`;
    transfers.push({
      transaction_id: hash,
      block_timestamp: Date.now() - secondsAgo * 1000,
      from: 'TPayer',
      to,
      type: 'Transfer',
      value: value.toString(),
      token_info: { address: USDT, decimals: 6 },
    });
    return hash;
  };
  const collect = async (amount: string) =>
    money.createCollection(db, tenant, { amount, currency: 'USDT', payer: { type: 'crypto', chain: 'TRON' } });
  const refresh = async (id: string) => {
    resetTronScanThrottle();
    return money.refresh(db, 't1', id);
  };

  beforeAll(() => {
    db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url! }) });
  });
  afterAll(() => db.$disconnect());

  beforeEach(async () => {
    jest.clearAllMocks();
    transfers = [];
    resetTronScanThrottle();
    await db.$executeRawUnsafe(`TRUNCATE "MoneyIntent", "CryptoAmountClaim", "CryptoDeposit" CASCADE`);
    adapter = new TronUsdtAdapter({ address: MERCHANT }, db, fetch as never);
  });

  it('accepts real TRON addresses only', () => {
    expect(isTronAddress(MERCHANT)).toBe(true);
    expect(isTronAddress('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6u')).toBe(false);
    expect(isTronAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')).toBe(false);
  });

  it('asks each open collection for a different amount and settles the one paid', async () => {
    const a = await collect('25');
    const b = await collect('25');
    expect(a.status).toBe('processing');
    const amountA = a.paymentDetails!.amount;
    const amountB = b.paymentDetails!.amount;
    expect(amountA).toMatch(/^25\.00\d{1,2}$/);
    expect(amountA).not.toBe(amountB);
    expect(a.paymentDetails).toMatchObject({ coin: 'USDT', chain: 'TRON', address: MERCHANT });

    const hash = send(amountA);
    send(amountA); // a second payment of the same amount never pays twice
    expect(await refresh(a.id)).toMatchObject({ status: 'succeeded', providerTransactionId: hash, providerStatus: 'RECEIVED' });
    expect(await refresh(b.id)).toMatchObject({ status: 'processing' });
    expect(await db.cryptoDeposit.count({ where: { status: 'UNMATCHED' } })).toBe(1);

    // Rescanning the same transfers records nothing new.
    resetTronScanThrottle();
    await adapter.scan();
    expect(await db.cryptoDeposit.count()).toBe(2);
  });

  it('matches a payment without the tail when only one collection asked for that amount', async () => {
    const c = await collect('10');
    const hash = send('10');
    expect(await refresh(c.id)).toMatchObject({ status: 'succeeded', providerTransactionId: hash });
  });

  it('leaves an ambiguous payment for a person to assign', async () => {
    const a = await collect('40');
    const b = await collect('40');
    send('40');
    expect(await refresh(a.id)).toMatchObject({ status: 'processing' });

    const { data } = await money.listCryptoDeposits(db, { status: 'unmatched' });
    expect(data).toHaveLength(1);
    const settled = await money.assignCryptoDeposit(db, 't1', data[0].id, b.id);
    expect(settled).toMatchObject({ status: 'succeeded', providerStatus: 'ASSIGNED_40' });
    await expect(money.assignCryptoDeposit(db, 't1', data[0].id, a.id)).rejects.toThrow(/already paid/);
    expect((await money.listCryptoDeposits(db, {})).data[0]).toMatchObject({ status: 'assigned', collectionId: b.id });
  });

  it('expires unpaid collections and keeps late or early payments unmatched', async () => {
    send('7', 600); // sent before the collection existed
    const c = await collect('7');
    const claim = await db.cryptoAmountClaim.findFirstOrThrow();
    expect(await refresh(c.id)).toMatchObject({ status: 'processing' });

    await db.cryptoAmountClaim.update({ where: { id: claim.id }, data: { expiresAt: new Date(Date.now() - 10 * 60_000) } });
    expect(await refresh(c.id)).toMatchObject({ status: 'failed', providerStatus: 'EXPIRED' });

    send(c.paymentDetails!.amount);
    resetTronScanThrottle();
    await adapter.scan();
    expect(await db.cryptoDeposit.count({ where: { status: 'UNMATCHED' } })).toBe(2);
  });

  it('refuses amounts it cannot tell apart and other coins', async () => {
    const odd = await money.createCollection(db, tenant, { amount: '5', currency: 'USDC', payer: { type: 'crypto' } });
    expect(odd).toMatchObject({ status: 'failed', failureReason: expect.stringMatching(/collects USDT/) });
    await Promise.all(Array.from({ length: 99 }, () => collect('3')));
    expect(await collect('3')).toMatchObject({ status: 'failed', failureReason: expect.stringMatching(/Too many open/) });
  });
});
