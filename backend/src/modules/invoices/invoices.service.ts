import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceQueryDto } from './dto/invoice-query.dto';
import { EncryptionService } from '../../services/encryption.service';
import { PdfService } from '../../services/pdf.service';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { ProviderFactory } from '../../providers/provider.factory';
import {
  EMAIL_QUEUE,
  WEBHOOK_QUEUE,
  EmailJobType,
  WebhookJobType,
} from '../../queues/billing.queue';

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name);

  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly pdfService: PdfService,
    private readonly centralPrisma: CentralPrismaService,
    @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
    @InjectQueue(WEBHOOK_QUEUE) private readonly webhookQueue: Queue,
  ) {}

  async generateInvoiceNumber(db: PrismaClient): Promise<string> {
    const lastInvoice = await db.invoice.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { invoiceNumber: true },
    });

    let nextSeq = 1;
    if (lastInvoice?.invoiceNumber) {
      const match = lastInvoice.invoiceNumber.match(/INV-(\d+)/);
      if (match) nextSeq = parseInt(match[1], 10) + 1;
    }

    return `INV-${String(nextSeq).padStart(5, '0')}`;
  }

  private async getTenantInfo(tenantId: string) {
    const tenant = await this.centralPrisma.client.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true, email: true, settings: true },
    });
    const settings = (tenant?.settings || {}) as Record<string, unknown>;
    return {
      name: tenant?.name || 'Invoice',
      email: tenant?.email,
      address: settings.address as string | undefined,
      country: settings.country as string | undefined,
      taxId: settings.taxId as string | undefined,
    };
  }

  async findAll(db: PrismaClient, query: InvoiceQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.customerId) where.customerId = query.customerId;
    if (query.dateFrom || query.dateTo) {
      where.createdAt = {
        ...(query.dateFrom && { gte: new Date(query.dateFrom) }),
        ...(query.dateTo && { lte: new Date(query.dateTo) }),
      };
    }

    const [data, total] = await Promise.all([
      db.invoice.findMany({
        where,
        skip,
        take: limit,
        include: { customer: true },
        orderBy: { createdAt: 'desc' },
      }),
      db.invoice.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(db: PrismaClient, id: string) {
    const invoice = await db.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        subscription: true,
        payments: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async create(db: PrismaClient, tenantId: string, dto: CreateInvoiceDto) {
    const customer = await db.customer.findUnique({
      where: { id: dto.customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const totalAmount = dto.items.reduce((sum, item) => sum + item.quantity * item.unitAmount, 0);
    const invoiceNumber = dto.invoiceNumber || await this.generateInvoiceNumber(db);
    const currency = dto.currency?.toUpperCase() || customer.currency;

    const invoice = await db.invoice.create({
      data: {
        invoiceNumber,
        customerId: dto.customerId,
        subscriptionId: dto.subscriptionId,
        amount: totalAmount,
        currency,
        dueDate: new Date(dto.dueDate),
        metadata: { items: dto.items } as any,
        ...(dto.status && { status: dto.status }),
        ...(dto.paidAt && { paidAt: new Date(dto.paidAt) }),
        ...(dto.createdAt && { createdAt: new Date(dto.createdAt) }),
      },
      include: { customer: true },
    });

    // Generate PDF for the new invoice
    const tenantInfo = await this.getTenantInfo(tenantId);
    try {
      const pdfBuffer = await this.pdfService.generateInvoicePDF(
        {
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          amount: totalAmount,
          currency: customer.currency,
          status: invoice.status,
          dueDate: new Date(dto.dueDate),
          createdAt: invoice.createdAt,
          metadata: { items: dto.items },
        },
        {
          name: customer.name,
          email: customer.email,
          country: customer.country,
        },
        tenantInfo,
      );
      const filename = `invoice-${invoice.id}.pdf`;
      await this.pdfService.savePdf(pdfBuffer, filename);
      const pdfUrl = this.pdfService.getPublicUrl(filename);

      await db.invoice.update({
        where: { id: invoice.id },
        data: { pdfUrl },
      });

      (invoice as any).pdfUrl = pdfUrl;
      this.logger.log(`PDF generated for invoice ${invoice.id}`);
    } catch (error) {
      this.logger.error(`Failed to generate PDF for invoice ${invoice.id}`, error);
    }

    return invoice;
  }

  async finalize(db: PrismaClient, tenantId: string, id: string) {
    const invoice = await db.invoice.findUnique({
      where: { id },
      include: { customer: true },
    });
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status !== 'DRAFT') {
      throw new BadRequestException('Only draft invoices can be finalized');
    }

    const updated = await db.invoice.update({
      where: { id },
      data: { status: 'PENDING' },
      include: { customer: true },
    });

    // Email customer the finalized invoice with PDF attachment
    if (invoice.customer?.email) {
      const tenantInfo = await this.getTenantInfo(tenantId);
      let pdfAttachments: { filename: string; content: string; contentType: string }[] | undefined;
      try {
        const pdfBuffer = await this.generateOrGetPdf(db, tenantId, id);
        pdfAttachments = [{
          filename: `${invoice.invoiceNumber || 'invoice'}.pdf`,
          content: pdfBuffer.toString('base64'),
          contentType: 'application/pdf',
        }];
      } catch (error) {
        this.logger.error(`Failed to generate PDF attachment for invoice ${id}`, error);
      }

      await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
        tenantId,
        to: invoice.customer.email,
        subject: `Invoice ${invoice.invoiceNumber} from ${tenantInfo.name}`,
        template: 'invoice',
        context: {
          tenantName: tenantInfo.name,
          customerName: invoice.customer.name || invoice.customer.email,
          invoiceId: invoice.invoiceNumber,
          amount: PdfService.formatAmount(invoice.amount, invoice.currency),
          currency: invoice.currency,
          dueDate: invoice.dueDate?.toISOString().split('T')[0] || '',
        },
        attachments: pdfAttachments,
      });
    }

    // Webhook
    await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
      tenantId,
      event: 'invoice.finalized',
      payload: {
        invoiceId: id,
        invoiceNumber: invoice.invoiceNumber,
        customerId: invoice.customerId,
        amount: Number(invoice.amount),
        currency: invoice.currency,
      },
    });

    return updated;
  }

  async void(db: PrismaClient, tenantId: string, id: string) {
    const invoice = await db.invoice.findUnique({
      where: { id },
      include: { customer: true },
    });
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status === 'PAID') {
      throw new BadRequestException('Cannot void a paid invoice');
    }

    const updated = await db.invoice.update({
      where: { id },
      data: { status: 'CANCELED' },
      include: { customer: true },
    });

    // Email customer
    if (invoice.customer?.email) {
      const tenantInfo = await this.getTenantInfo(tenantId);
      await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
        tenantId,
        to: invoice.customer.email,
        subject: `Invoice ${invoice.invoiceNumber} voided — ${tenantInfo.name}`,
        template: 'invoice-voided',
        context: {
          tenantName: tenantInfo.name,
          customerName: invoice.customer.name || invoice.customer.email,
          invoiceId: invoice.invoiceNumber,
        },
      });
    }

    // Webhook
    await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
      tenantId,
      event: 'invoice.voided',
      payload: {
        invoiceId: id,
        invoiceNumber: invoice.invoiceNumber,
        customerId: invoice.customerId,
      },
    });

    return updated;
  }

  async markPaid(db: PrismaClient, tenantId: string, id: string, paymentMethod?: string) {
    const invoice = await db.invoice.findUnique({
      where: { id },
      include: { customer: true },
    });
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status === 'PAID') {
      throw new BadRequestException('Invoice is already paid');
    }

    const now = new Date();
    const provider = paymentMethod || 'manual';

    const [updatedInvoice] = await Promise.all([
      db.invoice.update({
        where: { id },
        data: { status: 'PAID', paidAt: now },
        include: { customer: true },
      }),
      db.payment.create({
        data: {
          invoiceId: id,
          provider,
          amount: invoice.amount,
          currency: invoice.currency,
          status: 'SUCCEEDED',
        },
      }),
    ]);

    // Email customer
    if (invoice.customer?.email) {
      const tenantInfo = await this.getTenantInfo(tenantId);
      await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
        tenantId,
        to: invoice.customer.email,
        subject: `Payment received for ${invoice.invoiceNumber} — ${tenantInfo.name}`,
        template: 'invoice-paid',
        context: {
          tenantName: tenantInfo.name,
          customerName: invoice.customer.name || invoice.customer.email,
          invoiceId: invoice.invoiceNumber,
          amount: PdfService.formatAmount(invoice.amount, invoice.currency),
          currency: invoice.currency,
        },
      });
    }

    // Webhook
    await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
      tenantId,
      event: 'invoice.paid',
      payload: {
        invoiceId: id,
        invoiceNumber: invoice.invoiceNumber,
        customerId: invoice.customerId,
        amount: Number(invoice.amount),
        currency: invoice.currency,
      },
    });

    return updatedInvoice;
  }

  async generateOrGetPdf(db: PrismaClient, tenantId: string, id: string): Promise<Buffer> {
    const invoice = await db.invoice.findUnique({
      where: { id },
      include: { customer: true },
    });
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    const tenantInfo = await this.getTenantInfo(tenantId);

    const pdfBuffer = await this.pdfService.generateInvoicePDF(
      {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        amount: String(invoice.amount),
        currency: invoice.currency,
        status: invoice.status,
        dueDate: invoice.dueDate,
        createdAt: invoice.createdAt,
        metadata: invoice.metadata as Record<string, unknown> | null,
      },
      {
        name: invoice.customer?.name,
        email: invoice.customer?.email || '',
        country: invoice.customer?.country,
      },
      tenantInfo,
    );

    // Save and update pdfUrl if not already set
    if (!invoice.pdfUrl) {
      try {
        const filename = `invoice-${invoice.id}.pdf`;
        await this.pdfService.savePdf(pdfBuffer, filename);
        const pdfUrl = this.pdfService.getPublicUrl(filename);
        await db.invoice.update({
          where: { id: invoice.id },
          data: { pdfUrl },
        });
      } catch (error) {
        this.logger.error(`Failed to save PDF for invoice ${id}`, error);
      }
    }

    return pdfBuffer;
  }

  async sendEmail(db: PrismaClient, tenantId: string, id: string, recipientEmail?: string) {
    const invoice = await db.invoice.findUnique({
      where: { id },
      include: { customer: true },
    });
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    const email = recipientEmail || invoice.customer?.email;
    if (!email) {
      throw new BadRequestException('No email address provided and customer has no email');
    }

    const tenantInfo = await this.getTenantInfo(tenantId);

    let pdfAttachments: { filename: string; content: string; contentType: string }[] | undefined;
    try {
      const pdfBuffer = await this.generateOrGetPdf(db, tenantId, id);
      pdfAttachments = [{
        filename: `${invoice.invoiceNumber || 'invoice'}.pdf`,
        content: pdfBuffer.toString('base64'),
        contentType: 'application/pdf',
      }];
    } catch (error) {
      this.logger.error(`Failed to generate PDF attachment for invoice ${id}`, error);
    }

    await this.emailQueue.add(EmailJobType.SEND_EMAIL, {
      tenantId,
      to: email,
      subject: `Invoice ${invoice.invoiceNumber} from ${tenantInfo.name}`,
      template: 'invoice',
      context: {
        tenantName: tenantInfo.name,
        customerName: invoice.customer?.name || email,
        invoiceId: invoice.invoiceNumber,
        amount: PdfService.formatAmount(invoice.amount, invoice.currency),
        currency: invoice.currency,
        dueDate: invoice.dueDate?.toISOString().split('T')[0] || '',
      },
      attachments: pdfAttachments,
    });

    return { message: `Invoice email queued for ${email}` };
  }

  async createCheckout(db: PrismaClient, id: string, callbackUrl?: string) {
    const invoice = await db.invoice.findUnique({
      where: { id },
      include: { customer: true },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status === 'PAID') {
      throw new BadRequestException('Invoice is already paid');
    }

    if (invoice.status === 'CANCELED') {
      throw new BadRequestException('Invoice has been voided');
    }

    // Get the highest-priority active payment provider
    const providerConfig = await db.paymentProvider.findFirst({
      where: { isActive: true },
      orderBy: { priority: 'asc' },
    });

    if (!providerConfig) {
      throw new BadRequestException('No active payment provider configured');
    }

    const credentials = JSON.parse(this.encryptionService.decrypt(providerConfig.credentials));
    const provider = ProviderFactory.create(providerConfig.providerName, credentials);

    // Create a pending payment record
    const payment = await db.payment.create({
      data: {
        invoiceId: id,
        provider: providerConfig.providerName,
        amount: invoice.amount,
        currency: invoice.currency,
        status: 'PROCESSING',
      },
    });

    // Initiate the charge to get a payment URL
    const result = await provider.charge({
      amount: Number(invoice.amount),
      currency: invoice.currency,
      email: invoice.customer.email,
      customerName: invoice.customer.name ?? undefined,
      reference: invoice.id,
      callbackUrl,
      paymentOptions: 'card',
      metadata: { invoiceId: id, paymentId: payment.id },
    });

    if (!result.success) {
      await db.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED', failureReason: result.error },
      });
      throw new BadRequestException(result.error || 'Failed to create checkout session');
    }

    // Update payment with transaction ID
    await db.payment.update({
      where: { id: payment.id },
      data: { providerTransactionId: result.transactionId },
    });

    return {
      checkoutUrl: result.paymentUrl,
      paymentId: payment.id,
      provider: providerConfig.providerName,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min
    };
  }
}
