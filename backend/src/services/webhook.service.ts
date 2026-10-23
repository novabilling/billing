import { Injectable, Logger } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { CentralPrismaService } from '../database/central-prisma.service';
import { safePost } from '../common/net/safe-url';

/**
 * Signature headers for an outbound webhook. `X-Webhook-Signature-V2` signs
 * `<timestamp>.<body>`, so a receiver that checks the timestamp is recent
 * cannot be replayed; `X-Webhook-Signature` (body only) is kept for receivers
 * that have not moved to v2 yet.
 */
export function webhookHeaders(secret: string | null, body: string, event: string, now = Date.now()): Record<string, string> {
  const timestamp = String(Math.floor(now / 1000));
  return {
    'Content-Type': 'application/json',
    'X-Event-Type': event,
    'X-Webhook-Timestamp': timestamp,
    'X-Webhook-Signature': secret ? createHmac('sha256', secret).update(body).digest('hex') : '',
    'X-Webhook-Signature-V2': secret ? `t=${timestamp},v1=${createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex')}` : '',
  };
}

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(private readonly centralPrisma: CentralPrismaService) {}

  async sendWebhook(
    tenantId: string,
    event: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    const tenant = await this.centralPrisma.client.tenant.findUnique({
      where: { id: tenantId },
      select: { webhookUrl: true, webhookSecret: true },
    });

    if (!tenant?.webhookUrl) {
      this.logger.debug(`No webhook URL for tenant ${tenantId}`);
      return;
    }

    const body = JSON.stringify({
      event,
      data: payload,
      timestamp: new Date().toISOString(),
    });

    let statusCode: number | null = null;
    let responseBody: string | null = null;
    let success = false;

    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await safePost(tenant.webhookUrl, body, webhookHeaders(tenant.webhookSecret, body, event));

        statusCode = response.status;
        responseBody = response.body || null;
        success = response.ok;

        if (success) break;
      } catch (error) {
        this.logger.warn(
          `Webhook attempt ${attempt}/${maxAttempts} failed for tenant ${tenantId}: ${
            error instanceof Error ? error.message : 'Unknown'
          }`,
        );

        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    await this.centralPrisma.client.webhookLog.create({
      data: {
        tenantId,
        event,
        url: tenant.webhookUrl,
        payload: payload as any,
        response: responseBody ? { body: responseBody } : undefined,
        statusCode,
        success,
        attemptCount: success ? 1 : maxAttempts,
      },
    });

    if (success) {
      this.logger.log(`Webhook ${event} delivered to tenant ${tenantId}`);
    } else {
      this.logger.error(
        `Webhook ${event} delivery failed for tenant ${tenantId} after ${maxAttempts} attempts`,
      );
    }
  }

  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const expected = Buffer.from(createHmac('sha256', secret).update(payload).digest('hex'));
    const given = Buffer.from(signature);
    return expected.length === given.length && timingSafeEqual(expected, given);
  }
}
