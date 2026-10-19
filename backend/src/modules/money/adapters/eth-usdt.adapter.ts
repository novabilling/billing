import { keccak_256 } from '@noble/hashes/sha3';
import { PrismaClient } from '../../../generated/prisma-tenant/client';
import { StablecoinWatchAdapter, WatchCredentials, WatchedTransfer } from './stablecoin-watch';

/**
 * Watch-only USDT on Ethereum (ERC-20): payers send USDT straight to the
 * merchant's own Ethereum address; transfers with enough confirmations are
 * read through the Etherscan API. Matching and expiry live in
 * StablecoinWatchAdapter.
 */
export interface EthUsdtCredentials extends WatchCredentials {
  /** The merchant's own Ethereum address (0x…). */
  address: string;
  /** Etherscan API key (free at etherscan.io). */
  apiKey: string;
  network?: 'mainnet' | 'sepolia';
  /** Required on Sepolia, which has no official USDT. */
  tokenContract?: string;
  /** Blocks on top before a transfer counts (default 12, about 2.5 minutes). */
  confirmations?: number | string;
}

const NETWORKS = {
  mainnet: { chainId: '1', usdt: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
  sepolia: { chainId: '11155111', usdt: '' },
};
const API = 'https://api.etherscan.io/v2/api';
const TIMEOUT_MS = 20_000;
const PAGE_SIZE = 200;
const MAX_PAGES = 5;

interface Erc20Transfer {
  hash: string;
  timeStamp: string;
  from?: string;
  to?: string;
  value: string;
  tokenDecimal?: string;
  contractAddress?: string;
  confirmations?: string;
}

/** 0x + 40 hex; mixed case must carry a valid EIP-55 checksum. */
export function isEthereumAddress(value: string): boolean {
  if (!/^0x[0-9a-fA-F]{40}$/.test(value)) return false;
  const hex = value.slice(2);
  if (hex === hex.toLowerCase() || hex === hex.toUpperCase()) return true;
  const hash = Buffer.from(keccak_256(hex.toLowerCase())).toString('hex');
  return [...hex].every((c, i) => (/[a-f]/i.test(c) ? (parseInt(hash[i], 16) >= 8 ? c === c.toUpperCase() : c === c.toLowerCase()) : true));
}

export class EthUsdtAdapter extends StablecoinWatchAdapter {
  readonly name = 'eth_usdt';
  protected readonly chain = 'ETHEREUM';
  protected readonly chainAliases = ['ETHEREUM', 'ETH', 'ERC20'];
  protected readonly coin = 'USDT';

  declare protected readonly credentials: EthUsdtCredentials;

  constructor(credentials: EthUsdtCredentials, db: PrismaClient, fetchImpl?: typeof fetch) {
    super(credentials, db, fetchImpl);
  }

  private get network() {
    return NETWORKS[this.credentials.network === 'sepolia' ? 'sepolia' : 'mainnet'];
  }

  protected get scanKey() {
    return `eth:${this.network.chainId}`;
  }

  /** Ethereum addresses compare case-insensitively; store them lowercase. */
  protected get address(): string {
    return this.credentials.address.trim().toLowerCase();
  }

  private get contract() {
    return (this.credentials.tokenContract || this.network.usdt).toLowerCase();
  }

  private get confirmations() {
    const n = Number(this.credentials.confirmations);
    return n > 0 ? n : 12;
  }

  protected isValidAddress(address: string): boolean {
    return isEthereumAddress(address);
  }

  protected setupProblem(): string | undefined {
    if (!this.credentials.apiKey) return 'Add an Etherscan API key to this connection';
    if (!this.contract) return 'Set the USDT token contract for this test network';
    return undefined;
  }

  /** Newest first, page by page, until a page reaches back past `since`. */
  protected async transfersSince(since: number): Promise<WatchedTransfer[]> {
    const out: WatchedTransfer[] = [];
    for (let page = 1; page <= MAX_PAGES; page++) {
      const params = new URLSearchParams({
        chainid: this.network.chainId,
        module: 'account',
        action: 'tokentx',
        contractaddress: this.contract,
        address: this.address,
        page: String(page),
        offset: String(PAGE_SIZE),
        sort: 'desc',
        apikey: this.credentials.apiKey,
      });
      let response: Response;
      try {
        response = await this.fetchImpl(`${API}?${params}`, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(TIMEOUT_MS) });
      } catch (error) {
        throw new Error(`Could not reach Etherscan: ${error instanceof Error ? error.message : error}`);
      }
      const body = (await response.json().catch(() => ({}))) as { status?: string; message?: string; result?: Erc20Transfer[] | string };
      if (!response.ok) throw new Error(`Etherscan returned HTTP ${response.status}`);
      if (body.status !== '1') {
        if (Array.isArray(body.result) || /no transactions found/i.test(body.message ?? '')) break;
        throw new Error(`Etherscan: ${typeof body.result === 'string' ? body.result : body.message}`);
      }
      const rows = Array.isArray(body.result) ? body.result : [];
      let reachedSince = false;
      for (const t of rows) {
        const time = Number(t.timeStamp) * 1000;
        if (time < since) {
          reachedSince = true;
          continue;
        }
        const incoming = t.to?.toLowerCase() === this.address;
        const token = !t.contractAddress || t.contractAddress.toLowerCase() === this.contract;
        // Not yet deep enough: picked up by a later scan, which reaches back past it.
        const deep = Number(t.confirmations ?? 0) >= this.confirmations;
        if (incoming && token && deep && t.hash && /^\d+$/.test(t.value)) {
          out.push({ hash: t.hash, time, from: t.from, value: t.value, decimals: Number(t.tokenDecimal ?? 6) });
        }
      }
      if (reachedSince || rows.length < PAGE_SIZE) break;
    }
    return out.sort((a, b) => a.time - b.time);
  }
}
