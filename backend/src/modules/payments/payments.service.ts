import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { PdfService } from '../../services/pdf.service';
import { PaymentQueryDto } from './dto/payment-query.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import {
  EMAIL_QUEUE,
  WEBHOOK_QUEUE,
  EmailJobType,
  WebhookJobType,
} from '../../queues/billing.queue';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly centralPrisma: CentralPrismaService,
    @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
    @InjectQueue(WEBHOOK_QUEUE) private readonly webhookQueue: Queue,
  ) {}

  private async getTenantName(tenantId: string): Promise<string> {
    const tenant = await this.centralPrisma.client.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true },
    });
    return tenant?.name || 'Your billing provider';
  }

  async findAll(db: PrismaClient, query: PaymentQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.provider) where.provider = query.provider;
    if (query.invoiceId) where.invoiceId = query.invoiceId;
    if (query.dateFrom || query.dateTo) {
      where.createdAt = {
        ...(query.dateFrom && { gte: new Date(query.dateFrom) }),
        ...(query.dateTo && { lte: new Date(query.dateTo) }),
      };
    }

    const [data, total] = await Promise.all([
      db.payment.findMany({
        where,
        skip,
        take: limit,
        include: {
          invoice: { include: { customer: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.payment.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(db: PrismaClient, id: string) {
    const payment = await db.payment.findUnique({
      where: { id },
      include: {
        invoice: { include: { customer: true } },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async refund(db: PrismaClient, tenantId: string, id: string, dto: RefundPaymentDto) {
    const payment = await db.payment.findUnique({
      where: { id },
      include: { invoice: { include: { customer: true } } },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== 'SUCCEEDED') {
      throw new BadRequestException('Only succeeded payments can be refunded');
    }

    const refundAmount = dto.amount ?? Number(payment.amount);

    if (refundAmount > Number(payment.amount)) {
      throw new BadRequestException('Refund amount exceeds payment amount');
    }

    const updatedPayment = await db.payment.update({
      where: { id },
      data: {
        status: 'REFUNDED',
        metadata: {
          ...(payment.metadata as Record<string, unknown> || {}),
          refundAmount,
          refundReason: dto.reason,
          refundedAt: new Date().toISOString(),
        },
      },
      include: { invoice: { include: { customer: true } } },
    });

    // Email customer about refund
    const customer = (payment.invoice as any)?.customer;
    if (customer?.email) {
      const tenantName = await this.getTenantName(tenantId);
      await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
        tenantId,
        to: customer.email,
        subject: `Refund processed — ${tenantName}`,
        template: 'payment-refunded',
        context: {
          tenantName,
          customerName: customer.name || customer.email,
          amount: PdfService.formatAmount(refundAmount, payment.currency),
          currency: payment.currency,
        },
      });
    }

    // Webhook: payment.refunded
    await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
      tenantId,
      event: 'payment.refunded',
      payload: {
        paymentId: id,
        invoiceId: payment.invoiceId,
        refundAmount,
        currency: payment.currency,
      },
    });

    return updatedPayment;
  }
}
