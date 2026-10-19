import { randomInt } from 'crypto';
import { Prisma, PrismaClient } from '../../../generated/prisma-tenant/client';
import { Capabilities, CollectRequest, MoneyProvider, ProviderOutcome } from '../types';
import { formatScaled, toScaled } from '../../ledger/ledger.money';

/**
 * Watch-only stablecoin collections to the merchant's own address on an
 * account-based chain (TRON, Ethereum), with no processor in between. We
 * only read the chain and never hold keys or funds.
 *
 * One address serves every collection, so each open collection reserves a
 * unique amount: the amount asked plus a tail of 0.0001-0.0099. A confirmed
 * transfer of exactly that amount, inside the collection's window, pays it.
 * A transfer of the plain amount pays it too when it is the only open
 * collection of that amount. Anything else is kept as an unmatched deposit
 * for the merchant to assign.
 *
 * Each chain supplies address validation and a reader of confirmed
 * incoming token transfers.
 */
export interface WatchCredentials {
  /** The merchant's own address, where payers send the coin. */
  address: string;
  /** Minutes a collection waits for payment before it expires (default 60). */
  expiryMinutes?: number | string;
}

/** A confirmed incoming token transfer, in the token's base units. */
export interface WatchedTransfer {
  hash: string;
  /** Block time, ms since epoch. */
  time: number;
  from?: string;
  value: string;
  decimals: number;
}

const TAIL_SLOTS = 99; // 0.0001 … 0.0099
const SLOT_REUSE_AFTER_MS = 24 * 60 * 60 * 1000;
/** A transfer confirmed just after expiry still counts: payers broadcast before the deadline. */
const EXPIRY_GRACE_MS = 3 * 60 * 1000;
const SCAN_OVERLAP_MS = 10 * 60 * 1000;
const CLOCK_SKEW_MS = 60 * 1000;
const FIRST_SCAN_LOOKBACK_MS = 24 * 60 * 60 * 1000;
const MIN_SCAN_INTERVAL_MS = 20_000;

const lastScan = new Map<string, number>();

export abstract class StablecoinWatchAdapter implements MoneyProvider {
  abstract readonly name: string;
  readonly capabilities: Capabilities = { collect: ['crypto'], payout: [], balance: false, verifyPayee: false };

  /** Chain name shown to payers and stored on deposits, e.g. "TRON". */
  protected abstract readonly chain: string;
  /** What payers may call the chain in `payer.chain`. */
  protected abstract readonly chainAliases: string[];
  protected abstract readonly coin: string;
  /** Distinguishes networks (mainnet/testnet) in the scan throttle. */
  protected abstract readonly scanKey: string;

  protected abstract isValidAddress(address: string): boolean;
  /** Anything else missing from the connection, as a message for the merchant. */
  protected setupProblem(): string | undefined {
    return undefined;
  }
  /** Confirmed transfers of the coin to `address` since `since` (ms), oldest first. */
  protected abstract transfersSince(since: number): Promise<WatchedTransfer[]>;

  constructor(
    protected readonly credentials: WatchCredentials,
    protected readonly db: PrismaClient,
    protected readonly fetchImpl: typeof fetch = fetch,
  ) {}

  /** How the address is stored and compared; chains with case-insensitive addresses lowercase it. */
  protected get address(): string {
    return this.credentials.address.trim();
  }

  async collect(request: CollectRequest): Promise<ProviderOutcome> {
    const label = `${this.coin} on ${titleCase(this.chain)}`;
    if (request.payer.type !== 'crypto') return { state: 'failed', failureReason: `${label} collects crypto only` };
    if (request.currency.toUpperCase() !== this.coin) {
      return { state: 'failed', failureReason: `${label} collects ${this.coin}, not ${request.currency}` };
    }
    if (request.payer.chain && !this.chainAliases.includes(request.payer.chain)) {
      return { state: 'failed', failureReason: `This connection receives ${label}, not ${request.payer.chain}` };
    }
    if (!this.isValidAddress(this.credentials.address.trim())) {
      return { state: 'failed', failureReason: `The receiving ${titleCase(this.chain)} address in this connection is not valid` };
    }
    const problem = this.setupProblem();
    if (problem) return { state: 'failed', failureReason: problem };

    const base = toScaled(request.amount);
    if (base % 100n !== 0n) {
      return { state: 'failed', failureReason: `${label} collections take amounts with at most 2 decimal places` };
    }
    // Saved from a form, so it may arrive as text or blank.
    const minutes = Number(this.credentials.expiryMinutes);
    const expiresAt = new Date(Date.now() + (minutes > 0 ? minutes : 60) * 60_000);
    const amount = await this.claimAmount(base, request.reference, expiresAt);
    if (!amount) {
      return { state: 'failed', failureReason: `Too many open collections of ${request.amount} ${this.coin} right now; try again shortly` };
    }
    return {
      state: 'pending',
      providerStatus: 'AWAITING_DEPOSIT',
      paymentDetails: { kind: 'crypto_address', coin: this.coin, chain: this.chain, address: this.credentials.address.trim(), amount },
    };
  }

