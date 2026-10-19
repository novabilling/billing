import { Capabilities, CollectRequest, MoneyProvider, ProviderOutcome } from '../types';
import { toScaled } from '../../ledger/ledger.money';

/**
 * Stablecoin collections through Eversend (eversend.co). The tenant holds
 * its own Eversend business account; for each collection we create a
 * deposit address on the chosen chain, the payer sends the coin to it, and
 * Eversend credits the tenant's wallet there. We never hold crypto.
 *
 * Unlike NOWPayments there is no fiat-priced invoice: the collection is in
 * the coin itself (USDT or USDC), and it settles when deposits to its
 * address reach the amount asked for.
 *
 * Paths follow Eversend's v1 API (auth/token, crypto/assets, crypto/addresses).
 */
export interface EversendCredentials {
  clientId: string;
  clientSecret: string;
  /** Override the API host, e.g. for a sandbox. */
  baseUrl?: string;
  /** Chain used when the payer does not name one, e.g. "TRON". */
  defaultChain?: string;
}

export const EVERSEND_COINS = ['USDT', 'USDC'];

const DEFAULT_URL = 'https://api.eversend.co/v1';
const TIMEOUT_MS = 30_000;
const SETTLED = new Set(['successful', 'success', 'completed', 'complete', 'confirmed', 'credited']);
const FAILED = new Set(['failed', 'rejected', 'reversed', 'cancelled', 'canceled']);

const tokens = new Map<string, { token: string; expiresAt: number }>();

interface AssetChain {
  assetId: string;
  chain: string;
}

interface Deposit {
  amount: number;
  coin?: string;
  status: string;
  hash?: string;
}

export class EversendAdapter implements MoneyProvider {
  readonly name = 'eversend';
  readonly capabilities: Capabilities = { collect: ['crypto'], payout: [], balance: true, verifyPayee: false };

