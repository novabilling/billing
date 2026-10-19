import { Injectable, Logger } from '@nestjs/common';
import {
  CreditNote,
  Invoice,
  MoneyIntent,
  Payment,
  PrismaClient,
  Wallet,
  WalletTransaction,
  WalletTransactionKind,
} from '../../generated/prisma-tenant/client';
import { Accounts, AccountSpec } from './chart-of-accounts';
import { LedgerService, PostingOutcome } from './ledger.service';
import { toScaled } from './ledger.money';

/**
 * Rows changed within this window are left for the next run, so multi-step
 * writes (an invoice created, then wallet credits applied, then its amount
 * reduced) are seen in their final state.
 */
const SETTLE_MS = 2 * 60 * 1000;
/** Re-scan this far behind the cursor in case of clock skew between writers. */
const OVERLAP_MS = 10 * 60 * 1000;
const BATCH = 500;

export interface ProjectionResult {
  posted: number;
  duplicates: number;
  skipped: number;
  failed: number;
  errors: { reference: string; error: string }[];
}

type Source = 'invoices' | 'payments' | 'wallet_transactions' | 'credit_notes' | 'money_intents';

/**
 * Shadow-mode projector: derives ledger entries from the existing billing
 * tables without changing any of the code paths that write them. Every
 * posting is keyed by a deterministic reference, so running the projector
 * again (or from the beginning, as a backfill) never double-posts.
 */
@Injectable()
export class LedgerProjectorService {
  private readonly logger = new Logger(LedgerProjectorService.name);

  constructor(private readonly ledger: LedgerService) {}

  async project(db: PrismaClient, options: { fromScratch?: boolean } = {}): Promise<ProjectionResult> {
    const result: ProjectionResult = { posted: 0, duplicates: 0, skipped: 0, failed: 0, errors: [] };
    const until = new Date(Date.now() - SETTLE_MS);

    // Order matters only for readability of the journal: invoices before the
    // payments, wallet debits and credit notes that settle them.
    await this.run(db, 'invoices', until, options, result, (since) => this.projectInvoices(db, since, until, result));
    await this.run(db, 'payments', until, options, result, (since) => this.projectPayments(db, since, until, result));
    await this.run(db, 'wallet_transactions', until, options, result, (since) =>
      this.projectWalletTransactions(db, since, until, result),
    );
    await this.run(db, 'credit_notes', until, options, result, (since) => this.projectCreditNotes(db, since, until, result));
    await this.run(db, 'money_intents', until, options, result, (since) => this.projectMoneyIntents(db, since, until, result));

    return result;
  }

  // --- Per-source projection ---

  private async projectInvoices(db: PrismaClient, since: Date, until: Date, result: ProjectionResult) {
    return this.scan(
      (cursor) =>
        db.invoice.findMany({
          where: { updatedAt: { gt: cursor, lte: until } },
          orderBy: [{ updatedAt: 'asc' }, { id: 'asc' }],
          take: BATCH,
        }),
      since,
      async (batch: Invoice[]) => {
        const walletApplied = await this.walletAppliedByInvoice(
          db,
          batch.map((i) => i.id),
        );
        for (const invoice of batch) {
          await this.safely(result, `invoice:${invoice.id}`, () =>
            this.projectInvoice(db, invoice, walletApplied.get(invoice.id) ?? 0n),
          );
        }
      },
    );
  }

  /**
   * An issued invoice raises a receivable for its gross amount: the stored
   * amount is net of wallet credits already applied (those post separately as
   * wallet debits against the same receivable). Tax recorded on the invoice is
   * split out to tax payable.
   */
  async projectInvoice(db: PrismaClient, invoice: Invoice, walletApplied: bigint): Promise<PostingOutcome> {
    const issuedRef = `invoice:${invoice.id}:issued`;

    if (invoice.status === 'CANCELED') {
      return this.ledger.reverse(db, issuedRef, {
        reference: `invoice:${invoice.id}:voided`,
        type: 'INVOICE_VOIDED',
        description: `Invoice ${invoice.invoiceNumber} canceled`,
        sourceType: 'invoice',
        sourceId: invoice.id,
        effectiveAt: invoice.updatedAt,
      });
    }
    if (invoice.status === 'DRAFT') return 'skipped';

    const gross = toScaled(invoice.amount) + walletApplied;
    if (gross <= 0n) return 'skipped';

    const meta = (invoice.metadata ?? {}) as Record<string, unknown>;
    const rawTax = typeof meta.taxAmount === 'number' || typeof meta.taxAmount === 'string' ? meta.taxAmount : 0;
    let tax = toScaled(rawTax);
    if (tax < 0n || tax > gross) tax = 0n;

    return this.ledger.post(db, {
      reference: issuedRef,
      type: 'INVOICE_ISSUED',
      description: `Invoice ${invoice.invoiceNumber} issued`,
      sourceType: 'invoice',
      sourceId: invoice.id,
      effectiveAt: invoice.createdAt,
      metadata: { invoiceNumber: invoice.invoiceNumber, customerId: invoice.customerId },
      lines: [
        { account: Accounts.receivable(invoice.currency), amount: gross },
        { account: Accounts.revenue(invoice.currency), amount: -(gross - tax) },
        { account: Accounts.taxPayable(invoice.currency), amount: -tax },
      ],
    });
  }

