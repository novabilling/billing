import { constants, publicEncrypt } from 'crypto';
import {
  Capabilities,
  CollectRequest,
  MoneyProvider,
  Party,
  PayoutRequest,
  ProviderAmbiguousError,
  ProviderOutcome,
} from '../types';
import { toNational } from '../msisdn';

/**
 * Airtel Money Africa Open API (developers.airtel.africa): USSD-push
 * collections and disbursements. API versions differ by market, so the
 * paths can be overridden per account; the defaults are the v1 paths.
 */
export interface AirtelMoneyCredentials {
  environment: 'staging' | 'production';
  clientId: string;
  clientSecret: string;
  /** ISO country of the Airtel account, e.g. "UG". */
  country: string;
  /** Account currency, e.g. "UGX". */
  currency: string;
  /** Disbursement PIN, encrypted with Airtel's public key before sending. */
  disbursementPin?: string;
  /** PEM public key from Airtel for PIN encryption. */
  encryptionPublicKey?: string;
  baseUrl?: string;
  paths?: Partial<Record<'collect' | 'collectStatus' | 'disburse' | 'disburseStatus' | 'user' | 'balance', string>>;
}

const STAGING_URL = 'https://openapiuat.airtel.africa';
const PRODUCTION_URL = 'https://openapi.airtel.africa';
const TIMEOUT_MS = 30_000;

const DEFAULT_PATHS = {
  collect: '/merchant/v1/payments/',
  collectStatus: '/standard/v1/payments/',
  disburse: '/standard/v1/disbursements/',
  disburseStatus: '/standard/v1/disbursements/',
  user: '/standard/v1/users/',
  balance: '/standard/v1/users/balance',
};

const tokens = new Map<string, { token: string; expiresAt: number }>();

/**
 * Airtel transaction status codes: TS success, TF failed, TE expired,
 * TIP in progress, TA ambiguous (outcome unknown; resolve by re-checking).
 */
function mapStatus(code: string | undefined): Pick<ProviderOutcome, 'state' | 'indeterminate'> {
  switch ((code ?? '').toUpperCase()) {
    case 'TS':
      return { state: 'succeeded' };
    case 'TF':
    case 'TE':
      return { state: 'failed' };
    case 'TA':
      return { state: 'pending', indeterminate: true };
    default:
      return { state: 'pending' };
  }
}

export class AirtelMoneyAdapter implements MoneyProvider {
  readonly name = 'airtel_money';
  readonly capabilities: Capabilities;

