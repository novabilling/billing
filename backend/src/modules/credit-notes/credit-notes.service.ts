import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { CreateCreditNoteDto, UpdateCreditNoteDto } from './dto/create-credit-note.dto';
import { WEBHOOK_QUEUE, WebhookJobType } from '../../queues/billing.queue';

@Injectable()
export class CreditNotesService {
  private readonly logger = new Logger(CreditNotesService.name);

  constructor(
    @InjectQueue(WEBHOOK_QUEUE) private readonly webhookQueue: Queue,
  ) {}

  async findAll(
    db: PrismaClient,
    query: {
      customerId?: string;
      status?: string;
      invoiceId?: string;
      page?: number;
      limit?: number;
    },
  ) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (query.customerId) where.customerId = query.customerId;
    if (query.status) where.status = query.status;
    if (query.invoiceId) where.invoiceId = query.invoiceId;

    const [data, total] = await Promise.all([
      db.creditNote.findMany({
        where,
        skip,
        take: limit,
        include: {
          invoice: { select: { id: true, invoiceNumber: true, amount: true, currency: true } },
          customer: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.creditNote.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(db: PrismaClient, id: string) {
    const creditNote = await db.creditNote.findUnique({
      where: { id },
      include: {
        invoice: {
          select: { id: true, invoiceNumber: true, amount: true, currency: true, status: true },
        },
        customer: { select: { id: true, name: true, email: true } },
      },
    });
    if (!creditNote) throw new NotFoundException('Credit note not found');
    return creditNote;
  }

  async create(db: PrismaClient, tenantId: string, dto: CreateCreditNoteDto) {
    const invoice = await db.invoice.findUnique({ where: { id: dto.invoiceId } });
    if (!invoice) throw new NotFoundException('Invoice not found');

    const customer = await db.customer.findUnique({ where: { id: dto.customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    if (invoice.customerId !== dto.customerId) {
      throw new BadRequestException('Invoice does not belong to this customer');
    }

    if (dto.amount > Number(invoice.amount)) {
      throw new BadRequestException('Credit note amount cannot exceed invoice amount');
    }

    // Check total credit notes don't exceed invoice amount
    const existingCredits = await db.creditNote.aggregate({
      where: { invoiceId: dto.invoiceId, status: { not: 'VOIDED' } },
      _sum: { amount: true },
    });
    const totalExisting = Number(existingCredits._sum.amount || 0);
    if (totalExisting + dto.amount > Number(invoice.amount)) {
      throw new BadRequestException(
        `Total credit notes (${totalExisting + dto.amount}) would exceed invoice amount (${invoice.amount})`,
      );
    }

    const creditNote = await db.creditNote.create({
      data: {
        invoiceId: dto.invoiceId,
        customerId: dto.customerId,
        amount: dto.amount,
        currency: dto.currency.toUpperCase(),
        reason: dto.reason,
        metadata: dto.metadata as any,
      },
      include: {
        invoice: { select: { id: true, invoiceNumber: true, amount: true } },
        customer: { select: { id: true, name: true, email: true } },
      },
    });

    await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
      tenantId,
      event: 'credit_note.created',
      payload: {
        creditNoteId: creditNote.id,
        invoiceId: dto.invoiceId,
        customerId: dto.customerId,
        amount: dto.amount,
        currency: dto.currency.toUpperCase(),
        reason: dto.reason,
      },
    });

    return creditNote;
  }

  async update(db: PrismaClient, id: string, dto: UpdateCreditNoteDto) {
    const creditNote = await db.creditNote.findUnique({ where: { id } });
    if (!creditNote) throw new NotFoundException('Credit note not found');

    if (creditNote.status !== 'DRAFT') {
      throw new BadRequestException('Only draft credit notes can be updated');
    }

    if (dto.amount !== undefined) {
      const invoice = await db.invoice.findUnique({ where: { id: creditNote.invoiceId } });
      const otherCredits = await db.creditNote.aggregate({
        where: { invoiceId: creditNote.invoiceId, status: { not: 'VOIDED' }, id: { not: id } },
        _sum: { amount: true },
      });
      const totalOthers = Number(otherCredits._sum.amount || 0);
      if (totalOthers + dto.amount > Number(invoice!.amount)) {
        throw new BadRequestException('Total credit notes would exceed invoice amount');
      }
    }

    const data: Record<string, unknown> = {};
    if (dto.amount !== undefined) data.amount = dto.amount;
    if (dto.reason !== undefined) data.reason = dto.reason;
    if (dto.metadata !== undefined) data.metadata = dto.metadata;

    return db.creditNote.update({
      where: { id },
      data,
      include: {
        invoice: { select: { id: true, invoiceNumber: true, amount: true } },
        customer: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async finalize(db: PrismaClient, tenantId: string, id: string) {
    const creditNote = await db.creditNote.findUnique({ where: { id } });
    if (!creditNote) throw new NotFoundException('Credit note not found');

    if (creditNote.status !== 'DRAFT') {
      throw new BadRequestException('Only draft credit notes can be finalized');
    }

    const updated = await db.creditNote.update({
      where: { id },
      data: { status: 'FINALIZED' },
      include: {
        invoice: { select: { id: true, invoiceNumber: true, amount: true } },
        customer: { select: { id: true, name: true, email: true } },
      },
    });

    await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
      tenantId,
      event: 'credit_note.finalized',
      payload: {
        creditNoteId: id,
        invoiceId: creditNote.invoiceId,
        customerId: creditNote.customerId,
        amount: Number(creditNote.amount),
        currency: creditNote.currency,
      },
    });

    return updated;
  }

  async void(db: PrismaClient, tenantId: string, id: string) {
    const creditNote = await db.creditNote.findUnique({ where: { id } });
    if (!creditNote) throw new NotFoundException('Credit note not found');

    if (creditNote.status === 'VOIDED') {
      throw new BadRequestException('Credit note is already voided');
    }

    const updated = await db.creditNote.update({
      where: { id },
      data: { status: 'VOIDED' },
      include: {
        invoice: { select: { id: true, invoiceNumber: true, amount: true } },
        customer: { select: { id: true, name: true, email: true } },
      },
    });

    await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
      tenantId,
      event: 'credit_note.voided',
      payload: {
        creditNoteId: id,
        invoiceId: creditNote.invoiceId,
        customerId: creditNote.customerId,
        amount: Number(creditNote.amount),
        currency: creditNote.currency,
      },
    });

    return updated;
  }
}