  /** Reserve amount + a free tail at this address; the unique index settles races. */
  private async claimAmount(base: bigint, reference: string, expiresAt: Date): Promise<string | null> {
    const existing = await this.db.cryptoAmountClaim.findUnique({ where: { reference } });
    if (existing) return trimAmount(toScaled(existing.amount));

    await this.db.cryptoAmountClaim.deleteMany({
      where: { address: this.address, expiresAt: { lt: new Date(Date.now() - SLOT_REUSE_AFTER_MS) } },
    });
    const taken = new Set(
      (
        await this.db.cryptoAmountClaim.findMany({
          where: { address: this.address, baseAmount: new Prisma.Decimal(formatScaled(base)) },
          select: { amount: true },
        })
      ).map((c) => toScaled(c.amount)),
    );
    const free = Array.from({ length: TAIL_SLOTS }, (_, i) => base + BigInt(i + 1)).filter((a) => !taken.has(a));
    while (free.length) {
      const [amount] = free.splice(randomInt(free.length), 1);
      try {
        await this.db.cryptoAmountClaim.create({
          data: {
            address: this.address,
            amount: new Prisma.Decimal(formatScaled(amount)),
            baseAmount: new Prisma.Decimal(formatScaled(base)),
            reference,
            expiresAt,
          },
        });
        return trimAmount(amount);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') continue;
        throw error;
      }
    }
    return null;
  }

  async getCollection(reference: string): Promise<ProviderOutcome> {
    const claim = await this.db.cryptoAmountClaim.findUnique({ where: { reference } });
    if (!claim) return { state: 'failed', providerStatus: 'NO_CLAIM', failureReason: 'No payment amount was reserved for this collection' };

    await this.scan();
    const deposit = await this.db.cryptoDeposit.findFirst({ where: { reference }, orderBy: { blockTime: 'asc' } });
    if (deposit) {
      const paid = toScaled(deposit.amount.toFixed(4));
      return {
        state: 'succeeded',
        providerTxnId: deposit.txHash,
        providerStatus: deposit.status === 'ASSIGNED' ? `ASSIGNED_${trimAmount(paid)}` : 'RECEIVED',
      };
    }
    if (Date.now() > claim.expiresAt.getTime() + EXPIRY_GRACE_MS) {
      return {
        state: 'failed',
        providerStatus: 'EXPIRED',
        failureReason: `Expired: no payment of ${trimAmount(toScaled(claim.amount))} ${this.coin} arrived in time`,
      };
    }
    return { state: 'pending', providerStatus: 'AWAITING_DEPOSIT' };
  }

  /**
   * Record confirmed transfers to the address since the last one seen, and
   * match each new one to an open collection. Safe to run repeatedly:
   * transfers are keyed by transaction hash.
   */
  async scan(): Promise<{ seen: number; matched: number }> {
    const key = `${this.scanKey}|${this.address}`;
    if ((lastScan.get(key) ?? 0) > Date.now() - MIN_SCAN_INTERVAL_MS) return { seen: 0, matched: 0 };
    lastScan.set(key, Date.now());

    const latest = await this.db.cryptoDeposit.findFirst({
      where: { address: this.address, chain: this.chain },
      orderBy: { blockTime: 'desc' },
      select: { blockTime: true },
    });
    const since = latest ? latest.blockTime.getTime() - SCAN_OVERLAP_MS : Date.now() - FIRST_SCAN_LOOKBACK_MS;
    const transfers = await this.transfersSince(since);

    let matched = 0;
    for (const t of transfers) {
      const amount = formatUnits(t.value, t.decimals);
      try {
        await this.db.cryptoDeposit.create({
          data: {
            chain: this.chain,
            token: this.coin,
            address: this.address,
            txHash: t.hash,
            fromAddress: t.from ?? null,
            amount: new Prisma.Decimal(amount),
            blockTime: new Date(t.time),
            status: 'UNMATCHED',
          },
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') continue; // already seen
        throw error;
      }
      if (await this.match(t.hash, amount, new Date(t.time))) matched++;
    }
    return { seen: transfers.length, matched };
  }

  /** Exact amount (with tail) first; else the plain amount when only one open collection asked for it. */
  private async match(txHash: string, amount: string, at: Date): Promise<boolean> {
    // Amounts with more than 4 decimals were never asked for.
    if (!/^\d+(\.\d{1,4})?$/.test(amount)) return false;
    const value = new Prisma.Decimal(amount);
    // Block times can trail the clock by a few seconds; nothing paid a minute before the collection existed counts.
    const window = { createdAt: { lte: new Date(at.getTime() + CLOCK_SKEW_MS) }, expiresAt: { gte: new Date(at.getTime() - EXPIRY_GRACE_MS) } };

    let claim = await this.db.cryptoAmountClaim.findFirst({ where: { address: this.address, amount: value, ...window } });
    if (!claim) {
      const plain = await this.db.cryptoAmountClaim.findMany({ where: { address: this.address, baseAmount: value, ...window }, take: 2 });
      if (plain.length === 1) claim = plain[0];
    }
    if (!claim) return false;
    // Never let one collection be paid twice, or a second transfer take over the first.
    if (await this.db.cryptoDeposit.findFirst({ where: { reference: claim.reference } })) return false;
    await this.db.cryptoDeposit.update({ where: { txHash }, data: { status: 'MATCHED', reference: claim.reference } });
    return true;
  }
}

/** Exposed for tests: allow an immediate rescan. */
export function resetScanThrottle(): void {
  lastScan.clear();
}

/** "25003700", 6 → "25.0037". */
export function formatUnits(value: string, decimals: number): string {
  const digits = value.replace(/^0+(?=\d)/, '').padStart(decimals + 1, '0');
  const whole = digits.slice(0, digits.length - decimals);
  const frac = digits.slice(digits.length - decimals).replace(/0+$/, '');
  return frac ? `${whole}.${frac}` : whole;
}

/** 250037n (scale 4) → "25.0037"; 250000n → "25". */
function trimAmount(scaled: bigint): string {
  return formatScaled(scaled).replace(/\.?0+$/, '');
}

function titleCase(chain: string): string {
  return chain === 'TRON' ? 'TRON' : chain[0] + chain.slice(1).toLowerCase();
}
