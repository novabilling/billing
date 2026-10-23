import { createHmac } from 'crypto';
import { WebhookProcessor } from '../../../src/queues/processors/webhook.processor';
import { WebhookJobType } from '../../../src/queues/billing.queue';
import { safePost } from '../../../src/common/net/safe-url';

jest.mock('../../../src/common/net/safe-url', () => ({ safePost: jest.fn() }));
const mockPost = safePost as jest.MockedFunction<typeof safePost>;

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
    mockPost.mockReset();
  });

  function makeJob(name: string, data: Record<string, unknown>, attemptsMade = 0) {
    return { name, data, attemptsMade } as any;
  }

  describe('handleSendWebhook', () => {
    it('delivers through the SSRF-safe client with v1 and timestamped v2 signatures', async () => {
      centralPrisma.client.tenant.findUnique.mockResolvedValue({
        webhookUrl: 'https://example.com/webhook',
        webhookSecret: 'test_secret',
      });
      mockPost.mockResolvedValue({ ok: true, status: 200, body: 'OK' });

      await processor.process(
        makeJob(WebhookJobType.SEND_WEBHOOK, { tenantId: 'tenant_1', event: 'invoice.created', payload: { invoiceId: 'inv_1' } }),
      );

      expect(mockPost).toHaveBeenCalledTimes(1);
      const [url, body, headers] = mockPost.mock.calls[0];
      expect(url).toBe('https://example.com/webhook');
      expect(headers['X-Event-Type']).toBe('invoice.created');
      expect(headers['X-Webhook-Signature']).toBe(createHmac('sha256', 'test_secret').update(body).digest('hex'));

      const ts = headers['X-Webhook-Timestamp'];
      expect(headers['X-Webhook-Signature-V2']).toBe(
        `t=${ts},v1=${createHmac('sha256', 'test_secret').update(`${ts}.${body}`).digest('hex')}`,
      );

      expect(centralPrisma.client.webhookLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ tenantId: 'tenant_1', event: 'invoice.created', success: true, statusCode: 200 }),
        }),
      );
    });

    it('throws on a failed delivery so BullMQ retries it', async () => {
      centralPrisma.client.tenant.findUnique.mockResolvedValue({ webhookUrl: 'https://example.com/webhook', webhookSecret: 's' });
      mockPost.mockResolvedValue({ ok: false, status: 500, body: 'err' });

      await expect(
        processor.process(makeJob(WebhookJobType.SEND_WEBHOOK, { tenantId: 'tenant_1', event: 'invoice.created', payload: {} })),
      ).rejects.toThrow('Webhook delivery failed with status 500');
      expect(centralPrisma.client.webhookLog.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ success: false, statusCode: 500 }) }),
      );
    });

    it('throws when the address is refused or unreachable', async () => {
      centralPrisma.client.tenant.findUnique.mockResolvedValue({ webhookUrl: 'https://internal.example/webhook', webhookSecret: 's' });
      mockPost.mockRejectedValue(new Error('Refusing to connect to non-public address for internal.example'));

      await expect(
        processor.process(makeJob(WebhookJobType.SEND_WEBHOOK, { tenantId: 'tenant_1', event: 'invoice.created', payload: {} })),
      ).rejects.toThrow('non-public address');
    });

    it('does nothing without a webhook URL', async () => {
      centralPrisma.client.tenant.findUnique.mockResolvedValue({ webhookUrl: null, webhookSecret: null });
      await processor.process(makeJob(WebhookJobType.SEND_WEBHOOK, { tenantId: 'tenant_1', event: 'x', payload: {} }));
      expect(mockPost).not.toHaveBeenCalled();
    });
  });
});
