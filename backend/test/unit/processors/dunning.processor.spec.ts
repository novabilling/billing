import { DunningProcessor } from '../../../src/queues/processors/dunning.processor';
import { createMockQueue } from '../../helpers/mock-queue';

// Mock ProviderFactory
jest.mock('../../../src/providers/provider.factory', () => ({
  ProviderFactory: {
    create: jest.fn(),
  },
}));

import { ProviderFactory } from '../../../src/providers/provider.factory';

describe('DunningProcessor', () => {
  let processor: DunningProcessor;
  let tenantDb: { getTenantClient: jest.Mock };
  let centralPrisma: { client: { tenant: { findMany: jest.Mock } } };
  let emailQueue: ReturnType<typeof createMockQueue>;
  let webhookQueue: ReturnType<typeof createMockQueue>;
  let db: Record<string, any>;

  const makeRetry = (overrides: Record<string, any> = {}) => ({
    id: 'retry_1',
    invoiceId: 'inv_1',
    subscriptionId: 'sub_1',
    attemptNumber: 1,
    maxAttempts: 3,
    status: 'PENDING',
    lastError: null,
    invoice: {
      id: 'inv_1',
      invoiceNumber: 'INV-00001',
      amount: '100.00',
      currency: 'USD',
      metadata: { provider: 'stripe' },
      customer: { id: 'cust_1', name: 'John Doe', email: 'john@example.com' },
      subscription: {
        paymentMethod: { id: 'pm_1', tokenId: 'tok_123', customerId: 'cust_1', provider: 'stripe' },
      },
    },
    ...overrides,
  });

  beforeEach(() => {
    db = {
      paymentRetry: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn(),
        update: jest.fn().mockResolvedValue({}),
      },
      paymentProvider: {
        findFirst: jest.fn().mockResolvedValue({
          providerName: 'stripe',
          credentials: '{"secret_key":"sk_test"}',
        }),
      },
      invoice: { update: jest.fn().mockResolvedValue({}) },
      payment: { create: jest.fn().mockResolvedValue({}) },
      subscription: { update: jest.fn().mockResolvedValue({}) },
      $transaction: jest.fn((arr: any[]) => Promise.resolve(arr)),
    };

    tenantDb = { getTenantClient: jest.fn().mockResolvedValue(db) };
    centralPrisma = {
      client: {
        tenant: { findMany: jest.fn().mockResolvedValue([{ id: 'tenant_1' }]) },
      },
    };
    emailQueue = createMockQueue();
    webhookQueue = createMockQueue();

    processor = new DunningProcessor(
      tenantDb as any,
      centralPrisma as any,
      emailQueue as any,
      webhookQueue as any,
    );
  });

  function makeJob(data: Record<string, unknown>) {
    return { name: 'process-retry', data, attemptsMade: 0 } as any;
  }

  describe('processRetry — successful payment', () => {
    it('should update invoice to PAID and retry to SUCCESS', async () => {
      const retry = makeRetry();
      db.paymentRetry.findUnique.mockResolvedValue(retry);

      const mockProvider = {
        chargePaymentMethod: jest.fn().mockResolvedValue({ success: true, transactionId: 'txn_789' }),
      };
      (ProviderFactory.create as jest.Mock).mockReturnValue(mockProvider);

      await processor.process(makeJob({ tenantId: 'tenant_1', retryId: 'retry_1' }));

      // Should attempt to charge
      expect(mockProvider.chargePaymentMethod).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentMethodId: 'tok_123',
          amount: 100,
        }),
      );

      // Should call $transaction for invoice update + payment create + retry update
      expect(db.$transaction).toHaveBeenCalled();

      // Should restore subscription to ACTIVE
      expect(db.subscription.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'ACTIVE' }),
        }),
      );

      // Should send success email + webhook
      expect(emailQueue.add).toHaveBeenCalled();
      expect(webhookQueue.add).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          event: 'payment.retry.succeeded',
        }),
      );
    });
  });

  describe('processRetry — failed payment (not exhausted)', () => {
    it('should schedule next retry with exponential backoff', async () => {
      const retry = makeRetry({ attemptNumber: 1, maxAttempts: 3 });
      db.paymentRetry.findUnique.mockResolvedValue(retry);

      const mockProvider = {
        chargePaymentMethod: jest.fn().mockResolvedValue({ success: false, error: 'Card declined' }),
      };
      (ProviderFactory.create as jest.Mock).mockReturnValue(mockProvider);

      await processor.process(makeJob({ tenantId: 'tenant_1', retryId: 'retry_1' }));

      // Should update retry with incremented attemptNumber and next retry date
      expect(db.paymentRetry.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            attemptNumber: 2,
            lastError: 'Card declined',
          }),
        }),
      );

      // Should send retry notification email
      expect(emailQueue.add).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          template: 'payment-retry-failed',
        }),
      );
    });
  });

  describe('processRetry — exhausted (max attempts reached)', () => {
    it('should mark retry as EXHAUSTED and cancel subscription', async () => {
      const retry = makeRetry({ attemptNumber: 3, maxAttempts: 3 });
      db.paymentRetry.findUnique.mockResolvedValue(retry);

      const mockProvider = {
        chargePaymentMethod: jest.fn().mockResolvedValue({ success: false, error: 'Card expired' }),
      };
      (ProviderFactory.create as jest.Mock).mockReturnValue(mockProvider);

      await processor.process(makeJob({ tenantId: 'tenant_1', retryId: 'retry_1' }));

      // Should mark retry as EXHAUSTED
      expect(db.paymentRetry.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'EXHAUSTED' }),
        }),
      );

      // Should cancel subscription
      expect(db.subscription.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'CANCELED' }),
        }),
      );

      // Should send exhausted email
      expect(emailQueue.add).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          template: 'payment-retry-exhausted',
        }),
      );
    });
  });

  describe('processRetry — edge cases', () => {
    it('should return when retry not found', async () => {
      db.paymentRetry.findUnique.mockResolvedValue(null);

      await processor.process(makeJob({ tenantId: 'tenant_1', retryId: 'missing' }));

      expect(emailQueue.add).not.toHaveBeenCalled();
    });

    it('should handle missing payment method', async () => {
      const retry = makeRetry();
      retry.invoice.subscription = { paymentMethod: null } as any;
      db.paymentRetry.findUnique.mockResolvedValue(retry);

      await processor.process(makeJob({ tenantId: 'tenant_1', retryId: 'retry_1' }));

      // Should update retry with error
      expect(db.paymentRetry.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            lastError: 'No payment method available for retry',
          }),
        }),
      );
    });
  });
});
