import { createHash } from 'crypto';
import {
  Capabilities,
  CollectRequest,
  MoneyProvider,
  Party,
  PayoutRequest,
  ProviderAmbiguousError,
  ProviderOutcome,
} from '../types';
import { MTN_MARKETS, toInternational } from '../msisdn';

/**
 * MTN Mobile Money Open API (momodeveloper.mtn.com): Collections
 * (request-to-pay) and Disbursements (transfer). Each product has its own
 * subscription key and API user, issued per country.
 */
export interface MtnMomoCredentials {
  environment: 'sandbox' | 'production';
  /** e.g. "mtnuganda"; "sandbox" in the sandbox. */
  targetEnvironment: string;
  /** Override the API host (production hosts differ by market). */
  baseUrl?: string;
  collectionSubscriptionKey: string;
  collectionApiUser: string;
  collectionApiKey: string;
  disbursementSubscriptionKey?: string;
  disbursementApiUser?: string;
  disbursementApiKey?: string;
}

type Product = 'collection' | 'disbursement';

const SANDBOX_URL = 'https://sandbox.momodeveloper.mtn.com';
const PRODUCTION_URL = 'https://proxy.momoapi.mtn.com';
const TIMEOUT_MS = 30_000;

/** Access tokens live an hour; cached across requests, refreshed a minute early. */
const tokens = new Map<string, { token: string; expiresAt: number }>();

/**
 * MTN requires X-Reference-Id to be a UUID v4 and treats it as the
 * idempotency key. Deriving it from our reference means a retry of the same
 * collection or payout reuses the same id, so MTN refuses a duplicate
 * instead of moving money twice.
 */
