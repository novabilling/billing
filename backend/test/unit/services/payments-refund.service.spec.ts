import { BadRequestException } from '@nestjs/common';
import { PaymentsService } from '../../../src/modules/payments/payments.service';
import { ProviderFactory } from '../../../src/providers/provider.factory';
import { createMockQueue } from '../../helpers/mock-queue';

describe('PaymentsService.refund', () => {
  const refund = jest.fn();
  const central = { client: { tenant: { findUnique: jest.fn().mockResolvedValue({ name: 'T' }) } } };
  const service = new PaymentsService(
    central as never,
    { decrypt: () => '{"secretKey":"x"}' } as never,
    createMockQueue() as never,
    createMockQueue() as never,
  );

  const payment = (overrides: Record<string, unknown> = {}) => ({
    id: 'pay_1',
    invoiceId: 'inv_1',
    provider: 'paystack',
    providerTransactionId: 'tx_1',
    amount: { toString: () => '100' },
    currency: 'NGN',
    status: 'SUCCEEDED',
    metadata: null,
    invoice: { customer: { email: 'c@example.com', name: 'C' } },
    ...overrides,
  });

  const db = (p: ReturnType<typeof payment>, providerConfig: unknown = { providerName: 'paystack', credentials: 'enc' }) => ({
    payment: {
      findUnique: jest.fn().mockResolvedValue({ ...p, amount: 100 }),
      update: jest.fn().mockImplementation(({ data }) => ({ ...p, ...data })),
    },
    paymentProvider: { findFirst: jest.fn().mockResolvedValue(providerConfig) },
  });

  beforeEach(() => {
    refund.mockReset();
    jest.spyOn(ProviderFactory, 'create').mockReturnValue({ refund } as never);
  });

  it('sends the refund to the provider before marking the payment refunded', async () => {
    refund.mockResolvedValue({ success: true, refundId: 're_1' });
    const d = db(payment());
    await service.refund(d as never, 't1', 'pay_1', { amount: 40 });

    expect(refund).toHaveBeenCalledWith({ transactionId: 'tx_1', amount: 40, currency: 'NGN' });
    expect(d.payment.update.mock.calls[0][0].data).toMatchObject({
      status: 'REFUNDED',
      metadata: { refundAmount: 40, refundMode: 'provider', providerRefundId: 're_1' },
    });
  });

  it('leaves the payment untouched when the provider refuses', async () => {
    refund.mockResolvedValue({ success: false, error: 'insufficient balance' });
    const d = db(payment());
    await expect(service.refund(d as never, 't1', 'pay_1', {})).rejects.toThrow(/refused the refund: insufficient balance/);
    expect(d.payment.update).not.toHaveBeenCalled();
  });

  it('only records refunds for manual payments or when asked to', async () => {
    const manual = db(payment({ provider: 'manual' }));
    await service.refund(manual as never, 't1', 'pay_1', {});
    const recorded = db(payment());
    await service.refund(recorded as never, 't1', 'pay_1', { recordOnly: true });

    expect(refund).not.toHaveBeenCalled();
    expect(manual.payment.update.mock.calls[0][0].data.metadata.refundMode).toBe('recorded');
    expect(recorded.payment.update.mock.calls[0][0].data.metadata.refundMode).toBe('recorded');
  });

  it('explains how to proceed when the provider is no longer configured', async () => {
    const d = db(payment(), null);
    await expect(service.refund(d as never, 't1', 'pay_1', {})).rejects.toThrow(BadRequestException);
    await expect(service.refund(d as never, 't1', 'pay_1', {})).rejects.toThrow(/recordOnly: true/);
  });
});
