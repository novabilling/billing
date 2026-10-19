/**
 * Ledger integration tests against a real PostgreSQL database.
 *
 * Skipped unless LEDGER_TEST_DATABASE_URL points at a database that already has
 * the tenant schema, e.g.:
 *   DATABASE_URL=$URL CENTRAL_DATABASE_URL=$URL npx prisma db push --schema=./prisma/schema-tenant.prisma
 *   LEDGER_TEST_DATABASE_URL=$URL npx jest test/integration/ledger
 */
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma-tenant/client';
import { LedgerService } from '../../src/modules/ledger/ledger.service';
import { LedgerProjectorService } from '../../src/modules/ledger/ledger-projector.service';
import { Accounts } from '../../src/modules/ledger/chart-of-accounts';
import { formatScaled } from '../../src/modules/ledger/ledger.money';

const url = process.env.LEDGER_TEST_DATABASE_URL;
const describeDb = url ? describe : describe.skip;

describeDb('ledger (postgres)', () => {
  let db: PrismaClient;
  const ledger = new LedgerService();
  const projector = new LedgerProjectorService(ledger);
  // Old enough to be outside the projector's settle window.
  const past = new Date(Date.now() - 60 * 60 * 1000);

  const balanceOf = async (code: string, currency: string) => {
    const account = await db.ledgerAccount.findUnique({ where: { code_currency: { code, currency } } });
    return account ? formatScaled(account.balance) : null;
  };

  beforeAll(async () => {
    db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url! }) });
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  beforeEach(async () => {
    await db.$executeRawUnsafe(`
      TRUNCATE "LedgerLine", "LedgerEntry", "LedgerAccount", "LedgerCursor",
        "WalletTransaction", "Wallet", "CreditNote", "Payment", "Invoice", "Customer" CASCADE`);
    await db.customer.create({ data: { id: 'cus_1', externalId: 'ext_1', email: 'a@example.com', currency: 'UGX' } });
  });

  const invoice = (id: string, amount: string, status: string, extra: Record<string, unknown> = {}) =>
    db.invoice.create({
      data: {
        id,
        invoiceNumber: `INV-${id}`,
        customerId: 'cus_1',
        amount,
        currency: 'UGX',
        status: status as never,
        dueDate: past,
        createdAt: past,
        updatedAt: past,
        ...extra,
      },
    });

  it('mirrors invoices, payments, wallets and credit notes as balanced entries', async () => {
    // Gross 60,000 with 10,000 wallet credits applied: stored amount is the net 50,000.
    await invoice('inv_1', '50000', 'PAID', { metadata: { taxAmount: 9000 } });
    await db.payment.create({
      data: { id: 'pay_1', invoiceId: 'inv_1', provider: 'flutterwave', amount: '50000', currency: 'UGX', status: 'SUCCEEDED', createdAt: past, updatedAt: past },
    });
    await db.wallet.create({
      data: { id: 'wal_1', customerId: 'cus_1', currency: 'UGX', balance: '15000', creditsBalance: '15000', createdAt: past, updatedAt: past },
    });
    await db.walletTransaction.createMany({
      data: [
        { id: 'wt_1', walletId: 'wal_1', transactionType: 'INBOUND', status: 'SETTLED', transactionStatus: 'PURCHASED', creditAmount: '20000', amount: '20000', createdAt: past },
        { id: 'wt_2', walletId: 'wal_1', transactionType: 'INBOUND', status: 'SETTLED', transactionStatus: 'GRANTED', creditAmount: '5000', amount: '5000', createdAt: past },
        { id: 'wt_3', walletId: 'wal_1', transactionType: 'OUTBOUND', status: 'SETTLED', transactionStatus: 'INVOICED', creditAmount: '10000', amount: '10000', invoiceId: 'inv_1', createdAt: past },
      ],
    });
    await db.creditNote.create({
      data: { id: 'cn_1', invoiceId: 'inv_1', customerId: 'cus_1', amount: '2500', currency: 'UGX', reason: 'OTHER', status: 'FINALIZED', createdAt: past, updatedAt: past },
    });

    const result = await projector.project(db);
    expect(result).toMatchObject({ posted: 6, failed: 0 });

    expect(await balanceOf('receivable', 'UGX')).toBe('0.0000'); // 60,000 issued − 50,000 paid − 10,000 wallet
    expect(await balanceOf('revenue', 'UGX')).toBe('-51000.0000');
    expect(await balanceOf('tax_payable', 'UGX')).toBe('-9000.0000');
    expect(await balanceOf('provider_clearing:flutterwave', 'UGX')).toBe('50000.0000');
    expect(await balanceOf('customer_wallet:wal_1', 'UGX')).toBe('-15000.0000');
    expect(await balanceOf('wallet_topup_clearing', 'UGX')).toBe('20000.0000');
    expect(await balanceOf('promotional_credits', 'UGX')).toBe('5000.0000');
    expect(await balanceOf('customer_credit', 'UGX')).toBe('-2500.0000');

    const health = await ledger.checkHealth(db);
    expect(health.balanced).toBe(true);
    expect(health.checks.find((c) => c.name === 'wallet_balances_match_ledger')?.ok).toBe(true);
  });

  it('is idempotent across repeated and from-scratch runs', async () => {
    await invoice('inv_1', '1000', 'PENDING');
    await projector.project(db);
    const again = await projector.project(db);
    const rebuild = await projector.project(db, { fromScratch: true });

    expect(again.posted).toBe(0);
    expect(rebuild).toMatchObject({ posted: 0, duplicates: 1 });
    expect(await db.ledgerEntry.count()).toBe(1);
  });

  it('leaves rows inside the settle window for the next run', async () => {
    await invoice('inv_new', '1000', 'PENDING', { createdAt: new Date(), updatedAt: new Date() });
    const result = await projector.project(db);
    expect(result.posted).toBe(0);
  });

  it('posts partial refunds and reverses canceled invoices and voided credit notes', async () => {
    await invoice('inv_1', '40000', 'PAID');
    await db.payment.create({
      data: {
        id: 'pay_1', invoiceId: 'inv_1', provider: 'stripe', amount: '40000', currency: 'UGX', status: 'REFUNDED',
        metadata: { refundAmount: 15000 }, createdAt: past, updatedAt: past,
      },
    });
    await invoice('inv_2', '7000', 'PENDING');
    await db.creditNote.create({
      data: { id: 'cn_1', invoiceId: 'inv_1', customerId: 'cus_1', amount: '3000', currency: 'UGX', reason: 'DUPLICATE', status: 'FINALIZED', createdAt: past, updatedAt: past },
    });
    await projector.project(db);
    expect(await balanceOf('customer_credit', 'UGX')).toBe('-3000.0000');

    expect(await balanceOf('refunds', 'UGX')).toBe('15000.0000');
    expect(await balanceOf('provider_clearing:stripe', 'UGX')).toBe('25000.0000');

    await db.invoice.update({ where: { id: 'inv_2' }, data: { status: 'CANCELED', updatedAt: past } });
    await db.creditNote.update({ where: { id: 'cn_1' }, data: { status: 'VOIDED', updatedAt: past } });
    // Cursor sits at `past`; the overlap window re-reads the changed row.
    await projector.project(db);
    expect(await db.ledgerEntry.count({ where: { reference: 'invoice:inv_2:voided' } })).toBe(1);
    expect(await balanceOf('receivable', 'UGX')).toBe('0.0000');
    expect(await balanceOf('customer_credit', 'UGX')).toBe('0.0000');
    expect((await ledger.checkHealth(db)).balanced).toBe(true);
  });

  it('flags a wallet whose stored balance disagrees with its history', async () => {
    await db.wallet.create({ data: { id: 'wal_x', customerId: 'cus_1', currency: 'UGX', balance: '999', createdAt: past, updatedAt: past } });
    await db.walletTransaction.create({
      data: { id: 'wt_x', walletId: 'wal_x', transactionType: 'INBOUND', status: 'SETTLED', transactionStatus: 'GRANTED', creditAmount: '1000', amount: '1000', createdAt: past },
    });
    await projector.project(db);

    const health = await ledger.checkHealth(db);
    const parity = health.checks.find((c) => c.name === 'wallet_balances_match_ledger')!;
    expect(parity.ok).toBe(false);
    expect(parity.details[0]).toMatchObject({ walletId: 'wal_x', walletBalance: '999.0000', ledgerBalance: '1000.0000' });
    // Parity is informational: the ledger itself still balances.
    expect(health.balanced).toBe(true);
  });

  it('rejects unbalanced postings', async () => {
    await expect(
      ledger.post(db, {
        reference: 'bad', type: 'ADJUSTMENT', description: 'bad', sourceType: 'test', sourceId: 'x', effectiveAt: new Date(),
        lines: [
          { account: Accounts.receivable('UGX'), amount: 100n },
          { account: Accounts.revenue('UGX'), amount: -99n },
        ],
      }),
    ).rejects.toThrow(/unbalanced/);
    expect(await db.ledgerEntry.count()).toBe(0);
  });

  it('keeps cached balances exact under concurrent postings to the same accounts', async () => {
    await Promise.all(
      Array.from({ length: 25 }, (_, i) =>
        ledger.post(db, {
          reference: `concurrent:${i}`, type: 'ADJUSTMENT', description: 'test', sourceType: 'test', sourceId: String(i), effectiveAt: new Date(),
          lines: [
            { account: Accounts.receivable('USD'), amount: 1_0000n },
            { account: Accounts.revenue('USD'), amount: -1_0000n },
          ],
        }),
      ),
    );
    expect(await balanceOf('receivable', 'USD')).toBe('25.0000');
    expect((await ledger.checkHealth(db)).checks.find((c) => c.name === 'cached_balances_match_lines')?.ok).toBe(true);
  });

  it('treats concurrent duplicates of one reference as a single posting', async () => {
    const outcomes = await Promise.all(
      Array.from({ length: 10 }, () =>
        ledger.post(db, {
          reference: 'same', type: 'ADJUSTMENT', description: 'test', sourceType: 'test', sourceId: 'x', effectiveAt: new Date(),
          lines: [
            { account: Accounts.receivable('USD'), amount: 5n },
            { account: Accounts.revenue('USD'), amount: -5n },
          ],
        }),
      ),
    );
    expect(outcomes.filter((o) => o === 'posted')).toHaveLength(1);
    expect(await balanceOf('receivable', 'USD')).toBe('0.0005');
  });
});