export function referenceToUuid(reference: string): string {
  const b = createHash('sha256').update(reference).digest();
  b[6] = (b[6] & 0x0f) | 0x40; // version 4
  b[8] = (b[8] & 0x3f) | 0x80; // RFC 4122 variant
  const h = b.subarray(0, 16).toString('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

export class MtnMomoAdapter implements MoneyProvider {
  readonly name = 'mtn_momo';
  readonly capabilities: Capabilities;

  constructor(
    private readonly credentials: MtnMomoCredentials,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {
    this.capabilities = {
      collect: ['mobile_money'],
      payout: this.hasDisbursements ? ['mobile_money'] : [],
      balance: true,
      verifyPayee: true,
    };
  }

  private get hasDisbursements(): boolean {
    const c = this.credentials;
    return Boolean(c.disbursementSubscriptionKey && c.disbursementApiUser && c.disbursementApiKey);
  }

  private get baseUrl(): string {
    return (this.credentials.baseUrl || (this.credentials.environment === 'production' ? PRODUCTION_URL : SANDBOX_URL)).replace(/\/$/, '');
  }

  // --- Collections ---

  async collect(request: CollectRequest): Promise<ProviderOutcome> {
    if (request.payer.type !== 'mobile_money') {
      return { state: 'failed', failureReason: 'MTN MoMo collects from mobile money numbers only' };
    }
    const id = referenceToUuid(request.reference);
    const response = await this.call('collection', 'POST', '/collection/v1_0/requesttopay', {
      moneyMoving: true,
      headers: {
        'X-Reference-Id': id,
        ...(request.notificationUrl && this.credentials.environment === 'production' && { 'X-Callback-Url': request.notificationUrl }),
      },
      body: {
        amount: request.amount,
        currency: request.currency,
        externalId: request.reference,
        payer: { partyIdType: 'MSISDN', partyId: this.msisdn(request.payer.msisdn) },
        payerMessage: request.description.slice(0, 160),
        payeeNote: request.description.slice(0, 160),
      },
    });
    return this.acceptance(response, id);
  }

  async getCollection(reference: string): Promise<ProviderOutcome> {
    const id = referenceToUuid(reference);
    return this.status(await this.call('collection', 'GET', `/collection/v1_0/requesttopay/${id}`), id);
  }

  // --- Disbursements ---

  async payout(request: PayoutRequest): Promise<ProviderOutcome> {
    if (request.payee.type !== 'mobile_money') {
      return { state: 'failed', failureReason: 'MTN MoMo pays out to mobile money numbers only' };
    }
    if (!this.hasDisbursements) {
      return { state: 'failed', failureReason: 'MTN MoMo disbursement credentials are not configured' };
    }
    const id = referenceToUuid(request.reference);
    const response = await this.call('disbursement', 'POST', '/disbursement/v1_0/transfer', {
      moneyMoving: true,
      headers: { 'X-Reference-Id': id },
      body: {
        amount: request.amount,
        currency: request.currency,
        externalId: request.reference,
        payee: { partyIdType: 'MSISDN', partyId: this.msisdn(request.payee.msisdn) },
        payerMessage: request.description.slice(0, 160),
        payeeNote: request.description.slice(0, 160),
      },
    });
    return this.acceptance(response, id);
  }

  async getPayout(reference: string): Promise<ProviderOutcome> {
    const id = referenceToUuid(reference);
    return this.status(await this.call('disbursement', 'GET', `/disbursement/v1_0/transfer/${id}`), id);
  }

  // --- Queries ---

  async getBalance(): Promise<Record<string, string>> {
    const out: Record<string, string> = {};
    for (const product of this.hasDisbursements ? (['collection', 'disbursement'] as const) : (['collection'] as const)) {
      const r = await this.call(product, 'GET', `/${product}/v1_0/account/balance`);
      if (r.status !== 200) throw new Error(`MTN ${product} balance failed (HTTP ${r.status})`);
      const body = r.body as { availableBalance?: string; currency?: string };
      out[`${body.currency ?? '?'}-${product}`] = String(body.availableBalance ?? '0');
    }
    return out;
  }

  async verifyPayee(party: Party): Promise<{ valid: boolean; name?: string }> {
    if (party.type !== 'mobile_money') return { valid: false };
    const number = this.msisdn(party.msisdn);
    const r = await this.call('collection', 'GET', `/collection/v1_0/accountholder/msisdn/${number}/basicuserinfo`);
    if (r.status !== 200) {
      const active = await this.call('collection', 'GET', `/collection/v1_0/accountholder/msisdn/${number}/active`);
      return { valid: active.status === 200 && (active.body as { result?: boolean })?.result === true };
    }
    const info = r.body as { name?: string; given_name?: string; family_name?: string };
    const name = info.name || [info.given_name, info.family_name].filter(Boolean).join(' ');
    return { valid: true, name: name || undefined };
  }

  /** International format without "+", using the market's code for local numbers. */
  private msisdn(value: string): string {
    return toInternational(value, MTN_MARKETS[this.credentials.targetEnvironment] ?? 'UG');
  }

  // --- Mapping ---

  /** 202 means accepted for processing; 409 means this reference was already submitted. */
  private acceptance(response: { status: number; body: unknown }, id: string): ProviderOutcome {
    if (response.status === 202) return { state: 'pending', providerTxnId: id, providerStatus: 'ACCEPTED' };
    if (response.status === 409) {
      return { state: 'pending', providerTxnId: id, providerStatus: 'ALREADY_SUBMITTED' };
    }
    const reason = errorText(response.body) || `HTTP ${response.status}`;
    // 4xx: MTN refused the request and created nothing; 5xx: unknown.
    if (response.status >= 500) {
      return { state: 'pending', indeterminate: true, providerTxnId: id, failureReason: reason };
    }
    return { state: 'failed', providerStatus: `HTTP_${response.status}`, failureReason: reason };
  }

  private status(response: { status: number; body: unknown }, id: string): ProviderOutcome {
    if (response.status === 404) {
      return { state: 'failed', providerStatus: 'NOT_FOUND', failureReason: 'MTN has no record of this transaction' };
    }
    if (response.status !== 200) {
      return { state: 'pending', providerStatus: `HTTP_${response.status}`, providerTxnId: id };
    }
    const body = response.body as { status?: string; financialTransactionId?: string; reason?: unknown };
    const status = String(body.status ?? '').toUpperCase();
    return {
      state: status === 'SUCCESSFUL' ? 'succeeded' : status === 'FAILED' || status === 'REJECTED' || status === 'TIMEOUT' ? 'failed' : 'pending',
      providerStatus: status || 'UNKNOWN',
      providerTxnId: body.financialTransactionId || id,
      ...(status !== 'SUCCESSFUL' && status !== 'PENDING' && body.reason !== undefined && { failureReason: errorText(body.reason) }),
    };
  }

  // --- Transport ---

  private async call(
    product: Product,
    method: 'GET' | 'POST',
    path: string,
    options: { headers?: Record<string, string>; body?: unknown; moneyMoving?: boolean } = {},
  ): Promise<{ status: number; body: unknown }> {
    const token = await this.token(product);
    let response: Response;
    try {
      response = await this.fetchImpl(`${this.baseUrl}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Target-Environment': this.credentials.targetEnvironment,
          'Ocp-Apim-Subscription-Key': this.key(product).subscriptionKey,
          ...(options.body !== undefined && { 'Content-Type': 'application/json' }),
          ...options.headers,
        },
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      if (options.moneyMoving) throw new ProviderAmbiguousError(`No answer from MTN: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
    const text = await response.text();
    let body: unknown = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = text;
    }
    return { status: response.status, body };
  }

  private key(product: Product) {
    const c = this.credentials;
    return product === 'collection'
      ? { subscriptionKey: c.collectionSubscriptionKey, user: c.collectionApiUser, apiKey: c.collectionApiKey }
      : { subscriptionKey: c.disbursementSubscriptionKey!, user: c.disbursementApiUser!, apiKey: c.disbursementApiKey! };
  }

  private async token(product: Product): Promise<string> {
    const { subscriptionKey, user, apiKey } = this.key(product);
    const cacheKey = `${this.baseUrl}|${product}|${user}`;
    const cached = tokens.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.token;

    let response: Response;
    try {
      response = await this.fetchImpl(`${this.baseUrl}/${product}/token/`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${user}:${apiKey}`).toString('base64')}`,
          'Ocp-Apim-Subscription-Key': subscriptionKey,
        },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      throw new Error(`Could not reach MTN MoMo: ${error instanceof Error ? error.message : error}`);
    }
    const body = (await response.json().catch(() => ({}))) as { access_token?: string; expires_in?: number };
    if (!response.ok || !body.access_token) {
      throw new Error(`MTN ${product} authentication failed (HTTP ${response.status})`);
    }
    tokens.set(cacheKey, { token: body.access_token, expiresAt: Date.now() + ((body.expires_in ?? 3600) - 60) * 1000 });
    return body.access_token;
  }
}


function errorText(body: unknown): string {
  if (!body) return '';
  if (typeof body === 'string') return body.slice(0, 300);
  const b = body as { message?: string; code?: string };
  return [b.code, b.message].filter(Boolean).join(': ') || JSON.stringify(body).slice(0, 300);
}

/** Exposed for tests: forget cached tokens. */
export function clearMtnTokenCache(): void {
  tokens.clear();
}
