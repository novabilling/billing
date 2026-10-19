import { createHmac, timingSafeEqual } from 'crypto';
import { Capabilities, CollectRequest, MoneyProvider, ProviderOutcome } from '../types';

/**
 * Crypto collections through NOWPayments hosted invoices. The tenant holds
 * its own NOWPayments account; the payer pays on NOWPayments' page in the
 * coin they choose, and NOWPayments settles to the tenant's own wallet (or
 * converts, per the tenant's settings there). We never hold crypto: the
 * movement is priced and recorded in the fiat currency of the collection.
 */
export interface NowPaymentsCredentials {
  apiKey: string;
  /** IPN secret from the NOWPayments dashboard; notifications are rejected without it. */
  ipnSecret: string;
  environment?: 'sandbox' | 'production';
}

const PRODUCTION_URL = 'https://api.nowpayments.io/v1';
const SANDBOX_URL = 'https://api-sandbox.nowpayments.io/v1';
const TIMEOUT_MS = 30_000;

export interface NowPaymentsNotification {
  payment_id?: number | string;
  invoice_id?: number | string;
  payment_status?: string;
  order_id?: string;
  price_amount?: number;
  price_currency?: string;
  pay_amount?: number;
  actually_paid?: number;
  pay_currency?: string;
  outcome_amount?: number;
  outcome_currency?: string;
}

/**
 * finished: paid and settled. confirmed/sending: paid, settlement under way.
 * partially_paid: underpaid, held for review. failed/expired/refunded: no money kept.
 */
export function mapNowPaymentsStatus(status: string | undefined): Pick<ProviderOutcome, 'state' | 'indeterminate'> {
  switch (status) {
    case 'finished':
      return { state: 'succeeded' };
    case 'failed':
    case 'expired':
    case 'refunded':
      return { state: 'failed' };
    case 'partially_paid':
      return { state: 'pending', indeterminate: true };
    default:
      return { state: 'pending' };
  }
}

/** NOWPayments signs the notification body with keys sorted at every level. */
function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value as Record<string, unknown>)
        .sort()
        .map((k) => [k, sortKeys((value as Record<string, unknown>)[k])]),
    );
  }
  return value;
}

export class NowPaymentsAdapter implements MoneyProvider {
  readonly name = 'nowpayments';
  readonly capabilities: Capabilities = { collect: ['crypto'], payout: [], balance: false, verifyPayee: false };

  constructor(
    private readonly credentials: NowPaymentsCredentials,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  private get baseUrl() {
    return this.credentials.environment === 'sandbox' ? SANDBOX_URL : PRODUCTION_URL;
  }

  async collect(request: CollectRequest): Promise<ProviderOutcome> {
    if (request.payer.type !== 'crypto') {
      return { state: 'failed', failureReason: 'NOWPayments collects crypto through its hosted invoice page' };
    }
    let response: Response;
    try {
      response = await this.fetchImpl(`${this.baseUrl}/invoice`, {
        method: 'POST',
        headers: { 'x-api-key': this.credentials.apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price_amount: Number(request.amount),
          price_currency: request.currency.toLowerCase(),
          ...(request.payer.payCurrency && { pay_currency: request.payer.payCurrency }),
          order_id: request.reference,
          order_description: request.description.slice(0, 200),
          ipn_callback_url: request.notificationUrl,
          ...(request.callbackUrl && { success_url: request.callbackUrl, cancel_url: request.callbackUrl }),
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      return { state: 'failed', failureReason: `Could not reach NOWPayments: ${error instanceof Error ? error.message : error}` };
    }
    const body = (await response.json().catch(() => ({}))) as { id?: string | number; invoice_url?: string; message?: string };
    // Creating an invoice moves no money, so any error here is a clean failure.
    if (!response.ok || !body.invoice_url) {
      return { state: 'failed', failureReason: body.message || `NOWPayments could not create the invoice (HTTP ${response.status})` };
    }
    return {
      state: 'pending',
      paymentUrl: body.invoice_url,
      providerStatus: 'INVOICE_CREATED',
      // The payment id only exists once the payer starts paying; it arrives by IPN.
      providerTxnId: undefined,
    };
  }

  async getCollection(_reference: string, providerTxnId?: string | null): Promise<ProviderOutcome> {
    if (!providerTxnId) return { state: 'pending', providerStatus: 'AWAITING_PAYER' };
    const response = await this.fetchImpl(`${this.baseUrl}/payment/${encodeURIComponent(providerTxnId)}`, {
      headers: { 'x-api-key': this.credentials.apiKey },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return { state: 'pending', providerStatus: `HTTP_${response.status}`, providerTxnId };
    return this.fromPayment((await response.json()) as NowPaymentsNotification);
  }

  /** Outcome from a payment record or a verified notification. */
  fromPayment(payment: NowPaymentsNotification): ProviderOutcome {
    const mapped = mapNowPaymentsStatus(payment.payment_status);
    return {
      ...mapped,
      providerStatus: payment.payment_status?.toUpperCase(),
      providerTxnId: payment.payment_id !== undefined ? String(payment.payment_id) : undefined,
      ...(mapped.indeterminate && {
        failureReason: `Underpaid: received ${payment.actually_paid} of ${payment.pay_amount} ${payment.pay_currency?.toUpperCase()}`,
      }),
      ...(mapped.state === 'failed' && { failureReason: `Crypto payment ${payment.payment_status}` }),
    };
  }

  /** HMAC-SHA512 of the key-sorted JSON body with the IPN secret, sent as x-nowpayments-sig. */
  verifyNotification(body: Record<string, unknown>, signature: string | undefined): boolean {
    if (!this.credentials.ipnSecret || !signature) return false;
    const expected = createHmac('sha512', this.credentials.ipnSecret).update(JSON.stringify(sortKeys(body))).digest('hex');
    const a = Buffer.from(expected);
    const b = Buffer.from(signature.toLowerCase());
    return a.length === b.length && timingSafeEqual(a, b);
  }
}
