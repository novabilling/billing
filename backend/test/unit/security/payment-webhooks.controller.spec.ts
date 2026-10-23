import { WebhooksController } from '../../../src/modules/webhooks/webhooks.controller';
import { ProviderFactory } from '../../../src/providers/provider.factory';
import { createMockPrisma } from '../../helpers/mock-prisma';
import { createMockQueue } from '../../helpers/mock-queue';

describe('WebhooksController (payment notifications)', () => {
  let db: ReturnType<typeof createMockPrisma>;
  let handleWebhook: jest.Mock;
  let controller: WebhooksController;
  let money: { handleCheckoutNotification: jest.Mock };

  beforeEach(() => {
    db = createMockPrisma();
    db.$transaction.mockImplementation((fn: (tx: unknown) => unknown) => fn(db));
    db.paymentProvider.findFirst.mockResolvedValue({ id: 'pp', providerName: 'stripe', credentials: 'enc' });
    handleWebhook = jest.fn();
    jest.spyOn(ProviderFactory, 'create').mockReturnValue({ handleWebhook } as never);
    money = { handleCheckoutNotification: jest.fn().mockResolvedValue(false) };
    controller = new WebhooksController(
      {
        client: {
          tenant: { findMany: jest.fn().mockResolvedValue([{ id: 't1', name: 'Acme' }]) },
          webhookLog: { create: jest.fn().mockResolvedValue({}) },
        },
      } as never,
      { getTenantClient: jest.fn().mockResolvedValue(db) } as never,
      { decrypt: () => '{}' } as never,
      createMockQueue() as never,
      createMockQueue() as never,
      money as never,
    );
  });
  afterEach(() => jest.restoreAllMocks());

  const req = (headers: Record<string, string> = {}) => ({ headers, rawBody: Buffer.from('{}') }) as never;

  it('changes nothing when no tenant verifies the notification (a forged event)', async () => {
    handleWebhook.mockRejectedValue(new Error('Unsigned Stripe webhook'));
    await expect(controller.stripe(req(), { type: 'checkout.session.completed' })).resolves.toEqual({ received: true });
    expect(db.payment.findFirst).not.toHaveBeenCalled();
    expect(db.payment.updateMany).not.toHaveBeenCalled();
    expect(money.handleCheckoutNotification).not.toHaveBeenCalled();
  });

  it('answers with an error, so the provider redelivers, when a verified notification cannot be processed', async () => {
    handleWebhook.mockResolvedValue({ status: 'succeeded', transactionId: 'cs_1', amount: 49, currency: 'USD' });
    db.payment.findFirst.mockRejectedValue(new Error('connection reset'));
    await expect(controller.stripe(req({ 'stripe-signature': 't=1,v1=x' }), {})).rejects.toThrow('Could not process stripe webhook');
  });

  it('passes the raw body to every provider on the shared URLs', async () => {
    handleWebhook.mockRejectedValue(new Error('nope'));
    await controller.paystack(req({ 'x-paystack-signature': 'sig' }), { event: 'charge.success' });
    expect(handleWebhook).toHaveBeenCalledWith({ event: 'charge.success' }, 'sig', '{}');
  });
});
