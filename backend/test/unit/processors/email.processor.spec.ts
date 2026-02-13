import { EmailProcessor } from '../../../src/queues/processors/email.processor';
import { EmailJobType } from '../../../src/queues/billing.queue';

describe('EmailProcessor', () => {
  let processor: EmailProcessor;
  let emailService: { sendMail: jest.Mock };

  beforeEach(() => {
    emailService = { sendMail: jest.fn().mockResolvedValue(undefined) };
    processor = new EmailProcessor(emailService as any);
  });

  function makeJob(name: string, data: Record<string, unknown>) {
    return { name, data, attemptsMade: 0 } as any;
  }

  describe('process', () => {
    it('should send an email for SEND_EMAIL job', async () => {
      const job = makeJob(EmailJobType.SEND_EMAIL, {
        to: 'user@example.com',
        subject: 'Test Subject',
        template: 'payment-confirmation',
        context: { customerName: 'John', amount: '49.00', currency: 'USD' },
        tenantId: 'tenant_1',
      });

      await processor.process(job);

      expect(emailService.sendMail).toHaveBeenCalledWith(
        'user@example.com',
        'Test Subject',
        'payment-confirmation',
        { customerName: 'John', amount: '49.00', currency: 'USD' },
        'tenant_1',
      );
    });

    it('should throw when email service fails', async () => {
      emailService.sendMail.mockRejectedValue(new Error('SMTP timeout'));

      const job = makeJob(EmailJobType.SEND_EMAIL, {
        to: 'user@example.com',
        subject: 'Test',
        template: 'invoice',
        context: {},
      });

      await expect(processor.process(job)).rejects.toThrow('SMTP timeout');
    });

    it('should not throw for unknown job type', async () => {
      const job = makeJob('UNKNOWN_TYPE', {});
      await expect(processor.process(job)).resolves.toBeUndefined();
    });
  });
});