  constructor(
    private readonly credentials: EversendCredentials,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  private get baseUrl() {
    return (this.credentials.baseUrl || DEFAULT_URL).replace(/\/$/, '');
  }

  async collect(request: CollectRequest): Promise<ProviderOutcome> {
    if (request.payer.type !== 'crypto') {
      return { state: 'failed', failureReason: 'Eversend collects crypto to a deposit address' };
    }
    const coin = request.currency.toUpperCase();
    if (!EVERSEND_COINS.includes(coin)) {
      return { state: 'failed', failureReason: `Eversend crypto collections are in ${EVERSEND_COINS.join(' or ')}, not ${coin}` };
    }
    const wanted = (request.payer.chain ?? this.credentials.defaultChain)?.toUpperCase();

    // Looking up chains and creating an address move no money, so errors here are clean failures.
    let chains: AssetChain[];
    try {
      chains = await this.assetChains(coin);
    } catch (error) {
      return { state: 'failed', failureReason: error instanceof Error ? error.message : String(error) };
    }
    const asset = wanted ? chains.find((c) => c.chain.toUpperCase().includes(wanted)) : chains[0];
    if (!asset) {
      const names = chains.map((c) => c.chain).join(', ') || 'none';
      return { state: 'failed', failureReason: `Eversend has no ${coin} chain "${wanted}" (available: ${names})` };
    }

    const r = await this.call('POST', '/crypto/addresses', {
      assetId: asset.assetId,
      ownerName: request.payer.name || request.payer.email || 'Customer',
      destinationAddressDescription: request.reference,
      purpose: request.description.slice(0, 100),
    }).catch((error: Error) => ({ status: 0, body: { message: error.message } }));
    const data = pick(r.body);
    const address = str(data?.address) ?? str(data?.cryptoAddress) ?? str(data?.walletAddress);
    if (r.status < 200 || r.status >= 300 || !address) {
      return { state: 'failed', failureReason: message(r.body) || `Eversend could not create a deposit address (HTTP ${r.status})` };
    }
    const memo = str(data?.memo) ?? str(data?.tag) ?? str(data?.destinationTag);
    return {
      state: 'pending',
      // The address is this collection's handle at Eversend; status checks read its deposits.
      providerTxnId: address,
      providerStatus: 'AWAITING_DEPOSIT',
      paymentDetails: { kind: 'crypto_address', coin, chain: asset.chain, address, amount: request.amount, ...(memo && { memo }) },
    };
  }

  /**
   * Settled deposits to the address are added up: enough settles the
   * collection, less is held for review (an underpayment the tenant decides
   * on), nothing yet stays pending.
   */
  async getCollection(_reference: string, address?: string | null, expected?: string): Promise<ProviderOutcome> {
    if (!address) return { state: 'pending', providerStatus: 'NO_ADDRESS' };
    const r = await this.call('GET', `/crypto/addresses/${encodeURIComponent(address)}/transactions`);
    if (r.status !== 200) return { state: 'pending', providerStatus: `HTTP_${r.status}`, providerTxnId: address };

    const deposits = list(r.body).map(toDeposit).filter((d): d is Deposit => d !== null);
    const settled = deposits.filter((d) => SETTLED.has(d.status));
    const received = settled.reduce((sum, d) => sum + toScaled(d.amount), 0n);
    const confirming = deposits.some((d) => !SETTLED.has(d.status) && !FAILED.has(d.status));
    const want = expected ? toScaled(expected) : null;

    if (received === 0n) {
      return { state: 'pending', providerTxnId: address, providerStatus: confirming ? 'CONFIRMING' : 'AWAITING_DEPOSIT' };
    }
    const got = formatAmount(received);
    if (want === null || received >= want) {
      return { state: 'succeeded', providerTxnId: address, providerStatus: want !== null && received > want ? `OVERPAID_${got}` : 'RECEIVED' };
    }
    if (confirming) return { state: 'pending', providerTxnId: address, providerStatus: `PARTIAL_${got}` };
    return {
      state: 'pending',
      indeterminate: true,
      providerTxnId: address,
      providerStatus: `PARTIAL_${got}`,
      failureReason: `Underpaid: received ${got} of ${expected}`,
    };
  }

  async getBalance(): Promise<Record<string, string>> {
    const r = await this.call('GET', '/wallets');
    if (r.status !== 200) throw new Error(`Eversend balance failed (HTTP ${r.status})`);
    const out: Record<string, string> = {};
    for (const w of list(r.body)) {
      const currency = str(w.currency);
      if (currency) out[currency] = String(w.amount ?? w.balance ?? '0');
    }
    return out;
  }

  private async assetChains(coin: string): Promise<AssetChain[]> {
    const r = await this.call('GET', `/crypto/assets/${encodeURIComponent(coin)}`);
    if (r.status !== 200) throw new Error(message(r.body) || `Eversend could not list ${coin} chains (HTTP ${r.status})`);
    return list(r.body)
      .map((a) => ({
        assetId: str(a.assetId) ?? str(a.id) ?? '',
        chain: str(a.chain) ?? str(a.network) ?? str(a.blockchain) ?? str(a.name) ?? '',
      }))
      .filter((a) => a.assetId && a.chain);
  }

  // --- Transport ---

  private async call(method: 'GET' | 'POST', path: string, body?: unknown): Promise<{ status: number; body: unknown }> {
    const token = await this.token();
    let response: Response;
    try {
      response = await this.fetchImpl(`${this.baseUrl}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          ...(body !== undefined && { 'Content-Type': 'application/json' }),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      throw new Error(`Could not reach Eversend: ${error instanceof Error ? error.message : error}`);
    }
    const text = await response.text();
    let parsed: unknown = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = null;
    }
    return { status: response.status, body: parsed };
  }

  /** Eversend issues a bearer token from GET auth/token with the client id and secret as headers. */
  private async token(): Promise<string> {
    const cacheKey = `${this.baseUrl}|${this.credentials.clientId}`;
    const cached = tokens.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.token;

    let response: Response;
    try {
      response = await this.fetchImpl(`${this.baseUrl}/auth/token`, {
        method: 'GET',
        headers: { clientId: this.credentials.clientId, clientSecret: this.credentials.clientSecret, Accept: 'application/json' },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      throw new Error(`Could not reach Eversend: ${error instanceof Error ? error.message : error}`);
    }
    const body = (await response.json().catch(() => ({}))) as { token?: string; expires?: string; message?: string };
    if (!response.ok || !body.token) throw new Error(body.message || `Eversend authentication failed (HTTP ${response.status})`);
    const expires = body.expires ? Date.parse(body.expires) : NaN;
    tokens.set(cacheKey, { token: body.token, expiresAt: (Number.isFinite(expires) ? expires : Date.now() + 10 * 60_000) - 60_000 });
    return body.token;
  }
}

/** Exposed for tests: forget cached tokens. */
export function clearEversendTokenCache(): void {
  tokens.clear();
}

// --- Response helpers (Eversend wraps payloads in `data`, sometimes nested) ---

type Obj = Record<string, unknown>;

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : typeof v === 'number' ? String(v) : undefined;
}

function pick(body: unknown): Obj | undefined {
  const b = body as Obj | null;
  const data = (b?.data ?? b) as Obj | undefined;
  return (data?.address && typeof data.address === 'object' ? (data.address as Obj) : data) ?? undefined;
}

function list(body: unknown): Obj[] {
  const b = body as Obj | null;
  const data = b?.data ?? b;
  if (Array.isArray(data)) return data as Obj[];
  const d = data as Obj | undefined;
  for (const key of ['transactions', 'assets', 'chains', 'wallets', 'items', 'results']) {
    if (Array.isArray(d?.[key])) return d![key] as Obj[];
  }
  return [];
}

function message(body: unknown): string {
  const b = body as Obj | null;
  return str(b?.message) ?? str(b?.error) ?? '';
}

function toDeposit(t: Obj): Deposit | null {
  const amount = Number(t.amount ?? t.value ?? t.cryptoAmount);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  // Withdrawals out of the address are not payments in.
  const direction = str(t.type)?.toLowerCase() ?? str(t.direction)?.toLowerCase();
  if (direction && /out|withdraw|debit|send/.test(direction)) return null;
  return {
    amount,
    coin: str(t.coin) ?? str(t.currency),
    status: (str(t.status) ?? '').toLowerCase(),
    hash: str(t.hash) ?? str(t.txHash) ?? str(t.transactionHash),
  };
}

function formatAmount(scaled: bigint): string {
  const whole = scaled / 10000n;
  const frac = (scaled % 10000n).toString().padStart(4, '0').replace(/0+$/, '');
  return frac ? `${whole}.${frac}` : String(whole);
}

