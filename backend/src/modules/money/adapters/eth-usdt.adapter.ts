import { keccak_256 } from '@noble/hashes/sha3';
import { PrismaClient } from '../../../generated/prisma-tenant/client';
import { StablecoinWatchAdapter, WatchCredentials, WatchedTransfer } from './stablecoin-watch';

/**
 * Watch-only USDT on Ethereum-style chains (Ethereum, BNB Smart Chain):
 * payers send USDT straight to the merchant's own address; transfers with
 * enough confirmations are read through the Etherscan API (one key covers
 * every chain it indexes) or any Etherscan-compatible explorer API.
 * Matching and expiry live in StablecoinWatchAdapter.
 */
export interface EthUsdtCredentials extends WatchCredentials {
  /** The merchant's own Ethereum address (0x…). */
  address: string;
  /** Etherscan API key (free at etherscan.io), or the key for `apiUrl`. */
  apiKey: string;
  /** "mainnet", or the chain's testnet ("sepolia" for Ethereum, "testnet" for BNB Chain). */
  network?: string;
  /** Required on testnets, which have no official USDT. */
  tokenContract?: string;
  /** Blocks on top before a transfer counts (default 12 on Ethereum, 15 on BNB Chain). */
  confirmations?: number | string;
  /** Another Etherscan-compatible API, e.g. a BNB Chain explorer API. */
  apiUrl?: string;
}

interface EvmChain {
  chain: string;
  aliases: string[];
  label: string;
  mainnet: { chainId: string; usdt: string };
  testnet: { name: string; chainId: string };
  confirmations: number;
}

export const EVM_CHAINS: Record<'ethereum' | 'bsc', EvmChain> = {
  ethereum: {
    chain: 'ETHEREUM',
    aliases: ['ETHEREUM', 'ETH', 'ERC20'],
    label: 'Ethereum',
    mainnet: { chainId: '1', usdt: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
    testnet: { name: 'sepolia', chainId: '11155111' },
    confirmations: 12,
  },
  // BNB Smart Chain's USDT ("BSC-USD") has 18 decimals; amounts are read with each transfer's own decimals.
  bsc: {
    chain: 'BSC',
    aliases: ['BSC', 'BNB', 'BEP20', 'BNB SMART CHAIN', 'BINANCE SMART CHAIN'],
    label: 'BNB Chain',
    mainnet: { chainId: '56', usdt: '0x55d398326f99059ff775485246999027b3197955' },
    testnet: { name: 'testnet', chainId: '97' },
    confirmations: 15,
  },
};

const ETHERSCAN_API = 'https://api.etherscan.io/v2/api';
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
  readonly name: string = 'eth_usdt';
  protected readonly coin = 'USDT';
  protected readonly preset: EvmChain = EVM_CHAINS.ethereum;

  declare protected readonly credentials: EthUsdtCredentials;

  constructor(credentials: EthUsdtCredentials, db: PrismaClient, fetchImpl?: typeof fetch) {
    super(credentials, db, fetchImpl);
  }

  protected get chain() {
    return this.preset.chain;
  }

  protected get chainAliases() {
    return this.preset.aliases;
  }

  private get testnet() {
    return Boolean(this.credentials.network) && this.credentials.network!.toLowerCase() === this.preset.testnet.name;
  }

  private get chainId() {
    return this.testnet ? this.preset.testnet.chainId : this.preset.mainnet.chainId;
  }

  protected get scanKey() {
    return `evm:${this.chainId}`;
  }

  /** Ethereum addresses compare case-insensitively; store them lowercase. */
  protected get address(): string {
    return this.credentials.address.trim().toLowerCase();
  }

  private get contract() {
    return (this.credentials.tokenContract || (this.testnet ? '' : this.preset.mainnet.usdt)).toLowerCase();
  }

  private get confirmations() {
    const n = Number(this.credentials.confirmations);
    return n > 0 ? n : this.preset.confirmations;
  }

  protected isValidAddress(address: string): boolean {
    return isEthereumAddress(address);
  }

  protected setupProblem(): string | undefined {
    if (!this.credentials.apiKey) return `Add an ${this.credentials.apiUrl ? 'explorer' : 'Etherscan'} API key to this connection`;
    if (!this.contract) return 'Set the USDT token contract for this test network';
    return undefined;
  }

  /** Newest first, page by page, until a page reaches back past `since`. */
  protected async transfersSince(since: number): Promise<WatchedTransfer[]> {
    const out: WatchedTransfer[] = [];
    for (let page = 1; page <= MAX_PAGES; page++) {
      const params = new URLSearchParams({
        chainid: this.chainId,
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
        response = await this.fetchImpl(`${this.credentials.apiUrl || ETHERSCAN_API}?${params}`, {
          headers: { Accept: 'application/json' },
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
      } catch (error) {
        throw new Error(`Could not reach the ${this.preset.label} explorer API: ${error instanceof Error ? error.message : error}`);
      }
      const body = (await response.json().catch(() => ({}))) as { status?: string; message?: string; result?: Erc20Transfer[] | string };
      if (!response.ok) throw new Error(`${this.preset.label} explorer API returned HTTP ${response.status}`);
      if (body.status !== '1') {
        if (Array.isArray(body.result) || /no transactions found/i.test(body.message ?? '')) break;
        throw new Error(`${this.preset.label} explorer API: ${typeof body.result === 'string' ? body.result : body.message}`);
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

/** Watch-only USDT (BEP-20) on BNB Smart Chain: same mechanics as Ethereum, its own chain id and token. */
export class BscUsdtAdapter extends EthUsdtAdapter {
  readonly name: string = 'bsc_usdt';
  protected readonly preset: EvmChain = EVM_CHAINS.bsc;
}
