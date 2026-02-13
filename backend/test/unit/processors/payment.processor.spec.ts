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

    processor = new PaymentProcessor(
      tenantDbService as any,
      centralPrisma as any,
      encryptionService as any,
      emailQueue as any,
      webhookQueue as any,
    );
  });

  function makeJob(name: string, data: Record<string, unknown>) {
    return { name, data, attemptsMade: 0 } as any;
  }

  const invoice = {
    ...makeInvoice(),
    customer: { id: 'cust_1', name: 'John Doe', email: 'john@example.com' },
  };

  describe('handleProcessPayment', () => {
    it('should process a successful payment', async () => {
      db.invoice.findUnique.mockResolvedValue(invoice);
      db.paymentProvider.findFirst.mockResolvedValue(makePaymentProvider());
      db.payment.create.mockResolvedValue(makePayment());
      db.payment.update.mockResolvedValue({});
      db.invoice.update.mockResolvedValue({});

      const mockProvider = {
        charge: jest.fn().mockResolvedValue({ success: true, transactionId: 'txn_123' }),
      };
      (ProviderFactory.create as jest.Mock).mockReturnValue(mockProvider);

      const job = makeJob(PaymentJobType.PROCESS_PAYMENT, {
        tenantId: 'tenant_1',
        invoiceId: 'inv_1',
      });

      await processor.process(job);

      expect(db.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'SUCCEEDED' }),
        }),
      );
      expect(db.invoice.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'PAID' }),
        }),
      );
      expect(emailQueue.add).toHaveBeenCalled();
      expect(webhookQueue.add).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ event: 'payment.succeeded' }),
      );
    });

    it('should handle failed payment', async () => {
      db.invoice.findUnique.mockResolvedValue(invoice);
      db.paymentProvider.findFirst.mockResolvedValue(makePaymentProvider());
      db.payment.create.mockResolvedValue(makePayment());
      db.payment.update.mockResolvedValue({});

      const mockProvider = {
        charge: jest.fn().mockResolvedValue({ success: false, error: 'Insufficient funds' }),
      };
      (ProviderFactory.create as jest.Mock).mockReturnValue(mockProvider);

      const job = makeJob(PaymentJobType.PROCESS_PAYMENT, {
        tenantId: 'tenant_1',
        invoiceId: 'inv_1',
      });

      await processor.process(job);

      expect(db.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'FAILED',
            failureReason: 'Insufficient funds',
          }),
        }),
      );
      expect(webhookQueue.add).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ event: 'payment.failed' }),
      );
    });

    it('should skip when invoice not found', async () => {
      db.invoice.findUnique.mockResolvedValue(null);

      const job = makeJob(PaymentJobType.PROCESS_PAYMENT, {
        tenantId: 'tenant_1',
        invoiceId: 'missing',
      });

      await processor.process(job);

      expect(db.payment.create).not.toHaveBeenCalled();
    });

    it('should skip when no active payment provider', async () => {
      db.invoice.findUnique.mockResolvedValue(invoice);
      db.paymentProvider.findFirst.mockResolvedValue(null);

      const job = makeJob(PaymentJobType.PROCESS_PAYMENT, {
        tenantId: 'tenant_1',
        invoiceId: 'inv_1',
      });

      await processor.process(job);

      expect(db.payment.create).not.toHaveBeenCalled();
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
    it('should auto-charge a saved payment method', async () => {
      db.invoice.findUnique.mockResolvedValue(invoice);
      db.paymentMethod.findUnique.mockResolvedValue({
        id: 'pm_1',
        provider: 'stripe',
        tokenId: 'tok_123',
        customerId: 'cust_1',
      });
      db.paymentProvider.findFirst.mockResolvedValue(makePaymentProvider());
      db.payment.create.mockResolvedValue(makePayment());
      db.payment.update.mockResolvedValue({});
      db.invoice.update.mockResolvedValue({});

      const mockProvider = {
        chargePaymentMethod: jest.fn().mockResolvedValue({ success: true, transactionId: 'txn_456' }),
      };
      (ProviderFactory.create as jest.Mock).mockReturnValue(mockProvider);

      const job = makeJob(PaymentJobType.AUTO_CHARGE_PAYMENT_METHOD, {
        tenantId: 'tenant_1',
        invoiceId: 'inv_1',
        subscriptionId: 'sub_1',
        paymentMethodId: 'pm_1',
      });

      await processor.process(job);

      expect(mockProvider.chargePaymentMethod).toHaveBeenCalled();
      expect(db.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'SUCCEEDED' }),
        }),
      );
    });

    it('should handle failed auto-charge and create dunning retry', async () => {
      db.invoice.findUnique.mockResolvedValue(invoice);
      db.paymentMethod.findUnique.mockResolvedValue({
        id: 'pm_1',
        provider: 'stripe',
        tokenId: 'tok_123',
        customerId: 'cust_1',
      });
      db.paymentProvider.findFirst.mockResolvedValue(makePaymentProvider());
      db.payment.create.mockResolvedValue(makePayment());
      db.payment.update.mockResolvedValue({});
      db.paymentRetry = { create: jest.fn().mockResolvedValue({}) } as any;
      db.subscription.update.mockResolvedValue({});

      const mockProvider = {
        chargePaymentMethod: jest.fn().mockResolvedValue({ success: false, error: 'Card declined' }),
      };
      (ProviderFactory.create as jest.Mock).mockReturnValue(mockProvider);

      const job = makeJob(PaymentJobType.AUTO_CHARGE_PAYMENT_METHOD, {
        tenantId: 'tenant_1',
        invoiceId: 'inv_1',
        subscriptionId: 'sub_1',
        paymentMethodId: 'pm_1',
      });

      await processor.process(job);

      expect(db.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'FAILED' }),
        }),
      );
      expect(db.paymentRetry.create).toHaveBeenCalled();
      expect(db.subscription.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'PAST_DUE' }),
        }),
      );
    });

    it('should skip when invoice already paid', async () => {
      db.invoice.findUnique.mockResolvedValue({ ...invoice, status: 'PAID' });

      const job = makeJob(PaymentJobType.AUTO_CHARGE_PAYMENT_METHOD, {
        tenantId: 'tenant_1',
        invoiceId: 'inv_1',
        subscriptionId: 'sub_1',
        paymentMethodId: 'pm_1',
      });

      await processor.process(job);

      expect(db.paymentMethod.findUnique).not.toHaveBeenCalled();
    });
  });

  describe('unknown job', () => {
    it('should not throw for unknown job type', async () => {
      const job = makeJob('UNKNOWN', {});
      await expect(processor.process(job)).resolves.toBeUndefined();
    });
  });
});
