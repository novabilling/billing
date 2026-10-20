import { createHash } from 'crypto';
import { HDKey } from '@scure/bip32';
import { base58check, bech32 } from '@scure/base';
import { ripemd160 } from '@noble/hashes/legacy';
import { sha256 } from '@noble/hashes/sha2';
import { Prisma, PrismaClient } from '../../../generated/prisma-tenant/client';
import { Capabilities, CollectRequest, MoneyProvider, ProviderOutcome } from '../types';

/**
 * Watch-only Bitcoin collections to the merchant's own wallet. The merchant
 * gives us the account's extended public key (zpub, ypub or xpub) from its
 * wallet; each collection gets a fresh receive address derived from it, so
 * a payment is identified by the address alone. We can derive addresses
 * but never spend: private keys stay in the merchant's wallet.
 *
 * Collections are priced in the merchant's currency and converted to BTC at
 * a quote taken when the collection is created. The ledger keeps the
 * fiat amount; the BTC sent is kept on each deposit.
 */
export interface BtcCredentials {
  /** Account-level extended public key (depth 3), e.g. zpub… from Sparrow, Electrum, BlueWallet. */
  xpub: string;
  /** Address type for an xpub/tpub, whose prefix does not say; zpub and ypub carry their own. */
  addressType?: 'p2wpkh' | 'p2sh-p2wpkh' | 'p2pkh';
  network?: 'mainnet' | 'testnet';
  /** Confirmations before a payment counts (default 2). */
  confirmations?: number | string;
  /** Minutes the BTC quote holds (default 30). */
  expiryMinutes?: number | string;
  /** Underpayment accepted as paid, in percent of the quote (default 0.5). */
  tolerancePercent?: number | string;
  /** Esplora-compatible API, e.g. https://mempool.space/api. */
  esploraUrl?: string;
}

type AddressType = NonNullable<BtcCredentials['addressType']>;

/** SLIP-132 version bytes: the prefix of an extended public key says its network and address type. */
const VERSIONS: Record<string, { pub: number; testnet: boolean; type?: AddressType }> = {
  xpub: { pub: 0x0488b21e, testnet: false },
  ypub: { pub: 0x049d7cb2, testnet: false, type: 'p2sh-p2wpkh' },
  zpub: { pub: 0x04b24746, testnet: false, type: 'p2wpkh' },
  tpub: { pub: 0x043587cf, testnet: true },
  upub: { pub: 0x044a5262, testnet: true, type: 'p2sh-p2wpkh' },
  vpub: { pub: 0x045f1cf6, testnet: true, type: 'p2wpkh' },
};

const ESPLORA = { mainnet: 'https://blockstream.info/api', testnet: 'https://blockstream.info/testnet/api' };
const RATES_URL = 'https://api.coinbase.com/v2/exchange-rates?currency=BTC';
const TIMEOUT_MS = 20_000;
/** Payments first seen this long after the quote expired are left unmatched. */
const EXPIRY_GRACE_MS = 3 * 60 * 1000;
/** An address that expired unpaid is reused after this, keeping the wallet's gap small. */
const REUSE_AFTER_MS = 7 * 24 * 60 * 60 * 1000;
const SATS = 100_000_000n;

const b58c = base58check(sha256);
const hash160 = (data: Uint8Array) => ripemd160(sha256(data));

