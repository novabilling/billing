import {
  Capabilities,
  CollectRequest,
  MoneyProvider,
  Party,
  PayoutRequest,
  ProviderAmbiguousError,
  ProviderOutcome,
  Rail,
} from '../types';
import { toScaled } from '../../ledger/ledger.money';
import { countryOfNumber, toInternational } from '../msisdn';

/**
 * Eversend (eversend.co): mobile money and stablecoin collections, and
 * mobile money / bank payouts in its markets. The tenant holds its own
 * Eversend business account.
 *
 * Mobile money collections: a prompt to the payer's phone, with our
 * reference as transactionRef. Where Eversend asks for it, the payer first
 * gets an SMS code (collections/otp) that the collection quotes back.
 *
 * Collections: for each collection we create a
 * deposit address on the chosen chain, the payer sends the coin to it, and
 * Eversend credits the tenant's wallet there. We never hold crypto.
 *
 * Unlike NOWPayments there is no fiat-priced invoice: the collection is in
 * the coin itself (USDT or USDC), and it settles when deposits to its
 * address reach the amount asked for.
 *
 * Payouts: a quotation (payouts/quotation) fixes the rate and fee and
 * returns a token, which the payout (payouts) then spends. Our reference
 * goes as transactionRef so a payout can be found even if its reply is lost.
 *
 * Paths follow Eversend's v1 API as used by its official Node SDK.
 */
export interface EversendCredentials {
  clientId: string;
  clientSecret: string;
  /** Override the API host, e.g. for a sandbox. */
  baseUrl?: string;
  /** Chain used when the payer does not name one, e.g. "TRON". */
  defaultChain?: string;
  /**
   * Eversend wallet payouts are paid from, e.g. "USD" to fund KES payouts
   * from a dollar balance. Defaults to the payout's own currency.
   */
  payoutSourceWallet?: string;
  /** Country for payouts when the payee does not say (ISO alpha-2), e.g. "UG". */
  defaultCountry?: string;
  /** Phone sent with bank payouts when the payee has none (Eversend requires one). */
  contactPhone?: string;
}

export const EVERSEND_COINS = ['USDT', 'USDC'];

