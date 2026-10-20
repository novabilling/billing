import { Injectable, Logger } from '@nestjs/common';
import {
  LedgerEntryType,
  Prisma,
  PrismaClient,
} from '../../generated/prisma-tenant/client';
import { AccountSpec } from './chart-of-accounts';
import { formatScaled, toScaled } from './ledger.money';

export interface PostingLine {
  account: AccountSpec;
  /** Signed scaled amount: debit positive, credit negative. */
  amount: bigint;
  description?: string;
}

export interface PostingInput {
  reference: string;
  type: LedgerEntryType;
  description: string;
  sourceType: string;
  sourceId: string;
  effectiveAt: Date;
  metadata?: Prisma.InputJsonValue;
  lines: PostingLine[];
}

export type PostingOutcome = 'posted' | 'duplicate' | 'skipped';

export interface LedgerCheck {
  name: string;
  ok: boolean;
  /** Informational checks report differences but do not make the ledger unbalanced. */
  informational?: boolean;
  details: Record<string, unknown>[];
}

export interface LedgerHealth {
  balanced: boolean;
  checkedAt: string;
  checks: LedgerCheck[];
}

/** Prisma error codes the ledger treats specially. */
const UNIQUE_VIOLATION = 'P2002';
const TABLE_MISSING = 'P2021';

export function isLedgerTableMissing(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === TABLE_MISSING;
}

@Injectable()
export class LedgerService {
  private readonly logger = new Logger(LedgerService.name);

