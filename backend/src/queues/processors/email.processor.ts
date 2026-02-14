import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailService } from '../../services/email.service';
import { EMAIL_QUEUE, EmailJobType, SendEmailData } from '../billing.queue';

@Processor(EMAIL_QUEUE)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case EmailJobType.SEND_EMAIL:
        return this.handleSendEmail(job);
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }

  private async handleSendEmail(job: Job<SendEmailData>): Promise<void> {
    const { to, subject, template, context, tenantId, attachments } = job.data;
    this.logger.log(`Sending email to ${to}: ${subject}`);

    try {
      await this.emailService.sendMail(to, subject, template, context, tenantId, attachments);
      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
      throw error;
    }
  }
}
