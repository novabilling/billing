import { DunningProcessor } from '../../../src/queues/processors/dunning.processor';
import { createMockQueue } from '../../helpers/mock-queue';
import { createMockPrisma } from '../../helpers/mock-prisma';

describe('DunningProcessor', () => {
  let processor: DunningProcessor;
  let db: ReturnType<typeof createMockPrisma>;
  let recurring: { chargeInvoice: jest.Mock };
  let emailQueue: ReturnType<typeof createMockQueue>;
  let webhookQueue: ReturnType<typeof createMockQueue>;

  const due = new Date('2026-01-10T00:00:00Z');
  const makeRetry = (overrides: Record<string, unknown> = {}) => ({
    id: 'retry_1',
    invoiceId: 'inv_1',
    subscriptionId: 'sub_1',
    attemptNumber: 1,
    maxAttempts: 3,
    nextRetryAt: due,
    status: 'PENDING',
    ...overrides,
  });
  const invoice = {
    id: 'inv_1',
    invoiceNumber: 'INV-00001',
    amount: '100.00',
    currency: 'USD',
    customer: { name: 'John Doe', email: 'john@example.com' },
    subscription: { paymentMethodId: 'pm_1' },
  };

  beforeEach(() => {
    db = createMockPrisma();
    db.paymentRetry.updateMany.mockResolvedValue({ count: 1 });
    db.paymentRetry.update.mockResolvedValue({});
    db.invoice.findUnique.mockResolvedValue(invoice);
    db.subscription.updateMany.mockResolvedValue({ count: 1 });
    recurring = { chargeInvoice: jest.fn() };
    emailQueue = createMockQueue();
    webhookQueue = createMockQueue();
    processor = new DunningProcessor(
      { getTenantClient: jest.fn().mockResolvedValue(db) } as any,
      { client: { tenant: { findMany: jest.fn().mockResolvedValue([{ id: 'tenant_1' }]) } } } as any,
      emailQueue as any,
      webhookQueue as any,
      recurring as any,
    );
  });

  const run = (retry = makeRetry()) => {
    db.paymentRetry.findUnique.mockResolvedValue(retry);
    return processor.process({ name: 'process-retry', data: { tenantId: 'tenant_1', retryId: retry.id } } as any);
  };

  it('claims a retry before charging, so overlapping runs charge once', async () => {
    db.paymentRetry.updateMany.mockResolvedValue({ count: 0 });
    await run();
    expect(db.paymentRetry.updateMany).toHaveBeenCalledWith({
      where: { id: 'retry_1', status: 'PENDING', nextRetryAt: due },
      data: { status: 'PROCESSING' },
    });
    expect(recurring.chargeInvoice).not.toHaveBeenCalled();
  });

  it('charges the subscription card and records success', async () => {
    recurring.chargeInvoice.mockResolvedValue({ result: 'succeeded', paymentId: 'pay_1' });
    await run();
    expect(recurring.chargeInvoice).toHaveBeenCalledWith(db, 'tenant_1', 'inv_1', 'pm_1', 'dunning');
    expect(db.paymentRetry.update).toHaveBeenCalledWith({ where: { id: 'retry_1' }, data: { status: 'SUCCESS' } });
    expect(webhookQueue.add).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ event: 'payment.retry.succeeded' }));
  });

  it('schedules the next attempt after a decline', async () => {
    recurring.chargeInvoice.mockResolvedValue({ result: 'failed', paymentId: 'pay_1', error: 'declined' });
    await run();
    expect(db.paymentRetry.update).toHaveBeenCalledWith({
      where: { id: 'retry_1' },
      data: expect.objectContaining({ status: 'PENDING', attemptNumber: 2, lastError: 'declined' }),
    });
  });

  it('gives up after the last attempt and cancels the subscription', async () => {
    recurring.chargeInvoice.mockResolvedValue({ result: 'failed', paymentId: 'pay_1', error: 'declined' });
    await run(makeRetry({ attemptNumber: 3 }));
    expect(db.paymentRetry.update).toHaveBeenCalledWith({ where: { id: 'retry_1' }, data: { status: 'EXHAUSTED', lastError: 'declined' } });
    expect(db.subscription.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'sub_1', status: { in: ['ACTIVE', 'PAST_DUE'] } }, data: expect.objectContaining({ status: 'CANCELED' }) }),
    );
  });

  it('closes the retry when the invoice was paid meanwhile', async () => {
    recurring.chargeInvoice.mockResolvedValue({ result: 'skipped', reason: 'Invoice is paid', invoiceStatus: 'PAID' });
    await run();
    expect(db.paymentRetry.update).toHaveBeenCalledWith({ where: { id: 'retry_1' }, data: expect.objectContaining({ status: 'SUCCESS' }) });
  });

  it('waits when the provider has not answered an earlier attempt', async () => {
    recurring.chargeInvoice.mockResolvedValue({ result: 'pending', paymentId: 'pay_1' });
    await run();
    expect(db.paymentRetry.update).toHaveBeenCalledWith({
      where: { id: 'retry_1' },
      data: expect.objectContaining({ status: 'PENDING', lastError: 'Awaiting provider confirmation' }),
    });
  });

  it('ignores a retry that is not pending', async () => {
    await run(makeRetry({ status: 'SUCCESS' }));
    expect(db.paymentRetry.updateMany).not.toHaveBeenCalled();
  });
});
