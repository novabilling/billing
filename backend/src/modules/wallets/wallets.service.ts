import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { CreateWalletDto, UpdateWalletDto, TopUpWalletDto } from './dto/create-wallet.dto';
import { WEBHOOK_QUEUE, WebhookJobType } from '../../queues/billing.queue';

@Injectable()
export class WalletsService {
  private readonly logger = new Logger(WalletsService.name);

  constructor(
    @InjectQueue(WEBHOOK_QUEUE) private readonly webhookQueue: Queue,
  ) {}

  // --- Conversion helpers ---

  private creditsToAmount(credits: number, rateAmount: number): number {
    return Math.round(credits * rateAmount * 10000) / 10000;
  }

  private amountToCredits(amount: number, rateAmount: number): number {
    return Math.round((amount / rateAmount) * 10000) / 10000;
  }

  // --- CRUD ---

  async create(db: PrismaClient, tenantId: string, dto: CreateWalletDto) {
    const customer = await db.customer.findUnique({ where: { id: dto.customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    const rateAmount = dto.rateAmount || 1;

    const wallet = await db.wallet.create({
      data: {
        customerId: dto.customerId,
        name: dto.name || null,
        currency: dto.currency.toUpperCase(),
        rateAmount,
        expirationAt: dto.expirationAt ? new Date(dto.expirationAt) : null,
        metadata: dto.metadata as any,
        ...(dto.createdAt && { createdAt: new Date(dto.createdAt) }),
      },
      include: { customer: true },
    });

    // Grant free credits (settled immediately)
    if (dto.grantedCredits && dto.grantedCredits > 0) {
      await this.addCredits(db, wallet.id, dto.grantedCredits, 'GRANTED', tenantId);
    }

    // Add paid credits (settled immediately — invoice generation optional)
    if (dto.paidCredits && dto.paidCredits > 0) {
      await this.addCredits(db, wallet.id, dto.paidCredits, 'PURCHASED', tenantId);
    }

    await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
      tenantId,
      event: 'wallet.created',
      payload: { walletId: wallet.id, customerId: dto.customerId, currency: wallet.currency },
    });

    return this.findOne(db, wallet.id);
  }

  async findAll(db: PrismaClient, query: { customerId?: string; status?: string; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (query.customerId) where.customerId = query.customerId;
    if (query.status) where.status = query.status;

    const [data, total] = await Promise.all([
      db.wallet.findMany({
        where,
        skip,
        take: limit,
        include: { customer: true },
        orderBy: { createdAt: 'desc' },
      }),
      db.wallet.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(db: PrismaClient, id: string) {
    const wallet = await db.wallet.findUnique({
      where: { id },
      include: { customer: true },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async update(db: PrismaClient, tenantId: string, id: string, dto: UpdateWalletDto) {
    const wallet = await db.wallet.findUnique({ where: { id } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.status === 'TERMINATED') throw new BadRequestException('Cannot update a terminated wallet');

    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.expirationAt !== undefined) data.expirationAt = dto.expirationAt ? new Date(dto.expirationAt) : null;
    if (dto.metadata !== undefined) data.metadata = dto.metadata as any;

    await db.wallet.update({ where: { id }, data });

    await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
      tenantId,
      event: 'wallet.updated',
      payload: { walletId: id, customerId: wallet.customerId },
    });

    return this.findOne(db, id);
  }

  async terminate(db: PrismaClient, tenantId: string, id: string) {
    const wallet = await db.wallet.findUnique({ where: { id } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.status === 'TERMINATED') throw new BadRequestException('Wallet is already terminated');

    const now = new Date();
    const remaining = Number(wallet.creditsBalance);

    // Void any remaining credits
    if (remaining > 0) {
      const voidAmount = this.creditsToAmount(remaining, Number(wallet.rateAmount));
      await db.walletTransaction.create({
        data: {
          walletId: id,
          transactionType: 'OUTBOUND',
          status: 'SETTLED',
          transactionStatus: 'VOIDED',
          creditAmount: remaining,
          amount: voidAmount,
          settledAt: now,
          metadata: { reason: 'wallet_terminated' } as any,
        },
      });
    }

    const terminated = await db.wallet.update({
      where: { id },
      data: {
        status: 'TERMINATED',
        terminatedAt: now,
        creditsBalance: 0,
        balance: 0,
      },
      include: { customer: true },
    });

    await this.webhookQueue.add(WebhookJobType.SEND_WEBHOOK, {
      tenantId,
      event: 'wallet.terminated',
      payload: { walletId: id, customerId: wallet.customerId },
    });

    return terminated;
  }

  // --- Transactions ---

  async topUp(db: PrismaClient, tenantId: string, dto: TopUpWalletDto) {
    const wallet = await db.wallet.findUnique({ where: { id: dto.walletId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.status === 'TERMINATED') throw new BadRequestException('Cannot top up a terminated wallet');

    const results: any[] = [];

    if (dto.voidedCredits && dto.voidedCredits > 0) {
      if (dto.voidedCredits > Number(wallet.creditsBalance)) {
        throw new BadRequestException(
          `Cannot void ${dto.voidedCredits} credits — only ${wallet.creditsBalance} available`,
        );
      }
      results.push(await this.removeCredits(db, wallet.id, dto.voidedCredits, 'VOIDED', tenantId, undefined, dto.metadata));
    }

    if (dto.grantedCredits && dto.grantedCredits > 0) {
      results.push(await this.addCredits(db, wallet.id, dto.grantedCredits, 'GRANTED', tenantId, dto.metadata));
    }

    if (dto.paidCredits && dto.paidCredits > 0) {
      results.push(await this.addCredits(db, wallet.id, dto.paidCredits, 'PURCHASED', tenantId, dto.metadata));
    }

    if (results.length === 0) {
      throw new BadRequestException('Specify at least one of: paidCredits, grantedCredits, voidedCredits');
    }

    return { transactions: results, wallet: await this.findOne(db, wallet.id) };
  }

  async listTransactions(
    db: PrismaClient,
    walletId: string,
    query: { status?: string; transactionStatus?: string; transactionType?: string; page?: number; limit?: number },
  ) {
    const wallet = await db.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { walletId };
    if (query.status) where.status = query.status;
    if (query.transactionStatus) where.transactionStatus = query.transactionStatus;
    if (query.transactionType) where.transactionType = query.transactionType;

    const [data, total] = await Promise.all([
      db.walletTransaction.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      db.walletTransaction.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  // --- Balance helpers ---

  private async addCredits(
    db: PrismaClient,
    walletId: string,
    credits: number,
    kind: 'GRANTED' | 'PURCHASED',
    tenantId: string,
    metadata?: Record<string, unknown>,
  ) {
    const wallet = await db.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const amount = this.creditsToAmount(credits, Number(wallet.rateAmount));
    const now = new Date();

    const txn = await db.walletTransaction.create({
      data: {
        walletId,
        transactionType: 'INBOUND',
        status: 'SETTLED',
        transactionStatus: kind,
        creditAmount: credits,
        amount,
        settledAt: now,
        metadata: metadata as any,
      },
    });

    await db.wallet.update({
      where: { id: walletId },
      data: {
        creditsBalance: { increment: credits },
        balance: { increment: amount },
      },
    });

    return txn;
  }

  private async removeCredits(
    db: PrismaClient,
    walletId: string,
    credits: number,
    kind: 'VOIDED' | 'INVOICED',
    tenantId: string,
    invoiceId?: string,
    metadata?: Record<string, unknown>,
  ) {
    const wallet = await db.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const amount = this.creditsToAmount(credits, Number(wallet.rateAmount));
    const now = new Date();

    const txn = await db.walletTransaction.create({
      data: {
        walletId,
        transactionType: 'OUTBOUND',
        status: 'SETTLED',
        transactionStatus: kind,
        creditAmount: credits,
        amount,
        invoiceId,
        settledAt: now,
        metadata: metadata as any,
      },
    });

    await db.wallet.update({
      where: { id: walletId },
      data: {
        creditsBalance: { decrement: credits },
        balance: { decrement: amount },
        consumedCredits: { increment: credits },
        consumedAmount: { increment: amount },
        ...(kind === 'INVOICED' ? {} : {}),
      },
    });

    return txn;
  }

  // --- Invoice integration ---

  /**
   * Auto-deduct wallet credits from an invoice during finalization.
   * Wallets are applied in creation order (oldest first), after coupons.
   * Returns the total monetary amount deducted.
   */
  async applyToInvoice(
    db: PrismaClient,
    tenantId: string,
    customerId: string,
    invoiceId: string,
    invoiceAmount: number,
    currency: string,
  ): Promise<number> {
    if (invoiceAmount <= 0) return 0;

    const wallets = await db.wallet.findMany({
      where: {
        customerId,
        status: 'ACTIVE',
        currency: currency.toUpperCase(),
        balance: { gt: 0 },
        OR: [{ expirationAt: null }, { expirationAt: { gt: new Date() } }],
      },
      orderBy: { createdAt: 'asc' },
    });

    let remaining = invoiceAmount;
    let totalDeducted = 0;

    for (const wallet of wallets) {
      if (remaining <= 0) break;

      const walletBalance = Number(wallet.balance);
      const deductAmount = Math.min(remaining, walletBalance);
      const deductCredits = this.amountToCredits(deductAmount, Number(wallet.rateAmount));

      if (deductAmount <= 0) continue;

      await this.removeCredits(db, wallet.id, deductCredits, 'INVOICED', tenantId, invoiceId);

      remaining -= deductAmount;
      totalDeducted += deductAmount;

      this.logger.log(
        `Wallet ${wallet.id}: deducted ${deductCredits} credits (${deductAmount} ${currency}) for invoice ${invoiceId}`,
      );
    }

    return totalDeducted;
  }

  // --- Expiration (called by cron) ---

  async processExpirations(db: PrismaClient, tenantId: string): Promise<number> {
    const expired = await db.wallet.findMany({
      where: {
        status: 'ACTIVE',
        expirationAt: { lte: new Date() },
        creditsBalance: { gt: 0 },
      },
    });

    for (const wallet of expired) {
      const remaining = Number(wallet.creditsBalance);
      if (remaining > 0) {
        await this.removeCredits(db, wallet.id, remaining, 'VOIDED', tenantId, undefined, { reason: 'expired' });
      }
      await db.wallet.update({
        where: { id: wallet.id },
        data: { status: 'TERMINATED', terminatedAt: new Date() },
      });
      this.logger.log(`Wallet ${wallet.id} expired — voided ${remaining} credits`);
    }

    return expired.length;
  }
}
