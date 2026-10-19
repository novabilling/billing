import { createHash, randomInt } from 'crypto';
import { Prisma, PrismaClient } from '../../../generated/prisma-tenant/client';
import { Capabilities, CollectRequest, MoneyProvider, ProviderOutcome } from '../types';
import { formatScaled, toScaled } from '../../ledger/ledger.money';

/**
 * Watch-only USDT collections on TRON, with no processor in between. The
 * payer sends USDT straight to the merchant's own TRON address; we only
 * read the chain (through TronGrid) and never hold keys or funds.
 *
 * One address serves every collection, so each open collection reserves a
 * unique amount: the amount asked plus a tail of 0.0001-0.0099 USDT. A
 * confirmed transfer of exactly that amount, inside the collection's
 * window, pays it. A transfer of the plain amount pays it too when it is the
 * only open collection of that amount. Anything else is kept as an
 * unmatched deposit for the merchant to assign.
 */
export interface TronUsdtCredentials {
  /** The merchant's own TRON address (T…), where payers send USDT. */
  address: string;
  /** TronGrid API key; works without one at low volume. */
  apiKey?: string;
  network?: 'mainnet' | 'nile';
  /** Minutes a collection waits for payment before it expires (default 60). */
  expiryMinutes?: number;
  /** Override the USDT contract (e.g. another testnet token). */
  tokenContract?: string;
}