  private async projectPayments(db: PrismaClient, since: Date, until: Date, result: ProjectionResult) {
    return this.scan(
      (cursor) =>
        db.payment.findMany({
          where: { updatedAt: { gt: cursor, lte: until }, status: { in: ['SUCCEEDED', 'REFUNDED'] } },
          orderBy: [{ updatedAt: 'asc' }, { id: 'asc' }],
          take: BATCH,
        }),
      since,
      async (batch: Payment[]) => {
        for (const payment of batch) {
          await this.safely(result, `payment:${payment.id}`, () => this.projectPayment(db, payment, result));
        }
      },
    );
  }

  /** A successful payment moves the receivable into provider clearing; a refund reverses part or all of it. */
  async projectPayment(db: PrismaClient, payment: Payment, result?: ProjectionResult): Promise<PostingOutcome> {
    const amount = toScaled(payment.amount);
    const captured = await this.ledger.post(db, {
      reference: `payment:${payment.id}:captured`,
      type: 'PAYMENT_CAPTURED',
      description: `Payment via ${payment.provider}`,
      sourceType: 'payment',
      sourceId: payment.id,
      effectiveAt: payment.createdAt,
      metadata: { invoiceId: payment.invoiceId, providerTransactionId: payment.providerTransactionId },
      lines: [
        { account: Accounts.providerClearing(payment.provider, payment.currency), amount },
        { account: Accounts.receivable(payment.currency), amount: -amount },
      ],
    });
    if (payment.status !== 'REFUNDED') return captured;
    if (result) this.tally(result, captured);

    const meta = (payment.metadata ?? {}) as Record<string, unknown>;
    let refund = meta.refundAmount !== undefined ? toScaled(meta.refundAmount as number | string) : amount;
    if (refund <= 0n || refund > amount) refund = amount;
    const refundedAt = typeof meta.refundedAt === 'string' ? new Date(meta.refundedAt) : payment.updatedAt;

    return this.ledger.post(db, {
      reference: `payment:${payment.id}:refunded`,
      type: 'PAYMENT_REFUNDED',
      description: `Refund of payment via ${payment.provider}`,
      sourceType: 'payment',
      sourceId: payment.id,
      effectiveAt: Number.isNaN(refundedAt.getTime()) ? payment.updatedAt : refundedAt,
      metadata: { invoiceId: payment.invoiceId, reason: (meta.refundReason as string) ?? null },
      lines: [
        { account: Accounts.refunds(payment.currency), amount: refund },
        { account: Accounts.providerClearing(payment.provider, payment.currency), amount: -refund },
      ],
    });
  }

  private async projectWalletTransactions(db: PrismaClient, since: Date, until: Date, result: ProjectionResult) {
    return this.scan(
      (cursor) =>
        db.walletTransaction.findMany({
          where: { createdAt: { gt: cursor, lte: until }, status: 'SETTLED' },
          include: { wallet: true },
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
          take: BATCH,
        }),
      since,
      async (batch: (WalletTransaction & { wallet: Wallet })[]) => {
        for (const txn of batch) {
          await this.safely(result, `wallet_txn:${txn.id}`, () => this.projectWalletTransaction(db, txn));
        }
      },
      (row) => row.createdAt,
    );
  }

