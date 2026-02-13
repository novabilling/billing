import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { createHmac } from 'crypto';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { WEBHOOK_QUEUE, WebhookJobType, SendWebhookData } from '../billing.queue';

@Processor(WEBHOOK_QUEUE)
export class WebhookProcessor extends WorkerHost {
  private readonly logger = new Logger(WebhookProcessor.name);

  constructor(private readonly centralPrisma: CentralPrismaService) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case WebhookJobType.SEND_WEBHOOK:
        return this.handleSendWebhook(job);
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }

  private async handleSendWebhook(job: Job<SendWebhookData>): Promise<void> {
    const { tenantId, event, payload } = job.data;
    this.logger.log(`Sending webhook ${event} to tenant ${tenantId}`);

    const tenant = await this.centralPrisma.client.tenant.findUnique({
      where: { id: tenantId },
      select: { webhookUrl: true, webhookSecret: true },
    });

    if (!tenant?.webhookUrl) {
      this.logger.debug(`No webhook URL configured for tenant ${tenantId}`);
      return;
    }

    const body = JSON.stringify({ event, data: payload, timestamp: new Date().toISOString() });

    const signature = tenant.webhookSecret
      ? createHmac('sha256', tenant.webhookSecret).update(body).digest('hex')
      : '';

    let statusCode: number | null = null;
    let responseBody: string | null = null;
    let success = false;
    let errorMessage: string | null = null;

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

      if (!success) {
        errorMessage = `Webhook delivery failed with status ${statusCode}`;
        this.logger.warn(`${errorMessage} for tenant ${tenantId}`);
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Webhook delivery error for tenant ${tenantId}`, error);
    }

    // Log the attempt (success or failure) before throwing error
    await this.centralPrisma.client.webhookLog.create({
      data: {
        tenantId,
        event,
        url: tenant.webhookUrl,
        payload: payload as any,
        response: (responseBody ? { body: responseBody } : null) as any,
        statusCode,
        success,
        attemptCount: job.attemptsMade + 1,
      },
    });

    // Throw error to trigger BullMQ retry mechanism (3 attempts with exponential backoff)
    if (!success) {
      throw new Error(errorMessage || 'Webhook delivery failed');
    }
  }
}