/** Receive address `index` (path …/0/index) of an account-level extended public key. */
export function deriveAddress(extendedKey: string, index: number, override?: AddressType): { address: string; testnet: boolean } {
  const prefix = extendedKey.slice(0, 4);
  const version = VERSIONS[prefix];
  if (!version) throw new Error('Use an extended public key starting with zpub, ypub, xpub, vpub, upub or tpub');
  const account = HDKey.fromExtendedKey(extendedKey, { private: 0, public: version.pub });
  if (account.depth !== 3) throw new Error('Use the account-level extended public key (as your wallet exports it), not a deeper or root key');
  const child = account.deriveChild(0).deriveChild(index);
  const pub = child.publicKey!;
  const type = version.type ?? override ?? 'p2wpkh';
  const testnet = version.testnet;

  if (type === 'p2wpkh') {
    return { address: bech32.encode(testnet ? 'tb' : 'bc', [0, ...bech32.toWords(hash160(pub))]), testnet };
  }
  if (type === 'p2sh-p2wpkh') {
    const redeem = new Uint8Array([0x00, 0x14, ...hash160(pub)]);
    return { address: b58c.encode(new Uint8Array([testnet ? 0xc4 : 0x05, ...hash160(redeem)])), testnet };
  }
  return { address: b58c.encode(new Uint8Array([testnet ? 0x6f : 0x00, ...hash160(pub)])), testnet };
}

/** Major fiat units per BTC (e.g. "250000000" UGX) → satoshis for `amount`, rounded up. */
export function fiatToSats(amount: string, ratePerBtc: string): bigint {
  const scale = 10n ** 8n;
  const toFixed8 = (v: string) => {
    const [w, f = ''] = v.split('.');
    return BigInt(w) * scale + BigInt((f + '00000000').slice(0, 8));
  };
  const a = toFixed8(amount);
  const r = toFixed8(ratePerBtc);
  if (r <= 0n) throw new Error('Invalid BTC rate');
  return (a * SATS + r - 1n) / r;
}

export function formatSats(sats: bigint): string {
  const whole = sats / SATS;
  const frac = (sats % SATS).toString().padStart(8, '0').replace(/0+$/, '');
  return frac ? `${whole}.${frac}` : String(whole);
}

interface EsploraTx {
  txid: string;
  status: { confirmed: boolean; block_height?: number; block_time?: number };
  vout: { scriptpubkey_address?: string; value: number }[];
}

export class BtcAdapter implements MoneyProvider {
  readonly name = 'btc';
  readonly capabilities: Capabilities = { collect: ['crypto'], payout: [], balance: false, verifyPayee: false };