  async projectWalletTransaction(
    db: PrismaClient,
    txn: WalletTransaction & { wallet: Wallet },
  ): Promise<PostingOutcome> {
    const { wallet } = txn;
    const amount = toScaled(txn.amount);
    if (amount <= 0n) return 'skipped';
    const walletAccount = Accounts.customerWallet(wallet.id, wallet.customerId, wallet.currency);

    // Credits to a wallet: the wallet liability grows, funded by money collected
    // outside the system (purchased) or by a promotional expense (granted).
    // Debits: the liability shrinks, settling a receivable (invoiced) or
    // becoming breakage (voided / expired).
    const counterparts: Record<WalletTransactionKind, AccountSpec> = {
      PURCHASED: Accounts.walletTopUpClearing(wallet.currency),
      GRANTED: Accounts.promotionalCredits(wallet.currency),
      INVOICED: Accounts.receivable(wallet.currency),
      VOIDED: Accounts.walletBreakage(wallet.currency),
      // Payouts and transfers: the wallet leg posts here; the money-movement
      // service posts the other leg against the same clearing account.
      WITHDRAWN: Accounts.payoutsInFlight(wallet.currency),
      PAYOUT_REVERSED: Accounts.payoutsInFlight(wallet.currency),
      TRANSFERRED_OUT: Accounts.walletTransfers(wallet.currency),
      TRANSFERRED_IN: Accounts.walletTransfers(wallet.currency),
    };
    const counterpart = counterparts[txn.transactionStatus];
    const inbound = txn.transactionType === 'INBOUND';

    return this.ledger.post(db, {
      reference: `wallet_txn:${txn.id}`,
      type: inbound ? 'WALLET_CREDITED' : 'WALLET_DEBITED',
      description: `Wallet ${inbound ? 'credit' : 'debit'} (${txn.transactionStatus.toLowerCase()})`,
      sourceType: 'wallet_transaction',
      sourceId: txn.id,
      effectiveAt: txn.settledAt ?? txn.createdAt,
      metadata: { walletId: wallet.id, invoiceId: txn.invoiceId, credits: txn.creditAmount.toString() },
      lines: inbound
        ? [
            { account: counterpart, amount },
            { account: walletAccount, amount: -amount },
          ]
        : [
            { account: walletAccount, amount },
            { account: counterpart, amount: -amount },
          ],
    });
  }

  private async projectCreditNotes(db: PrismaClient, since: Date, until: Date, result: ProjectionResult) {
    return this.scan(
      (cursor) =>
        db.creditNote.findMany({
          where: { updatedAt: { gt: cursor, lte: until }, status: { in: ['FINALIZED', 'VOIDED'] } },
          orderBy: [{ updatedAt: 'asc' }, { id: 'asc' }],
          take: BATCH,
        }),
      since,
      async (batch: CreditNote[]) => {
        for (const note of batch) {
          await this.safely(result, `credit_note:${note.id}`, () => this.projectCreditNote(db, note));
        }
      },
    );
  }

  /**
   * Finalizing a credit note today changes only its status (no refund or wallet
   * credit is made), so the ledger records the amount as owed to the customer.
   */
  async projectCreditNote(db: PrismaClient, note: CreditNote): Promise<PostingOutcome> {
    const issuedRef = `credit_note:${note.id}:issued`;
    if (note.status === 'VOIDED') {
      return this.ledger.reverse(db, issuedRef, {
        reference: `credit_note:${note.id}:voided`,
        type: 'CREDIT_NOTE_VOIDED',
        description: 'Credit note voided',
        sourceType: 'credit_note',
        sourceId: note.id,
        effectiveAt: note.updatedAt,
      });
    }

    const amount = toScaled(note.amount);
    return this.ledger.post(db, {
      reference: issuedRef,
      type: 'CREDIT_NOTE_ISSUED',
      description: `Credit note (${note.reason.toLowerCase()})`,
      sourceType: 'credit_note',
      sourceId: note.id,
      effectiveAt: note.updatedAt,
      metadata: { invoiceId: note.invoiceId, customerId: note.customerId },
      lines: [
        { account: Accounts.creditNotes(note.currency), amount },
        { account: Accounts.customerCredit(note.currency), amount: -amount },
      ],
    });
  }

  private async projectMoneyIntents(db: PrismaClient, since: Date, until: Date, result: ProjectionResult) {
    return this.scan(
      (cursor) =>
        db.moneyIntent.findMany({
          where: { updatedAt: { gt: cursor, lte: until }, status: 'SUCCEEDED', type: { in: ['COLLECTION', 'PAYOUT'] } },
          orderBy: [{ updatedAt: 'asc' }, { id: 'asc' }],
          take: BATCH,
        }),
      since,
      async (batch: MoneyIntent[]) => {
        for (const intent of batch) {
          await this.safely(result, `money_intent:${intent.id}`, () => this.projectMoneyIntent(db, intent));
        }
      },
    );
  }

