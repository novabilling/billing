import { createHash } from 'crypto';
import { PrismaClient } from '../../../generated/prisma-tenant/client';
import { resetScanThrottle, StablecoinWatchAdapter, WatchCredentials, WatchedTransfer } from './stablecoin-watch';

/**
 * Watch-only USDT on TRON: payers send USDT straight to the merchant's own
 * TRON address; confirmed (solidified) transfers are read through TronGrid.
 * Matching and expiry live in StablecoinWatchAdapter.
 */
export interface TronUsdtCredentials extends WatchCredentials {
  /** The merchant's own TRON address (T…). */
  address: string;
  /** TronGrid API key; works without one at low volume. */
  apiKey?: string;
  network?: 'mainnet' | 'nile';
  /** Override the USDT contract (e.g. another testnet token). */
  tokenContract?: string;
}

const NETWORKS = {
  mainnet: { api: 'https://api.trongrid.io', usdt: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' },
  nile: { api: 'https://nile.trongrid.io', usdt: 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf' },
};
const TIMEOUT_MS = 20_000;
const MAX_PAGES = 5;

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

export class TronUsdtAdapter extends StablecoinWatchAdapter {
  readonly name = 'tron_usdt';
  protected readonly chain = 'TRON';
  protected readonly chainAliases = ['TRON', 'TRC20', 'TRX'];
  protected readonly coin = 'USDT';

  declare protected readonly credentials: TronUsdtCredentials;

  constructor(credentials: TronUsdtCredentials, db: PrismaClient, fetchImpl?: typeof fetch) {
    super(credentials, db, fetchImpl);
  }

  private get network() {
    return NETWORKS[this.credentials.network === 'nile' ? 'nile' : 'mainnet'];
  }

  protected get scanKey() {
    return this.network.api;
  }

  private get contract() {
    return this.credentials.tokenContract || this.network.usdt;
  }

  protected isValidAddress(address: string): boolean {
    return isTronAddress(address);
  }

  protected async transfersSince(since: number): Promise<WatchedTransfer[]> {
    const out: WatchedTransfer[] = [];
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
        if (incoming && token && t.transaction_id && /^\d+$/.test(t.value)) {
          out.push({ hash: t.transaction_id, time: t.block_timestamp, from: t.from, value: t.value, decimals: t.token_info?.decimals ?? 6 });
        }
      }
      url = body.meta?.links?.next;
    }
    return out;
  }
}

/** Exposed for tests: allow an immediate rescan. */
export const resetTronScanThrottle = resetScanThrottle;