  /**
   * Post a balanced journal entry. Idempotent by `reference`: posting the same
   * reference twice returns 'duplicate' and changes nothing.
   *
   * Accounts are locked in sorted id order (SELECT ... FOR UPDATE) so concurrent
   * postings touching the same accounts serialise without deadlocking, and the
   * cached balances are updated in the same transaction as the lines.
   */
  async post(db: PrismaClient, input: PostingInput): Promise<PostingOutcome> {
    const lines = input.lines.filter((line) => line.amount !== 0n);
    if (lines.length === 0) return 'skipped';
    this.assertBalanced(input.reference, lines);

    const existing = await db.ledgerEntry.findUnique({
      where: { reference: input.reference },
      select: { id: true },
    });
    if (existing) return 'duplicate';

    const accountIds = await Promise.all(lines.map((line) => this.ensureAccount(db, line.account)));

    try {
      await db.$transaction(
        async (tx) => {
          for (const id of [...new Set(accountIds)].sort()) {
            await tx.$queryRaw`SELECT id FROM "LedgerAccount" WHERE id = ${id} FOR UPDATE`;
          }

          await tx.ledgerEntry.create({
            data: {
              reference: input.reference,
              type: input.type,
              description: input.description,
              sourceType: input.sourceType,
              sourceId: input.sourceId,
              effectiveAt: input.effectiveAt,
              metadata: input.metadata,
              lines: {
                create: lines.map((line, i) => ({
                  accountId: accountIds[i],
                  amount: line.amount,
                  currency: line.account.currency,
                  description: line.description,
                })),
              },
            },
          });

          for (let i = 0; i < lines.length; i++) {
            await tx.ledgerAccount.update({
              where: { id: accountIds[i] },
              data: { balance: { increment: lines[i].amount } },
            });
          }
        },
        { timeout: 15000, maxWait: 10000 },
      );
      return 'posted';
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === UNIQUE_VIOLATION) {
        return 'duplicate';
      }
      throw error;
    }
  }

  /**
   * Post the exact mirror of an existing entry under a new reference. Returns
   * 'skipped' when the original was never posted (nothing to reverse).
   */
  async reverse(
    db: PrismaClient,
    originalReference: string,
    input: Omit<PostingInput, 'lines'>,
  ): Promise<PostingOutcome> {
    const original = await db.ledgerEntry.findUnique({
      where: { reference: originalReference },
      include: { lines: { include: { account: true } } },
    });
    if (!original) return 'skipped';

    return this.post(db, {
      ...input,
      metadata: { ...((input.metadata as Record<string, unknown>) ?? {}), reverses: originalReference },
      lines: original.lines.map((line) => ({
        account: {
          code: line.account.code,
          name: line.account.name,
          type: line.account.type,
          currency: line.account.currency,
          customerId: line.account.customerId ?? undefined,
          walletId: line.account.walletId ?? undefined,
          provider: line.account.provider ?? undefined,
        },
        amount: -line.amount,
        description: line.description ?? undefined,
      })),
    });
  }

  async entryExists(db: PrismaClient, reference: string): Promise<boolean> {
    const entry = await db.ledgerEntry.findUnique({ where: { reference }, select: { id: true } });
    return entry !== null;
  }

  // --- Reads ---

  async listAccounts(db: PrismaClient, query: { currency?: string; type?: string }) {
    const accounts = await db.ledgerAccount.findMany({
      where: {
        ...(query.currency && { currency: query.currency.toUpperCase() }),
        ...(query.type && { type: query.type as never }),
      },
      orderBy: [{ currency: 'asc' }, { code: 'asc' }],
    });
    return accounts.map((a) => ({ ...a, balance: formatScaled(a.balance) }));
  }

  async listEntries(
    db: PrismaClient,
    query: { page?: number; limit?: number; type?: string; sourceType?: string; sourceId?: string; accountId?: string },
  ) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const where: Prisma.LedgerEntryWhereInput = {
      ...(query.type && { type: query.type as LedgerEntryType }),
      ...(query.sourceType && { sourceType: query.sourceType }),
      ...(query.sourceId && { sourceId: query.sourceId }),
      ...(query.accountId && { lines: { some: { accountId: query.accountId } } }),
    };

    const [entries, total] = await Promise.all([
      db.ledgerEntry.findMany({
        where,
        include: { lines: { include: { account: { select: { code: true, name: true, type: true } } } } },
        orderBy: [{ effectiveAt: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.ledgerEntry.count({ where }),
    ]);

    return {
      data: entries.map((entry) => ({
        ...entry,
        lines: entry.lines.map((line) => ({ ...line, amount: formatScaled(line.amount) })),
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // --- Integrity ---

  /**
   * Run the integrity checks. The first three must always hold for a correct
   * ledger; wallet parity compares the ledger with the existing Wallet.balance
   * columns while the ledger runs in shadow mode.
   */
  async checkHealth(db: PrismaClient): Promise<LedgerHealth> {
    const checks: LedgerCheck[] = [];

    const unbalancedCurrencies = await db.$queryRaw<{ currency: string; total: bigint }[]>`
      SELECT currency, SUM(amount)::bigint AS total
      FROM "LedgerLine" GROUP BY currency HAVING SUM(amount) <> 0`;
    checks.push({
      name: 'zero_sum_per_currency',
      ok: unbalancedCurrencies.length === 0,
      details: unbalancedCurrencies.map((r) => ({ currency: r.currency, outBy: formatScaled(r.total) })),
    });

    const unbalancedEntries = await db.$queryRaw<{ reference: string; total: bigint }[]>`
      SELECT e.reference, SUM(l.amount)::bigint AS total
      FROM "LedgerEntry" e JOIN "LedgerLine" l ON l."entryId" = e.id
      GROUP BY e.id, e.reference, l.currency HAVING SUM(l.amount) <> 0
      LIMIT 50`;
    checks.push({
      name: 'entries_balanced',
      ok: unbalancedEntries.length === 0,
      details: unbalancedEntries.map((r) => ({ reference: r.reference, outBy: formatScaled(r.total) })),
    });

    const balanceDrift = await db.$queryRaw<{ code: string; currency: string; cached: bigint; actual: bigint }[]>`
      SELECT a.code, a.currency, a.balance AS cached, COALESCE(SUM(l.amount), 0)::bigint AS actual
      FROM "LedgerAccount" a LEFT JOIN "LedgerLine" l ON l."accountId" = a.id
      GROUP BY a.id HAVING a.balance <> COALESCE(SUM(l.amount), 0)
      LIMIT 50`;
    checks.push({
      name: 'cached_balances_match_lines',
      ok: balanceDrift.length === 0,
      details: balanceDrift.map((r) => ({
        account: r.code,
        currency: r.currency,
        cached: formatScaled(r.cached),
        fromLines: formatScaled(r.actual),
      })),
    });

    checks.push(await this.checkWalletParity(db));

    return {
      balanced: checks.filter((c) => !c.informational).every((c) => c.ok),
      checkedAt: new Date().toISOString(),
      checks,
    };
  }

  /**
   * Compare each wallet's stored balance with its ledger account. Wallet
   * accounts are liabilities, so a positive wallet balance is a credit
   * (negative) ledger balance. Differences here point at the non-atomic
   * wallet updates or rows the projector has not reached yet.
   */
  private async checkWalletParity(db: PrismaClient): Promise<LedgerCheck> {
    const [wallets, accounts] = await Promise.all([
      db.wallet.findMany({ select: { id: true, currency: true, balance: true } }),
      db.ledgerAccount.findMany({
        where: { walletId: { not: null } },
        select: { walletId: true, balance: true },
      }),
    ]);
    const ledgerByWallet = new Map(accounts.map((a) => [a.walletId as string, a.balance]));

    const mismatches: Record<string, unknown>[] = [];
    for (const wallet of wallets) {
      const expected = toScaled(wallet.balance);
      const ledger = -(ledgerByWallet.get(wallet.id) ?? 0n);
      if (expected !== ledger) {
        mismatches.push({
          walletId: wallet.id,
          currency: wallet.currency,
          walletBalance: formatScaled(expected),
          ledgerBalance: formatScaled(ledger),
        });
      }
    }

    return {
      name: 'wallet_balances_match_ledger',
      ok: mismatches.length === 0,
      informational: true,
      details: mismatches.slice(0, 50),
    };
  }

  // --- Internals ---

  private assertBalanced(reference: string, lines: PostingLine[]) {
    if (lines.length < 2) {
      throw new Error(`Ledger entry ${reference} needs at least two non-zero lines`);
    }
    const totals = new Map<string, bigint>();
    for (const line of lines) {
      totals.set(line.account.currency, (totals.get(line.account.currency) ?? 0n) + line.amount);
    }
    for (const [currency, total] of totals) {
      if (total !== 0n) {
        throw new Error(
          `Ledger entry ${reference} is unbalanced in ${currency} by ${formatScaled(total)}`,
        );
      }
    }
  }

  private async ensureAccount(db: PrismaClient, spec: AccountSpec): Promise<string> {
    const where = { code_currency: { code: spec.code, currency: spec.currency } };
    const found = await db.ledgerAccount.findUnique({ where, select: { id: true } });
    if (found) return found.id;

    try {
      const created = await db.ledgerAccount.create({
        data: {
          code: spec.code,
          name: spec.name,
          type: spec.type,
          currency: spec.currency,
          customerId: spec.customerId,
          walletId: spec.walletId,
          provider: spec.provider,
        },
        select: { id: true },
      });
      return created.id;
    } catch (error) {
      // Another posting created it concurrently.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === UNIQUE_VIOLATION) {
        const again = await db.ledgerAccount.findUnique({ where, select: { id: true } });
        if (again) return again.id;
      }
      throw error;
    }
  }
}