  constructor(
    private readonly credentials: AirtelMoneyCredentials,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {
    this.capabilities = {
      collect: ['mobile_money'],
      payout: credentials.disbursementPin && credentials.encryptionPublicKey ? ['mobile_money'] : [],
      balance: true,
      verifyPayee: true,
    };
  }

  private get baseUrl() {
    return (this.credentials.baseUrl || (this.credentials.environment === 'production' ? PRODUCTION_URL : STAGING_URL)).replace(/\/$/, '');
  }

  private path(name: keyof typeof DEFAULT_PATHS) {
    return this.credentials.paths?.[name] ?? DEFAULT_PATHS[name];
  }

  private msisdn(value: string) {
    return toNational(value, this.credentials.country);
  }

  // --- Collections ---

  async collect(request: CollectRequest): Promise<ProviderOutcome> {
    if (request.payer.type !== 'mobile_money') {
      return { state: 'failed', failureReason: 'Airtel Money collects from mobile money numbers only' };
    }
    const { country, currency } = this.market(request.currency);
    const response = await this.call('POST', this.path('collect'), {
      moneyMoving: true,
      currency,
      body: {
        reference: request.description.slice(0, 64),
        subscriber: { country, currency, msisdn: this.msisdn(request.payer.msisdn) },
        transaction: { amount: Number(request.amount), country, currency, id: request.reference },
      },
    });
    return this.acceptance(response);
  }

  async getCollection(reference: string): Promise<ProviderOutcome> {
    return this.status(await this.call('GET', `${this.path('collectStatus')}${encodeURIComponent(reference)}`));
  }

  // --- Disbursements ---

  async payout(request: PayoutRequest): Promise<ProviderOutcome> {
    if (request.payee.type !== 'mobile_money') {
      return { state: 'failed', failureReason: 'Airtel Money pays out to mobile money numbers only' };
    }
    if (!this.credentials.disbursementPin || !this.credentials.encryptionPublicKey) {
      return { state: 'failed', failureReason: 'Airtel disbursement PIN and encryption key are not configured' };
    }
    const { currency } = this.market(request.currency);
    const response = await this.call('POST', this.path('disburse'), {
      moneyMoving: true,
      currency,
      body: {
        payee: { msisdn: this.msisdn(request.payee.msisdn) },
        reference: request.description.slice(0, 64),
        pin: this.encryptPin(),
        transaction: { amount: Number(request.amount), id: request.reference },
      },
    });
    return this.acceptance(response);
  }

  async getPayout(reference: string): Promise<ProviderOutcome> {
    return this.status(await this.call('GET', `${this.path('disburseStatus')}${encodeURIComponent(reference)}`));
  }

  // --- Queries ---

  async getBalance(): Promise<Record<string, string>> {
    const r = await this.call('GET', this.path('balance'));
    const data = (r.body as { data?: { balance?: string | number; currency?: string } })?.data;
    if (r.status !== 200 || !data) throw new Error(`Airtel balance failed (HTTP ${r.status})`);
    return { [data.currency ?? this.credentials.currency]: String(data.balance ?? '0') };
  }

  async verifyPayee(party: Party): Promise<{ valid: boolean; name?: string }> {
    if (party.type !== 'mobile_money') return { valid: false };
    const r = await this.call('GET', `${this.path('user')}${this.msisdn(party.msisdn)}`);
    const data = (r.body as { data?: { first_name?: string; last_name?: string; is_barred?: boolean } })?.data;
    if (r.status !== 200 || !data) return { valid: false };
    const name = [data.first_name, data.last_name].filter(Boolean).join(' ');
    return { valid: !data.is_barred, name: name || undefined };
  }

  // --- Mapping ---

  private acceptance(response: { status: number; body: unknown }): ProviderOutcome {
    const body = response.body as {
      data?: { transaction?: { id?: string; status?: string; airtel_money_id?: string } };
      status?: { success?: boolean; message?: string; response_code?: string; code?: string };
    } | null;
    if (response.status >= 500 || !body) {
      return { state: 'pending', indeterminate: true, failureReason: `Airtel HTTP ${response.status}` };
    }
    const tx = body.data?.transaction;
    if (response.status < 300 && body.status?.success !== false) {
      // Accepted: the subscriber is prompted (collections) or the transfer is queued.
      return { ...mapStatus(tx?.status), providerTxnId: tx?.airtel_money_id ?? tx?.id, providerStatus: tx?.status ?? body.status?.response_code };
    }
    return {
      state: 'failed',
      providerStatus: body.status?.response_code ?? body.status?.code ?? `HTTP_${response.status}`,
      failureReason: body.status?.message || 'Airtel refused the request',
    };
  }

  private status(response: { status: number; body: unknown }): ProviderOutcome {
    const tx = (response.body as { data?: { transaction?: { status?: string; airtel_money_id?: string; message?: string } } })?.data
      ?.transaction;
    if (response.status === 404) {
      return { state: 'failed', providerStatus: 'NOT_FOUND', failureReason: 'Airtel has no record of this transaction' };
    }
    if (response.status !== 200 || !tx) return { state: 'pending', providerStatus: `HTTP_${response.status}` };
    const mapped = mapStatus(tx.status);
    return {
      ...mapped,
      providerStatus: tx.status,
      providerTxnId: tx.airtel_money_id,
      ...(mapped.state === 'failed' && { failureReason: tx.message || `Airtel status ${tx.status}` }),
    };
  }

  // --- Transport ---

  private market(requested: string) {
    if (requested.toUpperCase() !== this.credentials.currency.toUpperCase()) {
      throw new Error(`This Airtel account works in ${this.credentials.currency}, not ${requested}`);
    }
    return { country: this.credentials.country.toUpperCase(), currency: this.credentials.currency.toUpperCase() };
  }

  /** RSA (PKCS#1 v1.5) with Airtel's public key, base64, as the disbursement API expects. */
  private encryptPin(): string {
    return publicEncrypt(
      { key: this.credentials.encryptionPublicKey!, padding: constants.RSA_PKCS1_PADDING },
      Buffer.from(this.credentials.disbursementPin!),
    ).toString('base64');
  }

  private async call(
    method: 'GET' | 'POST',
    path: string,
    options: { body?: unknown; moneyMoving?: boolean; currency?: string } = {},
  ): Promise<{ status: number; body: unknown }> {
    const token = await this.token();
    let response: Response;
    try {
      response = await this.fetchImpl(`${this.baseUrl}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: '*/*',
          'Content-Type': 'application/json',
          'X-Country': this.credentials.country.toUpperCase(),
          'X-Currency': (options.currency ?? this.credentials.currency).toUpperCase(),
        },
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      if (options.moneyMoving) throw new ProviderAmbiguousError(`No answer from Airtel: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
    const text = await response.text();
    let body: unknown = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = null;
    }
    return { status: response.status, body };
  }

  private async token(): Promise<string> {
    const cacheKey = `${this.baseUrl}|${this.credentials.clientId}`;
    const cached = tokens.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.token;

    let response: Response;
    try {
      response = await this.fetchImpl(`${this.baseUrl}/auth/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: '*/*' },
        body: JSON.stringify({
          client_id: this.credentials.clientId,
          client_secret: this.credentials.clientSecret,
          grant_type: 'client_credentials',
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      throw new Error(`Could not reach Airtel Money: ${error instanceof Error ? error.message : error}`);
    }
    const body = (await response.json().catch(() => ({}))) as { access_token?: string; expires_in?: number | string };
    if (!response.ok || !body.access_token) throw new Error(`Airtel authentication failed (HTTP ${response.status})`);
    tokens.set(cacheKey, { token: body.access_token, expiresAt: Date.now() + (Number(body.expires_in ?? 180) - 30) * 1000 });
    return body.access_token;
  }
}

/** Exposed for tests: forget cached tokens. */
export function clearAirtelTokenCache(): void {
  tokens.clear();
}
