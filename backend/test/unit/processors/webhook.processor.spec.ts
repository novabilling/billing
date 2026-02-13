import { WebhookProcessor } from '../../../src/queues/processors/webhook.processor';
import { WebhookJobType } from '../../../src/queues/billing.queue';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

describe('WebhookProcessor', () => {
  let processor: WebhookProcessor;
  let centralPrisma: {
    client: {
      tenant: { findUnique: jest.Mock };
      webhookLog: { create: jest.Mock };
    };
  };

  beforeEach(() => {
    centralPrisma = {
      client: {
        tenant: { findUnique: jest.fn() },
        webhookLog: { create: jest.fn().mockResolvedValue({}) },
      },
    };
    processor = new WebhookProcessor(centralPrisma as any);
    mockFetch.mockReset();
  });

  function makeJob(name: string, data: Record<string, unknown>, attemptsMade = 0) {
    return { name, data, attemptsMade } as any;
  }

  describe('handleSendWebhook', () => {
    it('should deliver webhook with HMAC signature', async () => {
      centralPrisma.client.tenant.findUnique.mockResolvedValue({
        webhookUrl: 'https://example.com/webhook',
        webhookSecret: 'test_secret',
      });

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve('OK'),
      });

      const job = makeJob(WebhookJobType.SEND_WEBHOOK, {
        tenantId: 'tenant_1',
        event: 'invoice.created',
        payload: { invoiceId: 'inv_1' },
      });

      await processor.process(job);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com/webhook',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Event-Type': 'invoice.created',
          }),
        }),
      );

      // Should include X-Webhook-Signature header
      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs.headers['X-Webhook-Signature']).toBeDefined();
      expect(callArgs.headers['X-Webhook-Signature'].length).toBeGreaterThan(0);

      // Should log the attempt
      expect(centralPrisma.client.webhookLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tenantId: 'tenant_1',
            event: 'invoice.created',
            success: true,
            statusCode: 200,
          }),
        }),
      );
    });

    it('should skip when no webhook URL configured', async () => {
      centralPrisma.client.tenant.findUnique.mockResolvedValue({
        webhookUrl: null,
        webhookSecret: null,
      });

      const job = makeJob(WebhookJobType.SEND_WEBHOOK, {
        tenantId: 'tenant_1',
        event: 'invoice.created',
        payload: {},
      });

      await processor.process(job);

      expect(mockFetch).not.toHaveBeenCalled();
      expect(centralPrisma.client.webhookLog.create).not.toHaveBeenCalled();
    });

    it('should throw on failed delivery to trigger retry', async () => {
      centralPrisma.client.tenant.findUnique.mockResolvedValue({
        webhookUrl: 'https://example.com/webhook',
        webhookSecret: 'secret',
      });

      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal Server Error'),
      });

      const job = makeJob(WebhookJobType.SEND_WEBHOOK, {
        tenantId: 'tenant_1',
        event: 'payment.succeeded',
        payload: {},
      });

      await expect(processor.process(job)).rejects.toThrow('Webhook delivery failed');

      // Should still log the failed attempt
      expect(centralPrisma.client.webhookLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            success: false,
            statusCode: 500,
          }),
        }),
      );
    });

    it('should throw on network error', async () => {
      centralPrisma.client.tenant.findUnique.mockResolvedValue({
        webhookUrl: 'https://example.com/webhook',
        webhookSecret: null,
      });

      mockFetch.mockRejectedValue(new Error('Connection refused'));

      const job = makeJob(WebhookJobType.SEND_WEBHOOK, {
        tenantId: 'tenant_1',
        event: 'subscription.created',
        payload: {},
      });

      await expect(processor.process(job)).rejects.toThrow('Connection refused');

      // Should still log the error
      expect(centralPrisma.client.webhookLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            success: false,
            statusCode: null,
          }),
        }),
      );
    });
  });

  describe('unknown job', () => {
    it('should not throw for unknown job type', async () => {
      const job = makeJob('UNKNOWN_TYPE', {});
      await expect(processor.process(job)).resolves.toBeUndefined();
    });
  });
});
