/**
 * Collections, payouts and transfers against a real tenant database, with a
 * scripted provider. See ledger.integration.spec.ts for setup.
 */
import { ConflictException } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma-tenant/client';
import { MoneyService } from '../../src/modules/money/money.service';
import { MoneyProvider, ProviderAmbiguousError } from '../../src/modules/money/types';
import { WalletsService } from '../../src/modules/wallets/wallets.service';
import { LedgerService } from '../../src/modules/ledger/ledger.service';
import { LedgerProjectorService } from '../../src/modules/ledger/ledger-projector.service';
import { createMockQueue } from '../helpers/mock-queue';

const url = process.env.LEDGER_TEST_DATABASE_URL;
const describeDb = url ? describe : describe.skip;

describeDb('money movement (postgres)', () => {
  let db: PrismaClient;
  const queue = createMockQueue();
  const provider = {
    name: 'fake',
    capabilities: { collect: ['mobile_money', 'hosted'], payout: ['mobile_money', 'bank'], balance: false, verifyPayee: false },
    collect: jest.fn(),
    getCollection: jest.fn(),
    payout: jest.fn(),
    getPayout: jest.fn(),
  } satisfies MoneyProvider;
  const registry = { get: jest.fn(async () => provider), pick: jest.fn(async () => 'fake') };
  const money = new MoneyService(registry as never, new WalletsService(createMockQueue() as never), { client: {} } as never, queue as never);
  const tenant = {
    id: 't1',
    settings: {
      money: {
        collections: true,
        payouts: true,
        transfers: true,
        payoutApprovalThreshold: { UGX: '1000000' },
        payoutDailyLimit: { UGX: '3000000' },
      },
    },
  };
  const mm = { type: 'mobile_money', msisdn: '256771234567' };

  const wallet = async (id: string) => db.wallet.findUniqueOrThrow({ where: { id } });
  const balance = async (id: string) => Number((await wallet(id)).balance);

  beforeAll(() => {
    db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url! }) });
  });
  afterAll(() => db.$disconnect());

  beforeEach(async () => {
    jest.clearAllMocks();
    await db.$executeRawUnsafe(`
      TRUNCATE "MoneyIntent", "LedgerLine", "LedgerEntry", "LedgerAccount", "LedgerCursor",
        "WalletTransaction", "Wallet", "Customer" CASCADE`);
    await db.customer.create({ data: { id: 'cus_1', externalId: 'c1', email: 'c@example.com', currency: 'UGX' } });
    await db.wallet.create({ data: { id: 'wal_a', customerId: 'cus_1', currency: 'UGX' } });
    await db.wallet.create({ data: { id: 'wal_b', customerId: 'cus_1', currency: 'UGX' } });
  });

  const fund = async (walletId: string, amount: number) => {
    provider.collect.mockResolvedValueOnce({ state: 'succeeded', providerTxnId: `fund-${walletId}-${amount}` });
    await money.createCollection(db, tenant, { amount, currency: 'UGX', payer: mm, walletId });
  };

  describe('collections', () => {
    it('credits the target wallet exactly once, however many confirmations arrive', async () => {
      provider.collect.mockResolvedValueOnce({ state: 'pending', providerTxnId: 'YO-1', providerStatus: 'PENDING' });
      const created = await money.createCollection(db, tenant, { amount: '5000', currency: 'UGX', payer: mm, walletId: 'wal_a' });
      expect(created.status).toBe('processing');
      expect(await balance('wal_a')).toBe(0);

      const intent = await db.moneyIntent.findUniqueOrThrow({ where: { id: created.id } });
      await Promise.all(
        Array.from({ length: 5 }, () => money.applyOutcome(db, 't1', intent, { state: 'succeeded' }, 'webhook')),
      );

      expect(await balance('wal_a')).toBe(5000);
      expect(await db.walletTransaction.count({ where: { walletId: 'wal_a' } })).toBe(1);
      expect(queue.add.mock.calls.filter((c) => c[1].event === 'collection.succeeded')).toHaveLength(1);
    });

    it('returns the original collection when a reference is reused', async () => {
      provider.collect.mockResolvedValue({ state: 'pending' });
      const first = await money.createCollection(db, tenant, { amount: '100', currency: 'UGX', payer: mm, reference: 'order-1' });
      const again = await money.createCollection(db, tenant, { amount: '100', currency: 'UGX', payer: mm, reference: 'order-1' });
      expect(again.id).toBe(first.id);
      expect(provider.collect).toHaveBeenCalledTimes(1);
    });

    it('rejects amounts finer than the currency allows', async () => {
      await expect(money.createCollection(db, tenant, { amount: '100.5', currency: 'UGX', payer: mm })).rejects.toThrow(
        /at most 0 decimal places/,
      );
    });

    it('is refused while the feature is off', async () => {
      await expect(
        money.createCollection(db, { id: 't1', settings: {} }, { amount: '100', currency: 'UGX', payer: mm }),
      ).rejects.toThrow(/not enabled/);
    });
  });

  describe('payouts', () => {
    it('holds wallet money and returns it when the provider fails the payout', async () => {
      await fund('wal_a', 100000);
      provider.payout.mockResolvedValueOnce({ state: 'pending', providerTxnId: 'P1' });
      const payout = await money.createPayout(db, tenant, { amount: '60000', currency: 'UGX', payee: mm, walletId: 'wal_a' });
      expect(payout.status).toBe('processing');
      expect(await balance('wal_a')).toBe(40000);

      provider.getPayout.mockResolvedValueOnce({ state: 'failed', failureReason: 'Recipient unreachable' });
      const refreshed = await money.refresh(db, 't1', payout.id);
      expect(refreshed.status).toBe('failed');
      expect(await balance('wal_a')).toBe(100000);
    });

    it('marks an unanswered payout stuck and never sends it again', async () => {
      provider.payout.mockRejectedValueOnce(new ProviderAmbiguousError('timeout'));
      const payout = await money.createPayout(db, tenant, { amount: '1000', currency: 'UGX', payee: mm });
      expect(payout.status).toBe('stuck');

      provider.getPayout.mockResolvedValueOnce({ state: 'pending', indeterminate: true });
      expect((await money.refresh(db, 't1', payout.id)).status).toBe('stuck');
      provider.getPayout.mockResolvedValueOnce({ state: 'succeeded', providerTxnId: 'P9' });
      expect((await money.refresh(db, 't1', payout.id)).status).toBe('succeeded');
      expect(provider.payout).toHaveBeenCalledTimes(1);
    });

    it('waits for approval above the threshold and submits once when approved', async () => {
      provider.payout.mockResolvedValue({ state: 'succeeded', providerTxnId: 'P2' });
      const payout = await money.createPayout(db, tenant, { amount: '1500000', currency: 'UGX', payee: mm });
      expect(payout.status).toBe('requires_approval');
      expect(provider.payout).not.toHaveBeenCalled();

      const results = await Promise.allSettled([
        money.approvePayout(db, tenant, payout.id, 'ops@example.com'),
        money.approvePayout(db, tenant, payout.id, 'ops@example.com'),
      ]);
      expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
      expect((results.find((r) => r.status === 'rejected') as PromiseRejectedResult).reason).toBeInstanceOf(ConflictException);
      expect(provider.payout).toHaveBeenCalledTimes(1);
      expect((await db.moneyIntent.findUniqueOrThrow({ where: { id: payout.id } })).status).toBe('SUCCEEDED');
    });

    it('releases the wallet hold when a payout waiting for approval is canceled', async () => {
      await fund('wal_a', 2000000);
      const payout = await money.createPayout(db, tenant, { amount: '1200000', currency: 'UGX', payee: mm, walletId: 'wal_a' });
      expect(await balance('wal_a')).toBe(800000);
      await money.cancel(db, tenant, payout.id);
      expect(await balance('wal_a')).toBe(2000000);
    });

    it('enforces the daily limit', async () => {
      provider.payout.mockResolvedValue({ state: 'succeeded' });
      await money.createPayout(db, tenant, { amount: '900000', currency: 'UGX', payee: mm });
      await money.createPayout(db, tenant, { amount: '900000', currency: 'UGX', payee: mm });
      await money.createPayout(db, tenant, { amount: '900000', currency: 'UGX', payee: mm });
      await expect(money.createPayout(db, tenant, { amount: '900000', currency: 'UGX', payee: mm })).rejects.toThrow(/daily payout limit/);
    });

    it('cannot pay out more than the wallet holds', async () => {
      await fund('wal_a', 1000);
      await expect(
        money.createPayout(db, tenant, { amount: '5000', currency: 'UGX', payee: mm, walletId: 'wal_a' }),
      ).rejects.toThrow(/cannot remove/);
      expect(await db.moneyIntent.count({ where: { type: 'PAYOUT' } })).toBe(0);
    });
  });

  describe('transfers', () => {
    it('moves money between wallets in one step', async () => {
      await fund('wal_a', 10000);
      const transfer = await money.createTransfer(db, tenant, { fromWalletId: 'wal_a', toWalletId: 'wal_b', amount: '2500' });
      expect(transfer.status).toBe('succeeded');
      expect(await balance('wal_a')).toBe(7500);
      expect(await balance('wal_b')).toBe(2500);
    });

    it('leaves both wallets untouched when the source cannot cover it', async () => {
      await fund('wal_a', 100);
      await expect(money.createTransfer(db, tenant, { fromWalletId: 'wal_a', toWalletId: 'wal_b', amount: '500' })).rejects.toThrow();
      expect(await balance('wal_a')).toBe(100);
      expect(await balance('wal_b')).toBe(0);
      expect(await db.moneyIntent.count({ where: { type: 'TRANSFER' } })).toBe(0);
    });
  });

  it('keeps the ledger balanced and in step with wallets across all of it', async () => {
    await fund('wal_a', 300000);
    provider.collect.mockResolvedValueOnce({ state: 'succeeded', fee: 1500 });
    await money.createCollection(db, tenant, { amount: '50000', currency: 'UGX', payer: mm });
    provider.payout.mockResolvedValueOnce({ state: 'succeeded', fee: 1000 });
    await money.createPayout(db, tenant, { amount: '100000', currency: 'UGX', payee: mm, walletId: 'wal_a' });
    provider.payout.mockResolvedValueOnce({ state: 'failed' });
    await money.createPayout(db, tenant, { amount: '20000', currency: 'UGX', payee: mm, walletId: 'wal_a' });
    await money.createTransfer(db, tenant, { fromWalletId: 'wal_a', toWalletId: 'wal_b', amount: '30000' });

    const past = new Date(Date.now() - 60 * 60 * 1000);
    await db.moneyIntent.updateMany({ data: { updatedAt: past } });
    await db.walletTransaction.updateMany({ data: { createdAt: past } });

    const ledger = new LedgerService();
    const result = await new LedgerProjectorService(ledger).project(db);
    expect(result.failed).toBe(0);

    const health = await ledger.checkHealth(db);
    expect(health.balanced).toBe(true);
    expect(health.checks.find((c) => c.name === 'wallet_balances_match_ledger')?.ok).toBe(true);

    const bal = async (code: string) =>
      (await db.ledgerAccount.findUniqueOrThrow({ where: { code_currency: { code, currency: 'UGX' } } })).balance;
    // In: 300,000 wallet top-up + 50,000 one-time. Out: 100,000 payout, fees 1,500 + 1,000.
    expect(await bal('provider_clearing:fake')).toBe(2475000000n);
    expect(await bal('one_time_revenue')).toBe(-500000000n);
    expect(await bal('payouts_in_flight')).toBe(0n);
    expect(await bal('wallet_transfers')).toBe(0n);
    expect(await bal('wallet_topup_clearing')).toBe(0n);
    expect(await bal('provider_fees:fake')).toBe(25000000n);
  });
});
