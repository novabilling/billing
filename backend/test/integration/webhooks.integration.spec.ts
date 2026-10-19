/**
 * Webhook processing against a real tenant database (see ledger.integration.spec.ts for setup).
 */
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma-tenant/client';
import { WebhooksController } from '../../src/modules/webhooks/webhooks.controller';
import { ProviderFactory } from '../../src/providers/provider.factory';
import { WebhookData } from '../../src/providers/base-payment.provider';
import { createMockQueue } from '../helpers/mock-queue';

const url = process.env.LEDGER_TEST_DATABASE_URL;
const describeDb = url ? describe : describe.skip;

describeDb('provider webhooks (postgres)', () => {
  let db: PrismaClient;
  const emailQueue = createMockQueue();
  const webhookQueue = createMockQueue();
  const handleWebhook = jest.fn<Promise<WebhookData>, unknown[]>();
  let controller: WebhooksController;

  const deliver = (data: WebhookData, payload: Record<string, unknown> = { event: 'charge' }) => {
    handleWebhook.mockResolvedValueOnce(data);
    return (controller as unknown as { processProviderWebhook: (...a: unknown[]) => Promise<void> }).processProviderWebhook(
      'flutterwave',
      payload,
      'sig',
    );
  };

  beforeAll(() => {
    db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url! }) });
    jest.spyOn(ProviderFactory, 'create').mockReturnValue({ handleWebhook } as never);
    controller = new WebhooksController(
      {
        client: {
          tenant: { findMany: jest.fn().mockResolvedValue([{ id: 't1', name: 'Tenant' }]) },
          webhookLog: { create: jest.fn().mockResolvedValue({}) },
        },
      } as never,
      { getTenantClient: jest.fn().mockResolvedValue(db) } as never,
      { decrypt: () => '{}' } as never,
      webhookQueue as never,
      emailQueue as never,
    );
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await db.$disconnect();
  });

  beforeEach(async () => {
    emailQueue.add.mockClear();
    webhookQueue.add.mockClear();
    handleWebhook.mockReset();
    await db.$executeRawUnsafe(`TRUNCATE "ProviderEvent", "PaymentProvider", "Payment", "Invoice", "Customer" CASCADE`);
    await db.customer.create({ data: { id: 'cus_1', externalId: 'e1', email: 'c@example.com' } });
    await db.paymentProvider.create({ data: { providerName: 'flutterwave', credentials: 'x' } });
    for (const id of ['inv_a', 'inv_b']) {
      await db.invoice.create({
        data: { id, invoiceNumber: id, customerId: 'cus_1', amount: '100', currency: 'USD', status: 'PENDING', dueDate: new Date() },
      });
    }
    await db.payment.create({
      data: { id: 'pay_a', invoiceId: 'inv_a', provider: 'flutterwave', amount: '100', currency: 'USD', status: 'PROCESSING', providerTransactionId: 'tx_a' },
    });
    await db.payment.create({
      data: { id: 'pay_b', invoiceId: 'inv_b', provider: 'flutterwave', amount: '100', currency: 'USD', status: 'PROCESSING', providerTransactionId: 'tx_b' },
    });
  });

  const status = async (id: string) => (await db.payment.findUniqueOrThrow({ where: { id } })).status;

  it('does not mark an unrelated payment paid when the provider sends no invoice reference', async () => {
    await deliver({ status: 'succeeded', transactionId: 'tx_unknown', amount: 100, currency: 'USD' });
    expect(await status('pay_a')).toBe('PROCESSING');
    expect(await status('pay_b')).toBe('PROCESSING');
    expect(emailQueue.add).not.toHaveBeenCalled();
  });

  it('settles the matching payment and invoice once, ignoring redeliveries', async () => {
    const event = { status: 'succeeded' as const, transactionId: 'tx_b', amount: 100, currency: 'USD' };
    await deliver(event);
    await deliver(event);
    await deliver(event);

    expect(await status('pay_b')).toBe('SUCCEEDED');
    expect((await db.invoice.findUniqueOrThrow({ where: { id: 'inv_b' } })).status).toBe('PAID');
    expect(emailQueue.add).toHaveBeenCalledTimes(1);
    expect(webhookQueue.add).toHaveBeenCalledTimes(1);
    expect(await db.providerEvent.count()).toBe(1);
  });

  it('ignores a late failure for a payment that already succeeded', async () => {
    await deliver({ status: 'succeeded', transactionId: 'tx_a', amount: 100, currency: 'USD' });
    await deliver({ status: 'failed', transactionId: 'tx_a', amount: 100, currency: 'USD' });

    expect(await status('pay_a')).toBe('SUCCEEDED');
    const ignored = await db.providerEvent.findFirstOrThrow({ where: { status: 'IGNORED' } });
    expect(ignored.error).toMatch(/already SUCCEEDED/);
  });

  it('records amount and currency differences for review', async () => {
    await deliver({ status: 'succeeded', transactionId: 'tx_a', amount: 60, currency: 'EUR' });
    const event = await db.providerEvent.findFirstOrThrow({ where: { paymentId: 'pay_a' } });
    expect(event.mismatch).toBe('currency EUR (expected USD), amount 60 (expected 100)');
  });

  it('matches by invoice reference when the transaction id is unknown', async () => {
    await deliver({ status: 'succeeded', transactionId: '', invoiceId: 'inv_a', amount: 100, currency: 'USD' });
    expect(await status('pay_a')).toBe('SUCCEEDED');
    expect(await status('pay_b')).toBe('PROCESSING');
  });
});
