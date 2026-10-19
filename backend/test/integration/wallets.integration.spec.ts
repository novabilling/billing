import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma-tenant/client';
import { WalletsService } from '../../src/modules/wallets/wallets.service';
import { createMockQueue } from '../helpers/mock-queue';

const url = process.env.LEDGER_TEST_DATABASE_URL;
const describeDb = url ? describe : describe.skip;

describeDb('wallet balances (postgres)', () => {
  let db: PrismaClient;
  const service = new WalletsService(createMockQueue() as never);

  beforeAll(() => {
    db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url! }) });
  });
  afterAll(() => db.$disconnect());

  beforeEach(async () => {
    await db.$executeRawUnsafe(`TRUNCATE "WalletTransaction", "Wallet", "Customer" CASCADE`);
    await db.customer.create({ data: { id: 'cus_w', externalId: 'w1', email: 'w@example.com' } });
    await db.wallet.create({ data: { id: 'wal_w', customerId: 'cus_w', currency: 'USD' } });
    await (service as any).addCredits(db, 'wal_w', 100, 'PURCHASED', 't1');
  });

  it('never lets concurrent debits take a wallet below zero', async () => {
    const results = await Promise.allSettled(
      Array.from({ length: 10 }, () => (service as any).removeCredits(db, 'wal_w', 20, 'INVOICED', 't1')),
    );
    const wallet = await db.wallet.findUniqueOrThrow({ where: { id: 'wal_w' } });
    const debits = await db.walletTransaction.count({ where: { transactionType: 'OUTBOUND' } });

    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(5);
    expect(debits).toBe(5);
    expect(Number(wallet.creditsBalance)).toBe(0);
    expect(Number(wallet.balance)).toBe(0);
  });

  it('keeps history and balance in step', async () => {
    await Promise.all(Array.from({ length: 8 }, () => (service as any).addCredits(db, 'wal_w', 5, 'GRANTED', 't1')));
    const wallet = await db.wallet.findUniqueOrThrow({ where: { id: 'wal_w' } });
    const sum = await db.walletTransaction.aggregate({ _sum: { amount: true } });
    expect(Number(wallet.balance)).toBe(140);
    expect(Number(sum._sum.amount)).toBe(140);
  });
});