  constructor(
    private readonly credentials: BtcCredentials,
    private readonly db: PrismaClient,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  private get key() {
    return this.credentials.xpub.trim();
  }

  private get keyId() {
    return createHash('sha256').update(this.key).digest('hex').slice(0, 16);
  }

  private get esplora() {
    const testnet = VERSIONS[this.key.slice(0, 4)]?.testnet ?? this.credentials.network === 'testnet';
    return (this.credentials.esploraUrl || ESPLORA[testnet ? 'testnet' : 'mainnet']).replace(/\/$/, '');
  }

  private num(value: number | string | undefined, fallback: number) {
    const n = Number(value);
    return value !== undefined && value !== '' && n >= 0 ? n : fallback;
  }

  async collect(request: CollectRequest): Promise<ProviderOutcome> {
    if (request.payer.type !== 'crypto') return { state: 'failed', failureReason: 'Bitcoin collects crypto only' };
    if (request.payer.chain && !['BITCOIN', 'BTC'].includes(request.payer.chain)) {
      return { state: 'failed', failureReason: `This connection receives Bitcoin, not ${request.payer.chain}` };
    }
    const currency = request.currency.toUpperCase();
    if (['BTC', 'USDT', 'USDC'].includes(currency)) {
      return { state: 'failed', failureReason: 'Price Bitcoin collections in your own currency (e.g. UGX or USD); the BTC amount is quoted for you' };
    }
    try {
      deriveAddress(this.key, 0, this.credentials.addressType);
    } catch (error) {
      return { state: 'failed', failureReason: error instanceof Error ? error.message : String(error) };
    }

    let rate: string;
    try {
      rate = await this.rate(currency);
    } catch (error) {
      return { state: 'failed', failureReason: error instanceof Error ? error.message : String(error) };
    }
    const sats = fiatToSats(request.amount, rate);
    if (sats < 1000n) return { state: 'failed', failureReason: 'Amount is too small to pay in Bitcoin' };

    const expiresAt = new Date(Date.now() + this.num(this.credentials.expiryMinutes, 30) * 60_000);
    const claim = await this.claimAddress(request.reference, sats, rate, expiresAt);
    return {
      state: 'pending',
      providerStatus: 'AWAITING_PAYMENT',
      paymentDetails: { kind: 'crypto_address', coin: 'BTC', chain: 'BITCOIN', address: claim.address, amount: formatSats(claim.amountSats) },
    };
  }

  /** Reuse an address that expired unpaid over a week ago, else derive the next one. */
  private async claimAddress(reference: string, amountSats: bigint, rate: string, expiresAt: Date) {
    const existing = await this.db.cryptoAddressClaim.findUnique({ where: { reference } });
    if (existing) return existing;

    for (let attempt = 0; attempt < 5; attempt++) {
      const candidates = await this.db.cryptoAddressClaim.findMany({
        where: { keyId: this.keyId, expiresAt: { lt: new Date(Date.now() - REUSE_AFTER_MS) } },
        orderBy: { index: 'asc' },
        take: 20,
      });
      const used = new Set(
        (await this.db.cryptoDeposit.findMany({ where: { address: { in: candidates.map((c) => c.address) } }, select: { address: true } })).map(
          (d) => d.address,
        ),
      );
      const stale = candidates.find((c) => !used.has(c.address));
      if (stale) {
        const taken = await this.db.cryptoAddressClaim.updateMany({
          where: { id: stale.id, updatedAt: stale.updatedAt },
          data: { reference, amountSats, rate, expiresAt },
        });
        if (taken.count) return { ...stale, reference, amountSats, rate, expiresAt };
        continue;
      }
      const last = await this.db.cryptoAddressClaim.findFirst({ where: { keyId: this.keyId }, orderBy: { index: 'desc' } });
      const index = (last?.index ?? -1) + 1;
      try {
        return await this.db.cryptoAddressClaim.create({
          data: { keyId: this.keyId, index, address: deriveAddress(this.key, index, this.credentials.addressType).address, reference, amountSats, rate, expiresAt },
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') continue; // another collection took this index
        throw error;
      }
    }
    throw new Error('Could not reserve a Bitcoin address; try again');
  }

  async getCollection(reference: string): Promise<ProviderOutcome> {
    const claim = await this.db.cryptoAddressClaim.findUnique({ where: { reference } });
    if (!claim) return { state: 'failed', providerStatus: 'NO_ADDRESS', failureReason: 'No Bitcoin address was reserved for this collection' };

    const [tip, txs] = await Promise.all([this.tipHeight(), this.addressTxs(claim.address)]);
    const need = this.num(this.credentials.confirmations, 2);
    const deadline = claim.expiresAt.getTime() + EXPIRY_GRACE_MS;

    let confirmed = 0n;
    let confirming = 0n;
    let firstTxid: string | undefined;
    for (const tx of txs) {
      const depth = tx.status.confirmed && tx.status.block_height ? tip - tx.status.block_height + 1 : 0;
      for (const [n, out] of tx.vout.entries()) {
        if (out.scriptpubkey_address !== claim.address) continue;
        const sats = BigInt(out.value);
        const seen = await this.record(`${tx.txid}:${n}`, claim, sats, tx, depth >= need, deadline);
        if (seen.reference !== reference) continue; // arrived too late, or paid an earlier use of this address
        if (depth >= need) {
          confirmed += sats;
          firstTxid ??= tx.txid;
        } else confirming += sats;
      }
    }

    const want = claim.amountSats;
    const floor = want - (want * BigInt(Math.round(this.num(this.credentials.tolerancePercent, 0.5) * 100))) / 10_000n;
    if (confirmed >= floor) {
      return {
        state: 'succeeded',
        providerTxnId: firstTxid,
        providerStatus: confirmed > want ? `OVERPAID_${formatSats(confirmed)}_BTC` : `RECEIVED_${formatSats(confirmed)}_BTC`,
      };
    }
    if (confirming > 0n) {
      return { state: 'pending', providerStatus: `CONFIRMING_${formatSats(confirmed + confirming)}_BTC` };
    }
    if (confirmed > 0n && Date.now() > deadline) {
      return {
        state: 'pending',
        indeterminate: true,
        providerTxnId: firstTxid,
        providerStatus: `PARTIAL_${formatSats(confirmed)}_BTC`,
        failureReason: `Underpaid: received ${formatSats(confirmed)} of ${formatSats(want)} BTC`,
      };
    }
    if (Date.now() > deadline) {
      return { state: 'failed', providerStatus: 'EXPIRED', failureReason: `Expired: no payment of ${formatSats(want)} BTC arrived before the quote ran out` };
    }
    return { state: 'pending', providerStatus: confirmed > 0n ? `PARTIAL_${formatSats(confirmed)}_BTC` : 'AWAITING_PAYMENT' };
  }

  /**
   * Keep one deposit row per output. It belongs to the collection if first
   * seen before the quote ran out; later ones stay unmatched for the
   * merchant to deal with.
   */
  private async record(
    key: string,
    claim: { address: string; reference: string | null },
    sats: bigint,
    tx: EsploraTx,
    deep: boolean,
    deadline: number,
  ) {
    const existing = await this.db.cryptoDeposit.findUnique({ where: { txHash: key } });
    if (existing) {
      if (deep && existing.status === 'CONFIRMING') {
        return this.db.cryptoDeposit.update({ where: { txHash: key }, data: { status: existing.reference ? 'MATCHED' : 'UNMATCHED' } });
      }
      return existing;
    }
    const onTime = Date.now() <= deadline || (tx.status.block_time !== undefined && tx.status.block_time * 1000 <= deadline);
    const reference = onTime ? claim.reference : null;
    try {
      return await this.db.cryptoDeposit.create({
        data: {
          chain: 'BITCOIN',
          token: 'BTC',
          address: claim.address,
          txHash: key,
          // Six decimals for display; rawAmount keeps the exact satoshis.
          amount: new Prisma.Decimal(formatSats(sats - (sats % 100n))),
          rawAmount: sats.toString(),
          decimals: 8,
          blockTime: tx.status.block_time ? new Date(tx.status.block_time * 1000) : new Date(),
          status: deep ? (reference ? 'MATCHED' : 'UNMATCHED') : 'CONFIRMING',
          reference,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return this.db.cryptoDeposit.findUniqueOrThrow({ where: { txHash: key } });
      }
      throw error;
    }
  }

  private async rate(currency: string): Promise<string> {
    const body = await this.get<{ data?: { rates?: Record<string, string> } }>(RATES_URL, 'the BTC price service');
    const rate = body.data?.rates?.[currency];
    if (!rate || !(Number(rate) > 0)) throw new Error(`No BTC price available in ${currency}`);
    return rate;
  }

  private async tipHeight(): Promise<number> {
    const height = Number(await this.get<number>(`${this.esplora}/blocks/tip/height`, 'the Bitcoin network'));
    if (!Number.isFinite(height)) throw new Error('Could not read the Bitcoin block height');
    return height;
  }

  private async addressTxs(address: string): Promise<EsploraTx[]> {
    const txs = await this.get<EsploraTx[]>(`${this.esplora}/address/${address}/txs`, 'the Bitcoin network');
    return Array.isArray(txs) ? txs : [];
  }

  private async get<T>(url: string, what: string): Promise<T> {
    let response: Response;
    try {
      response = await this.fetchImpl(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(TIMEOUT_MS) });
    } catch (error) {
      throw new Error(`Could not reach ${what}: ${error instanceof Error ? error.message : error}`);
    }
    if (!response.ok) throw new Error(`${what[0].toUpperCase()}${what.slice(1)} returned HTTP ${response.status}`);
    return (await response.json()) as T;
  }
}
