/**
 * Billing SQL against a real tenant database (see ledger.integration.spec.ts for setup):
 * usage aggregation, the invoice number counter and the one-invoice-per-key rule.
 */
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '../../src/generated/prisma-tenant/client';
import { aggregateUsage } from '../../src/modules/billing/usage';
import { nextInvoiceNumber } from '../../src/modules/billing/invoice-number';

const url = process.env.LEDGER_TEST_DATABASE_URL;
const describeDb = url ? describe : describe.skip;

describeDb('billing (postgres)', () => {
  let db: PrismaClient;
  const from = new Date('2026-01-01T00:00:00Z');
  const to = new Date('2026-02-01T00:00:00Z');

  beforeAll(() => {
    db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url! }) });
  });
  afterAll(() => db.$disconnect());

  beforeEach(async () => {
    await db.$executeRawUnsafe(`TRUNCATE "UsageEvent", "Invoice", "Subscription", "Plan", "Customer", "Sequence" CASCADE`);
    await db.customer.create({ data: { id: 'cus_b', externalId: 'b1', email: 'b@example.com' } });
    await db.plan.create({ data: { id: 'plan_b', name: 'Pro', code: 'pro_b', billingInterval: 'MONTHLY' } });
    await db.subscription.create({
      data: { id: 'sub_b', customerId: 'cus_b', planId: 'plan_b', currency: 'USD', currentPeriodStart: from, currentPeriodEnd: to },
    });
    const events: [string, Record<string, unknown>, string][] = [
      ['e1', { tokens: 10, user: 'a', weight: 2 }, '2026-01-05T00:00:00Z'],
      ['e2', { tokens: '5.5', user: 'b' }, '2026-01-10T00:00:00Z'],
      ['e3', { tokens: 'not a number', user: 'a' }, '2026-01-20T00:00:00Z'],
      ['e4', { user: 'c' }, '2026-01-25T00:00:00Z'],
      ['e5', { tokens: 1000, user: 'z' }, '2026-02-01T00:00:00Z'], // next period: excluded
    ];
    for (const [id, properties, at] of events) {
      await db.usageEvent.create({
        data: { transactionId: id, subscriptionId: 'sub_b', code: 'tokens', properties: properties as Prisma.InputJsonValue, timestamp: new Date(at) },
      });
    }
  });

  const agg = (aggregationType: string, fieldName: string | null = 'tokens') =>
    aggregateUsage(db, { subscriptionId: 'sub_b', code: 'tokens', aggregationType, fieldName, from, to }).then((d) => d.toString());

  it('aggregates usage in SQL over [from, to), counting non-numbers as 0', async () => {
    expect(await agg('COUNT', null)).toBe('4');
    expect(await agg('SUM')).toBe('15.5');
    expect(await agg('MAX')).toBe('10');
    expect(await agg('UNIQUE_COUNT', 'user')).toBe('3');
    expect(await agg('LATEST')).toBe('0'); // the latest event has no tokens
    expect(await agg('WEIGHTED_SUM')).toBe('25.5'); // 10×2 + 5.5×1
  });

  it('hands out distinct invoice numbers under concurrency and skips numbers already taken', async () => {
    await db.invoice.create({
      data: { invoiceNumber: 'INV-00003', customerId: 'cus_b', amount: '1', currency: 'USD', dueDate: new Date() },
    });
    const numbers = await Promise.all(Array.from({ length: 10 }, () => nextInvoiceNumber(db)));
    expect(new Set(numbers).size).toBe(10);
    expect(numbers).not.toContain('INV-00003');
    expect(numbers.every((n) => /^INV-\d{5}$/.test(n))).toBe(true);
  });

  it('allows one invoice per billing key', async () => {
    const create = (invoiceNumber: string) =>
      db.invoice.create({
        data: { invoiceNumber, billingKey: 'sub_b|renewal|2026-02-01T00:00:00.000Z', customerId: 'cus_b', amount: '1', currency: 'USD', dueDate: new Date() },
      });
    await create('INV-90001');
    await expect(create('INV-90002')).rejects.toMatchObject({ code: 'P2002' });
  });
});
