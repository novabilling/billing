import { Injectable, Logger } from '@nestjs/common';
import { createHmac } from 'crypto';
import { CentralPrismaService } from '../database/central-prisma.service';

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

    const signature = tenant.webhookSecret
      ? createHmac('sha256', tenant.webhookSecret).update(body).digest('hex')
      : '';

    let statusCode: number | null = null;
    let responseBody: string | null = null;
    let success = false;

    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await fetch(tenant.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
            'X-Event-Type': event,
          },
          body,
          signal: AbortSignal.timeout(10000),
        });

        statusCode = response.status;
        responseBody = await response.text().catch(() => null);
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
    const expected = createHmac('sha256', secret).update(payload).digest('hex');
    return expected === signature;
  }
}
