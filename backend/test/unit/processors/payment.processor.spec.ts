import { PaymentProcessor } from '../../../src/queues/processors/payment.processor';
import { PaymentJobType } from '../../../src/queues/billing.queue';
import { createMockPrisma } from '../../helpers/mock-prisma';
import { createMockQueue } from '../../helpers/mock-queue';
import { makeInvoice, makePayment, makePaymentProvider } from '../../helpers/fixtures';

// Mock ProviderFactory
jest.mock('../../../src/providers/provider.factory', () => ({
  ProviderFactory: {
    create: jest.fn(),
  },
}));

import { ProviderFactory } from '../../../src/providers/provider.factory';

describe('PaymentProcessor', () => {
  let processor: PaymentProcessor;
  let tenantDbService: { getTenantClient: jest.Mock };
  let centralPrisma: { client: { tenant: { findUnique: jest.Mock } } };
  let encryptionService: { decrypt: jest.Mock };
  let emailQueue: ReturnType<typeof createMockQueue>;
  let webhookQueue: ReturnType<typeof createMockQueue>;
  let db: ReturnType<typeof createMockPrisma>;
  let recurring: { chargeInvoice: jest.Mock };

  beforeEach(() => {
    db = createMockPrisma();
    tenantDbService = { getTenantClient: jest.fn().mockResolvedValue(db) };
    centralPrisma = {
      client: {
        tenant: { findUnique: jest.fn().mockResolvedValue({ name: 'Acme Corp' }) },
      },
    };
    encryptionService = { decrypt: jest.fn().mockReturnValue('{"secret_key":"sk_test"}') };
    emailQueue = createMockQueue();
    webhookQueue = createMockQueue();
    recurring = { chargeInvoice: jest.fn() };

    processor = new PaymentProcessor(
      tenantDbService as any,
      centralPrisma as any,
      encryptionService as any,
      emailQueue as any,
      webhookQueue as any,
      recurring as any,
    );
  });

  function makeJob(name: string, data: Record<string, unknown>) {
    return { name, data, attemptsMade: 0 } as any;
  }

  const invoice = {
    ...makeInvoice(),
    customer: { id: 'cust_1', name: 'John Doe', email: 'john@example.com' },
  };

  describe('retired jobs', () => {
    it('ignores PROCESS_PAYMENT instead of marking an invoice paid on checkout creation', async () => {
      await processor.process(makeJob(PaymentJobType.PROCESS_PAYMENT, { tenantId: 'tenant_1', invoiceId: 'inv_1' }));
      expect(ProviderFactory.create).not.toHaveBeenCalled();
      expect(db.invoice.update).not.toHaveBeenCalled();
    });
  });

  describe('handleRefund', () => {
    it('should process a successful refund', async () => {
      const payment = makePayment({ status: 'SUCCEEDED', providerTransactionId: 'txn_123' });
      db.payment.findUnique.mockResolvedValue(payment);
      db.paymentProvider.findFirst.mockResolvedValue(makePaymentProvider());
      db.payment.update.mockResolvedValue({});
      db.invoice.findUnique.mockResolvedValue(invoice);

      const mockProvider = {
        refund: jest.fn().mockResolvedValue({ success: true }),
      };
      (ProviderFactory.create as jest.Mock).mockReturnValue(mockProvider);

      const job = makeJob(PaymentJobType.PROCESS_REFUND, {
        tenantId: 'tenant_1',
        paymentId: 'pay_1',
      });

      await processor.process(job);

      expect(db.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'REFUNDED' }),
        }),
      );
      expect(emailQueue.add).toHaveBeenCalled();
      expect(webhookQueue.add).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ event: 'payment.refunded' }),
      );
    });

    it('should skip refund for non-succeeded payment', async () => {
      db.payment.findUnique.mockResolvedValue(makePayment({ status: 'FAILED' }));

      const job = makeJob(PaymentJobType.PROCESS_REFUND, {
        tenantId: 'tenant_1',
        paymentId: 'pay_1',
      });

      await processor.process(job);

      expect(db.paymentProvider.findFirst).not.toHaveBeenCalled();
    });
  });

  describe('handleAutoCharge', () => {
    const job = () =>
      makeJob(PaymentJobType.AUTO_CHARGE_PAYMENT_METHOD, { tenantId: 'tenant_1', invoiceId: 'inv_1', subscriptionId: 'sub_1', paymentMethodId: 'pm_1' });

    it('charges through the shared recurring charge service', async () => {
      recurring.chargeInvoice.mockResolvedValue({ result: 'succeeded', paymentId: 'pay_1' });
      await processor.process(job());
      expect(recurring.chargeInvoice).toHaveBeenCalledWith(db, 'tenant_1', 'inv_1', 'pm_1', 'auto');
      expect(db.paymentRetry.create).not.toHaveBeenCalled();
    });

    it('starts one dunning schedule and marks the subscription past due on a decline', async () => {
      recurring.chargeInvoice.mockResolvedValue({ result: 'failed', paymentId: 'pay_1', error: 'declined' });
      db.paymentRetry.findFirst.mockResolvedValue(null);
      db.subscription.updateMany.mockResolvedValue({ count: 1 });

      await processor.process(job());

      expect(db.paymentRetry.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ invoiceId: 'inv_1', subscriptionId: 'sub_1', lastError: 'declined' }) }),
      );
      expect(db.subscription.updateMany).toHaveBeenCalledWith({ where: { id: 'sub_1', status: 'ACTIVE' }, data: { status: 'PAST_DUE' } });
    });

    it('does not start a second dunning schedule for the same invoice', async () => {
      recurring.chargeInvoice.mockResolvedValue({ result: 'failed', paymentId: 'pay_1', error: 'declined' });
      db.paymentRetry.findFirst.mockResolvedValue({ id: 'retry_1' });
      db.subscription.updateMany.mockResolvedValue({ count: 0 });

      await processor.process(job());
      expect(db.paymentRetry.create).not.toHaveBeenCalled();
    });

    it('waits on an ambiguous outcome or a skipped invoice', async () => {
      recurring.chargeInvoice.mockResolvedValueOnce({ result: 'pending', paymentId: 'pay_1' });
      await processor.process(job());
      recurring.chargeInvoice.mockResolvedValueOnce({ result: 'skipped', reason: 'Invoice is paid' });
      await processor.process(job());
      expect(db.paymentRetry.create).not.toHaveBeenCalled();
      expect(db.subscription.updateMany).not.toHaveBeenCalled();
    });
  });

  describe('unknown job', () => {
    it('should not throw for unknown job type', async () => {
      const job = makeJob('UNKNOWN', {});
      await expect(processor.process(job)).resolves.toBeUndefined();
    });
  });
});