const DEFAULT_URL = 'https://api.eversend.co/v1';
const TIMEOUT_MS = 30_000;
const SETTLED = new Set(['successful', 'success', 'completed', 'complete', 'confirmed', 'credited', 'settled']);
const FAILED = new Set(['failed', 'rejected', 'reversed', 'cancelled', 'canceled', 'declined', 'expired']);

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
  readonly capabilities: Capabilities = {
    collect: ['mobile_money', 'crypto'],
    payout: ['mobile_money', 'bank'],
    balance: true,
    verifyPayee: false,
  };

  constructor(
    private readonly credentials: EversendCredentials,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  private get baseUrl() {
    return (this.credentials.baseUrl || DEFAULT_URL).replace(/\/$/, '');
  }

  async collect(request: CollectRequest): Promise<ProviderOutcome> {
    if (request.payer.type === 'mobile_money') return this.collectMobileMoney(request, request.payer);
    if (request.payer.type !== 'crypto') {
      return { state: 'failed', failureReason: 'Eversend collects from mobile money numbers and to crypto deposit addresses' };
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

  private async collectMobileMoney(request: CollectRequest, payer: Extract<Party, { type: 'mobile_money' }>): Promise<ProviderOutcome> {
    const fallback = this.credentials.defaultCountry?.toUpperCase() ?? 'UG';
    const phone = toInternational(payer.msisdn, fallback);
    const country = countryOfNumber(phone) ?? fallback;
    const currency = request.currency.toUpperCase();

    let r: { status: number; body: unknown };
    try {
      r = await this.call('POST', '/collections/momo', {
        amount: Number(request.amount),
        currency,
        country,
        phone: `+${phone}`,
        transactionRef: request.reference,
        ...(payer.name && { customer: { name: payer.name } }),
        ...(request.otp?.pin && request.otp.pinId && { otp: { pin: request.otp.pin, pinId: request.otp.pinId } }),
        // Ghana mobile money finishes on a page Eversend redirects back from.
        ...(country === 'GH' && request.callbackUrl && { redirect_url: request.callbackUrl }),
      });
    } catch (error) {
      // The prompt may have gone out; find it by reference before anything else.
      throw new ProviderAmbiguousError(error instanceof Error ? error.message : String(error));
    }
    if (r.status >= 500) {
      return { state: 'pending', indeterminate: true, failureReason: message(r.body) || `Eversend HTTP ${r.status}` };
    }
    if (r.status >= 300) {
      return { state: 'failed', providerStatus: `HTTP_${r.status}`, failureReason: message(r.body) || 'Eversend refused the collection' };
    }
    const tx = transaction(r.body);
    const d = unwrap(r.body);
    const redirect = str(d?.redirectUrl) ?? str(d?.redirect_url) ?? str(d?.paymentUrl) ?? str(d?.link);
    return {
      ...mapTransactionStatus(tx?.status),
      providerTxnId: tx?.transactionId,
      providerStatus: tx?.status?.toUpperCase() || 'PROMPT_SENT',
      ...(redirect && { paymentUrl: redirect }),
    };
  }

  /** Text the payer a one-time code; the collection then quotes back the pinId and the code. */
  async requestPayerOtp(msisdn: string): Promise<{ pinId: string }> {
    const phone = toInternational(msisdn, this.credentials.defaultCountry?.toUpperCase() ?? 'UG');
    const r = await this.call('POST', '/collections/otp', { phone: `+${phone}` });
    const d = unwrap(r.body);
    const pinId = str(d?.pinId) ?? str((d?.otp as Obj | undefined)?.pinId);
    if (r.status >= 300 || !pinId) throw new Error(message(r.body) || `Eversend could not send the code (HTTP ${r.status})`);
    return { pinId };
  }

  /**
   * Settled deposits to the address are added up: enough settles the
   * collection, less is held for review (an underpayment the tenant decides
   * on), nothing yet stays pending.
   */
  async getCollection(reference: string, address?: string | null, expected?: string, rail?: Rail): Promise<ProviderOutcome> {
    // Mobile money collections are ordinary Eversend transactions.
    if (rail === 'mobile_money') return this.transactionStatus(reference, address, 'collection');
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

  // --- Payouts ---

  async payout(request: PayoutRequest): Promise<ProviderOutcome> {
    const payee = request.payee;
    if (payee.type !== 'mobile_money' && payee.type !== 'bank') {
      return { state: 'failed', failureReason: 'Eversend pays out to mobile money numbers and bank accounts only' };
    }
    const fullName = payee.type === 'bank' ? payee.accountName : payee.name;
    const [firstName, ...rest] = (fullName ?? '').trim().split(/\s+/);
    if (!firstName || rest.length === 0) {
      return { state: 'failed', failureReason: "Eversend needs the recipient's first and last name" };
    }
    const destinationCurrency = request.currency.toUpperCase();
    const fallbackCountry = this.credentials.defaultCountry?.toUpperCase();
    let country: string | undefined;
    let phone: string | undefined;
    if (payee.type === 'mobile_money') {
      const international = toInternational(payee.msisdn, fallbackCountry ?? 'UG');
      country = countryOfNumber(international) ?? fallbackCountry;
      phone = international;
    } else {
      country = payee.country?.toUpperCase() ?? fallbackCountry;
      phone = (payee.phone ?? this.credentials.contactPhone)?.replace(/[^\d]/g, '');
      if (!phone) return { state: 'failed', failureReason: "Eversend bank payouts need the recipient's phone number" };
      if (!payee.bankCode) return { state: 'failed', failureReason: 'Eversend bank payouts need the bank code (see its delivery banks list)' };
    }
    if (!country) return { state: 'failed', failureReason: 'Could not tell which country to pay out to' };

    // The quotation only prices the payout; nothing moves, so errors are clean failures.
    const quote = await this.call('POST', '/payouts/quotation', {
      sourceWallet: (this.credentials.payoutSourceWallet ?? destinationCurrency).toUpperCase(),
      type: payee.type === 'bank' ? 'bank' : 'momo',
      amount: Number(request.amount),
      destinationCountry: country,
      destinationCurrency,
      // The payee receives exactly the amount asked for; fees come from the source wallet.
      amountType: 'DESTINATION',
    }).catch((error: Error) => ({ status: 0, body: { message: error.message } }));
    const q = (unwrap(quote.body)?.quotation ?? unwrap(quote.body)) as Obj | undefined;
    const quotationToken = str(unwrap(quote.body)?.token) ?? str(q?.token);
    if (quote.status < 200 || quote.status >= 300 || !quotationToken) {
      return { state: 'failed', failureReason: message(quote.body) || `Eversend could not quote the payout (HTTP ${quote.status})` };
    }
    const sameWallet = (this.credentials.payoutSourceWallet ?? destinationCurrency).toUpperCase() === destinationCurrency;
    const fee = sameWallet ? Number(q?.totalFees ?? q?.fees ?? q?.fee) : NaN;

    let r: { status: number; body: unknown };
    try {
      r = await this.call('POST', '/payouts', {
        token: quotationToken,
        transactionRef: request.reference,
        firstName,
        lastName: rest.join(' '),
        phoneNumber: `+${phone}`,
        country,
        ...(payee.type === 'bank' && {
          bankName: payee.bankName ?? payee.bankCode,
          bankAccountName: payee.accountName,
          bankCode: payee.bankCode,
          bankAccountNumber: payee.accountNumber,
        }),
      });
    } catch (error) {
      // The request may have reached Eversend; check by reference before anything else.
      throw new ProviderAmbiguousError(error instanceof Error ? error.message : String(error));
    }
    const tx = transaction(r.body);
    if (r.status >= 500 || r.status === 0) {
      return { state: 'pending', indeterminate: true, failureReason: message(r.body) || `Eversend HTTP ${r.status}` };
    }
    if (r.status >= 300) {
      return { state: 'failed', providerStatus: `HTTP_${r.status}`, failureReason: message(r.body) || 'Eversend refused the payout' };
    }
    return {
      ...mapTransactionStatus(tx?.status),
      providerTxnId: tx?.transactionId,
      providerStatus: tx?.status?.toUpperCase() || 'SUBMITTED',
      ...(Number.isFinite(fee) && fee >= 0 && { fee }),
    };
  }

  async getPayout(reference: string, providerTxnId?: string | null, _rail?: Rail): Promise<ProviderOutcome> {
    return this.transactionStatus(reference, providerTxnId, 'payout');
  }

  /** By Eversend's transaction id when we have it, else by our reference. */
  private async transactionStatus(reference: string, providerTxnId: string | null | undefined, kind: 'payout' | 'collection'): Promise<ProviderOutcome> {
    let tx: { transactionId?: string; status?: string; reason?: string } | undefined;
    if (providerTxnId) {
      const r = await this.call('GET', `/transactions/${encodeURIComponent(providerTxnId)}`);
      if (r.status === 404) return { state: 'failed', providerStatus: 'NOT_FOUND', failureReason: `Eversend has no record of this ${kind}` };
      if (r.status !== 200) return { state: 'pending', providerStatus: `HTTP_${r.status}`, providerTxnId };
      tx = transaction(r.body);
    } else {
      const r = await this.call('GET', `/transactions?search=${encodeURIComponent(reference)}&limit=20`);
      if (r.status !== 200) return { state: 'pending', providerStatus: `HTTP_${r.status}` };
      const match = list(r.body).find((t) => str(t.transactionRef) === reference);
      // Not found yet: the request may never have arrived. It stays open for a person to resolve, never resent.
      if (!match) return { state: 'pending', providerStatus: 'NOT_FOUND_BY_REFERENCE' };
      tx = transaction({ data: match });
    }
    const mapped = mapTransactionStatus(tx?.status);
    return {
      ...mapped,
      providerTxnId: tx?.transactionId ?? providerTxnId ?? undefined,
      providerStatus: tx?.status?.toUpperCase(),
      ...(mapped.state === 'failed' && { failureReason: tx?.reason || `Eversend status ${tx?.status}` }),
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

export function mapTransactionStatus(status: string | undefined): Pick<ProviderOutcome, 'state'> {
  const s = (status ?? '').toLowerCase();
  if (SETTLED.has(s)) return { state: 'succeeded' };
  if (FAILED.has(s)) return { state: 'failed' };
  return { state: 'pending' };
}

function unwrap(body: unknown): Obj | undefined {
  const b = body as Obj | null;
  return ((b?.data ?? b) as Obj | null) ?? undefined;
}

/** The transaction in a payout or transaction response, wherever Eversend nests it. */
function transaction(body: unknown): { transactionId?: string; status?: string; reason?: string } | undefined {
  const d = unwrap(body);
  const t = ((d?.transaction ?? d) as Obj | undefined) ?? undefined;
  if (!t) return undefined;
  return {
    transactionId: str(t.transactionId) ?? str(t.id),
    status: str(t.status),
    reason: str(t.reason) ?? str(t.failureReason) ?? str(t.message),
  };
}

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