  /**
   * A settled collection brings money into provider clearing: as one-time
   * revenue, or (when it funds a wallet) against the top-up clearing account
   * that the wallet credit then draws down. A settled payout takes money out
   * of provider clearing: from a wallet's held amount, or as a payout expense.
   * Wallet legs themselves come from wallet transactions. Provider fees, when
   * reported, post separately.
   */
  async projectMoneyIntent(db: PrismaClient, intent: MoneyIntent): Promise<PostingOutcome> {
    if (!intent.provider) return 'skipped';
    const amount = toScaled(intent.amount);
    const clearing = Accounts.providerClearing(intent.provider, intent.currency);
    const fee = intent.fee ? toScaled(intent.fee) : 0n;
    const feeLines =
      fee > 0n
        ? [
            { account: Accounts.providerFees(intent.provider, intent.currency), amount: fee },
            { account: clearing, amount: -fee },
          ]
        : [];

    const collection = intent.type === 'COLLECTION';
    const other = collection
      ? intent.walletId
        ? Accounts.walletTopUpClearing(intent.currency)
        : Accounts.oneTimeRevenue(intent.currency)
      : intent.walletId
        ? Accounts.payoutsInFlight(intent.currency)
        : Accounts.payoutsSent(intent.currency);

    return this.ledger.post(db, {
      reference: `money_intent:${intent.id}:settled`,
      type: collection ? 'COLLECTION' : 'PAYOUT',
      description: `${collection ? 'Collection' : 'Payout'} via ${intent.provider}`,
      sourceType: 'money_intent',
      sourceId: intent.id,
      effectiveAt: intent.completedAt ?? intent.updatedAt,
      metadata: { rail: intent.rail, providerReference: intent.providerReference, clientReference: intent.clientReference },
      lines: collection
        ? [
            { account: clearing, amount },
            { account: other, amount: -amount },
            ...feeLines,
          ]
        : [
            { account: other, amount },
            { account: clearing, amount: -amount },
            ...feeLines,
          ],
    });
  }

  // --- Plumbing ---

  private async run(
    db: PrismaClient,
    source: Source,
    until: Date,
    options: { fromScratch?: boolean },
    result: ProjectionResult,
    work: (since: Date) => Promise<Date | null>,
  ) {
    const cursor = options.fromScratch
      ? null
      : await db.ledgerCursor.findUnique({ where: { source } });
    const since = cursor ? new Date(cursor.position.getTime() - OVERLAP_MS) : new Date(0);

    const failedBefore = result.failed;
    const reached = await work(since);
    // Only advance when every row in range was handled; a failed row keeps the
    // cursor back so the next run retries it.
    const position = result.failed === failedBefore ? (reached ?? until) : null;
    if (position && (!cursor || position > cursor.position)) {
      await db.ledgerCursor.upsert({
        where: { source },
        create: { source, position },
        update: { position },
      });
    }
  }

  /** Page through rows ordered by timestamp; returns the last timestamp seen. */
  private async scan<T extends { id: string }>(
    fetch: (cursor: Date) => Promise<T[]>,
    since: Date,
    handle: (batch: T[]) => Promise<void>,
    stamp: (row: T) => Date = (row) => (row as unknown as { updatedAt: Date }).updatedAt,
  ): Promise<Date | null> {
    let cursor = since;
    let last: Date | null = null;
    const seen = new Set<string>();

    for (;;) {
      const rows = (await fetch(cursor)).filter((row) => !seen.has(row.id));
      if (rows.length === 0) break;
      await handle(rows);
      for (const row of rows) seen.add(row.id);
      last = stamp(rows[rows.length - 1]);
      // Rows sharing the boundary timestamp are re-fetched with gt, so step back
      // one millisecond and rely on `seen` to skip what was already handled.
      cursor = new Date(last.getTime() - 1);
      if (rows.length < BATCH) break;
    }
    return last;
  }

  private async walletAppliedByInvoice(db: PrismaClient, invoiceIds: string[]): Promise<Map<string, bigint>> {
    if (invoiceIds.length === 0) return new Map();
    const rows = await db.walletTransaction.groupBy({
      by: ['invoiceId'],
      where: {
        invoiceId: { in: invoiceIds },
        transactionStatus: 'INVOICED',
        status: 'SETTLED',
      },
      _sum: { amount: true },
    });
    return new Map(rows.map((r) => [r.invoiceId as string, toScaled(r._sum.amount ?? 0)]));
  }

  private async safely(result: ProjectionResult, reference: string, work: () => Promise<PostingOutcome>) {
    try {
      this.tally(result, await work());
    } catch (error) {
      result.failed++;
      const message = error instanceof Error ? error.message : String(error);
      if (result.errors.length < 50) result.errors.push({ reference, error: message });
      this.logger.warn(`Ledger projection failed for ${reference}: ${message}`);
    }
  }

  private tally(result: ProjectionResult, outcome: PostingOutcome) {
    if (outcome === 'posted') result.posted++;
    else if (outcome === 'duplicate') result.duplicates++;
    else result.skipped++;
  }
}