const NETWORKS = {
  mainnet: { api: 'https://api.trongrid.io', usdt: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' },
  nile: { api: 'https://nile.trongrid.io', usdt: 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf' },
};
const TIMEOUT_MS = 20_000;
const TAIL_SLOTS = 99; // 0.0001 … 0.0099
const SLOT_REUSE_AFTER_MS = 24 * 60 * 60 * 1000;
/** A transfer confirmed just after expiry still counts: payers broadcast before the deadline. */
const EXPIRY_GRACE_MS = 3 * 60 * 1000;
const SCAN_OVERLAP_MS = 10 * 60 * 1000;
const FIRST_SCAN_LOOKBACK_MS = 24 * 60 * 60 * 1000;
const MIN_SCAN_INTERVAL_MS = 20_000;
const MAX_PAGES = 5;

const lastScan = new Map<string, number>();

interface Trc20Transfer {
  transaction_id: string;
  block_timestamp: number;
  from?: string;
  to?: string;
  type?: string;
  value: string;
  token_info?: { address?: string; decimals?: number };
}

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/** A TRON base58check address: 0x41 prefix, 20-byte account, 4-byte double-SHA256 checksum. */
export function isTronAddress(value: string): boolean {
  if (!/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(value)) return false;
  let n = 0n;
  for (const c of value) n = n * 58n + BigInt(BASE58.indexOf(c));
  const bytes = Buffer.from(n.toString(16).padStart(50, '0'), 'hex');
  if (bytes.length !== 25 || bytes[0] !== 0x41) return false;
  const check = createHash('sha256').update(createHash('sha256').update(bytes.subarray(0, 21)).digest()).digest();
  return check.subarray(0, 4).equals(bytes.subarray(21));
}

export class TronUsdtAdapter implements MoneyProvider {
  readonly name = 'tron_usdt';
  readonly capabilities: Capabilities = { collect: ['crypto'], payout: [], balance: false, verifyPayee: false };

  constructor(
    private readonly credentials: TronUsdtCredentials,
    private readonly db: PrismaClient,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  private get network() {
    return NETWORKS[this.credentials.network === 'nile' ? 'nile' : 'mainnet'];
  }

  private get contract() {
    return this.credentials.tokenContract || this.network.usdt;
  }

  private get address() {
    return this.credentials.address.trim();
  }

  async collect(request: CollectRequest): Promise<ProviderOutcome> {
    if (request.payer.type !== 'crypto') return { state: 'failed', failureReason: 'USDT on TRON collects crypto only' };
    if (request.currency.toUpperCase() !== 'USDT') {
      return { state: 'failed', failureReason: `USDT on TRON collects USDT, not ${request.currency}` };
    }
    if (request.payer.chain && !['TRON', 'TRC20', 'TRX'].includes(request.payer.chain)) {
      return { state: 'failed', failureReason: `This connection receives USDT on TRON, not ${request.payer.chain}` };
    }
    if (!isTronAddress(this.address)) {
      return { state: 'failed', failureReason: 'The receiving TRON address in this connection is not valid' };
    }

    const base = toScaled(request.amount);
    if (base % 100n !== 0n) {
      return { state: 'failed', failureReason: 'USDT on TRON collections take amounts with at most 2 decimal places' };
    }
    // Saved from a form, so it may arrive as text or blank.
    const minutes = Number(this.credentials.expiryMinutes);
    const expiresAt = new Date(Date.now() + (minutes > 0 ? minutes : 60) * 60_000);
    const amount = await this.claimAmount(base, request.reference, expiresAt);
    if (!amount) {
      return { state: 'failed', failureReason: `Too many open collections of ${request.amount} USDT right now; try again shortly` };
    }
    return {
      state: 'pending',
      providerStatus: 'AWAITING_DEPOSIT',
      paymentDetails: { kind: 'crypto_address', coin: 'USDT', chain: 'TRON', address: this.address, amount },
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
      return { state: 'failed', providerStatus: 'EXPIRED', failureReason: `Expired: no payment of ${trimAmount(toScaled(claim.amount))} USDT arrived in time` };
    }
    return { state: 'pending', providerStatus: 'AWAITING_DEPOSIT' };
  }

  /**
   * Record confirmed USDT transfers to the address since the last one seen,
   * and match each new one to an open collection. Safe to run repeatedly:
   * transfers are keyed by transaction hash.
   */
  async scan(): Promise<{ seen: number; matched: number }> {
    const key = `${this.network.api}|${this.address}`;
    if ((lastScan.get(key) ?? 0) > Date.now() - MIN_SCAN_INTERVAL_MS) return { seen: 0, matched: 0 };
    lastScan.set(key, Date.now());

    const latest = await this.db.cryptoDeposit.findFirst({
      where: { address: this.address, chain: 'TRON' },
      orderBy: { blockTime: 'desc' },
      select: { blockTime: true },
    });
    const since = latest ? latest.blockTime.getTime() - SCAN_OVERLAP_MS : Date.now() - FIRST_SCAN_LOOKBACK_MS;
    const transfers = await this.transfersSince(since);

    let matched = 0;
    for (const t of transfers) {
      const decimals = t.token_info?.decimals ?? 6;
      const amount = formatUnits(t.value, decimals);
      try {
        await this.db.cryptoDeposit.create({
          data: {
            chain: 'TRON',
            token: 'USDT',
            address: this.address,
            txHash: t.transaction_id,
            fromAddress: t.from ?? null,
            amount: new Prisma.Decimal(amount),
            blockTime: new Date(t.block_timestamp),
            status: 'UNMATCHED',
          },
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') continue; // already seen
        throw error;
      }
      if (await this.match(t.transaction_id, amount, new Date(t.block_timestamp))) matched++;
    }
    return { seen: transfers.length, matched };
  }

  /** Exact amount (with tail) first; else the plain amount when only one open collection asked for it. */
  private async match(txHash: string, amount: string, at: Date): Promise<boolean> {
    // Amounts with more than 4 decimals were never asked for.
    if (!/^\d+(\.\d{1,4})?$/.test(amount)) return false;
    const value = new Prisma.Decimal(amount);
    const window = { createdAt: { lte: at }, expiresAt: { gte: new Date(at.getTime() - EXPIRY_GRACE_MS) } };

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

  private async transfersSince(since: number): Promise<Trc20Transfer[]> {
    const out: Trc20Transfer[] = [];
    const params = new URLSearchParams({
      only_confirmed: 'true',
      only_to: 'true',
      limit: '200',
      contract_address: this.contract,
      min_timestamp: String(Math.max(0, since)),
      order_by: 'block_timestamp,asc',
    });
    let url: string | undefined = `${this.network.api}/v1/accounts/${this.address}/transactions/trc20?${params}`;
    for (let page = 0; url && page < MAX_PAGES; page++) {
      let response: Response;
      try {
        response = await this.fetchImpl(url, {
          headers: { Accept: 'application/json', ...(this.credentials.apiKey && { 'TRON-PRO-API-KEY': this.credentials.apiKey }) },
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
      } catch (error) {
        throw new Error(`Could not reach TronGrid: ${error instanceof Error ? error.message : error}`);
      }
      const body = (await response.json().catch(() => ({}))) as { data?: Trc20Transfer[]; meta?: { links?: { next?: string } }; error?: string };
      if (!response.ok) throw new Error(body.error || `TronGrid returned HTTP ${response.status}`);
      for (const t of body.data ?? []) {
        const incoming = t.to === this.address && (t.type ?? 'Transfer') === 'Transfer';
        const token = !t.token_info?.address || t.token_info.address === this.contract;
        if (incoming && token && t.transaction_id && /^\d+$/.test(t.value)) out.push(t);
      }
      url = body.meta?.links?.next;
    }
    return out;
  }
}

/** Exposed for tests: allow an immediate rescan. */
export function resetTronScanThrottle(): void {
  lastScan.clear();
}

/** "25003700", 6 → "25.0037". */
function formatUnits(value: string, decimals: number): string {
  const digits = value.replace(/^0+(?=\d)/, '').padStart(decimals + 1, '0');
  const whole = digits.slice(0, digits.length - decimals);
  const frac = digits.slice(digits.length - decimals).replace(/0+$/, '');
  return frac ? `${whole}.${frac}` : whole;
}

/** 250037n (scale 4) → "25.0037"; 250000n → "25". */
function trimAmount(scaled: bigint): string {
  return formatScaled(scaled).replace(/\.?0+$/, '');
}
