import { createHmac, createVerify, randomBytes } from 'crypto';
import { Capabilities, CollectRequest, MoneyProvider, ProviderOutcome } from '../types';
import { toScaled } from '../../ledger/ledger.money';

/**
 * Binance Pay merchant checkout: the payer pays from their Binance account
 * (app, QR code or link), with no network fee and instant settlement into the
 * merchant's own Binance Pay balance. The merchant holds its own Binance
 * merchant account; we never hold funds.
 *
 * Orders are in a crypto currency Binance Pay accepts (USDT by default).
 * Requests are signed with HMAC-SHA512; notifications carry an RSA
 * signature checked against Binance's published certificate.
 */
export interface BinancePayCredentials {
  /** Merchant API key (the "Certificate SN" header). */
  apiKey: string;
  apiSecret: string;
  /** Override the API host. */
  baseUrl?: string;
}

export const BINANCE_PAY_COINS = ['USDT', 'USDC', 'FDUSD', 'BTC', 'ETH', 'BNB'];

const BASE_URL = 'https://bpay.binanceapi.com';
const TIMEOUT_MS = 20_000;
const CERT_TTL_MS = 6 * 60 * 60 * 1000;

const certificates = new Map<string, { pem: string; at: number }>();

/** Binance merchantTradeNo allows letters and digits only, so our "col_…" reference loses its underscore. */
export function toTradeNo(reference: string): string {
  return reference.replace(/[^A-Za-z0-9]/g, '').slice(0, 32);
}

export function fromTradeNo(tradeNo: string): string {
  return /^(col|pay)[0-9a-f]+$/.test(tradeNo) ? `${tradeNo.slice(0, 3)}_${tradeNo.slice(3)}` : tradeNo;
}

/** Order status → our state. PAID settles; CANCELED, EXPIRED and ERROR fail; refunds after payment are for a person. */
export function mapBinanceStatus(status: string | undefined): Pick<ProviderOutcome, 'state' | 'indeterminate'> {
  switch ((status ?? '').toUpperCase()) {
    case 'PAID':
    case 'PAY_SUCCESS':
      return { state: 'succeeded' };
    case 'CANCELED':
    case 'EXPIRED':
    case 'ERROR':
    case 'PAY_CLOSED':
      return { state: 'failed' };
    case 'REFUNDING':
    case 'REFUNDED':
      return { state: 'pending', indeterminate: true };
    default:
      return { state: 'pending' };
  }
}

export interface BinancePayNotification {
  bizType?: string;
  bizIdStr?: string;
  bizId?: number;
  bizStatus?: string;
  /** JSON text with merchantTradeNo, totalFee, currency, transactionId… */
  data?: string;
}

export class BinancePayAdapter implements MoneyProvider {
  readonly name = 'binance_pay';
  readonly capabilities: Capabilities = { collect: ['crypto'], payout: [], balance: false, verifyPayee: false };

  constructor(
    private readonly credentials: BinancePayCredentials,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  private get baseUrl() {
    return (this.credentials.baseUrl || BASE_URL).replace(/\/$/, '');
  }

  async collect(request: CollectRequest): Promise<ProviderOutcome> {
    if (request.payer.type !== 'crypto') return { state: 'failed', failureReason: 'Binance Pay collects crypto only' };
    const coin = request.currency.toUpperCase();
    if (!BINANCE_PAY_COINS.includes(coin)) {
      return { state: 'failed', failureReason: `Binance Pay orders are in ${BINANCE_PAY_COINS.join(', ')}, not ${coin}` };
    }
    // Creating an order moves no money, so any error here is a clean failure.
    const r = await this.call('/binancepay/openapi/v2/order', {
      env: { terminalType: 'WEB' },
      merchantTradeNo: toTradeNo(request.reference),
      orderAmount: Number(request.amount),
      currency: coin,
      description: request.description.slice(0, 256),
      goodsDetails: [
        { goodsType: '02', goodsCategory: 'Z000', referenceGoodsId: toTradeNo(request.reference), goodsName: request.description.slice(0, 256) },
      ],
      ...(request.callbackUrl && { returnUrl: request.callbackUrl, cancelUrl: request.callbackUrl }),
      ...(request.notificationUrl && { webhookUrl: request.notificationUrl }),
    }).catch((error: Error) => ({ status: 0, body: { errorMessage: error.message } as Record<string, unknown> }));
    const data = r.body.data as { prepayId?: string; checkoutUrl?: string; universalUrl?: string } | undefined;
    if (r.body.status !== 'SUCCESS' || !data?.checkoutUrl) {
      return { state: 'failed', failureReason: String(r.body.errorMessage ?? `Binance Pay could not create the order (HTTP ${r.status})`) };
    }
    return { state: 'pending', providerTxnId: data.prepayId, providerStatus: 'INITIAL', paymentUrl: data.checkoutUrl };
  }

  /** The order as Binance has it; a paid order must match the amount and coin asked for. */
  async getCollection(reference: string, _txn?: string | null, expected?: string): Promise<ProviderOutcome> {
    const r = await this.call('/binancepay/openapi/v2/order/query', { merchantTradeNo: toTradeNo(reference) });
    if (r.body.status !== 'SUCCESS') return { state: 'pending', providerStatus: String(r.body.code ?? `HTTP_${r.status}`) };
    const order = r.body.data as { status?: string; orderAmount?: string | number; currency?: string; transactionId?: string; prepayId?: string };
    const mapped = mapBinanceStatus(order.status);
    const outcome: ProviderOutcome = {
      ...mapped,
      providerStatus: order.status,
      providerTxnId: order.transactionId || order.prepayId,
      ...(mapped.state === 'failed' && { failureReason: `Binance Pay order ${String(order.status).toLowerCase()}` }),
      ...(mapped.indeterminate && { failureReason: `Binance Pay order ${String(order.status).toLowerCase()} after payment` }),
    };
    if (mapped.state === 'succeeded' && expected && order.orderAmount !== undefined && toScaled(String(order.orderAmount)) !== toScaled(expected)) {
      return { ...outcome, state: 'pending', indeterminate: true, failureReason: `Held for review: Binance order is for ${order.orderAmount} ${order.currency}` };
    }
    return outcome;
  }

  /**
   * RSA-SHA256 over "timestamp\nnonce\nbody\n" with Binance's public key for
   * the certificate serial in the request; the key is fetched once and cached.
   */
  async verifyNotification(rawBody: string, headers: Record<string, string | undefined>): Promise<boolean> {
    const timestamp = headers['binancepay-timestamp'];
    const nonce = headers['binancepay-nonce'];
    const signature = headers['binancepay-signature'];
    const serial = headers['binancepay-certificate-sn'];
    if (!timestamp || !nonce || !signature || !serial) return false;
    // Stale notifications are replays.
    if (Math.abs(Date.now() - Number(timestamp)) > 10 * 60 * 1000) return false;
    const pem = await this.certificate(serial);
    if (!pem) return false;
    try {
      return createVerify('RSA-SHA256').update(`${timestamp}\n${nonce}\n${rawBody}\n`).verify(pem, Buffer.from(signature, 'base64'));
    } catch {
      return false;
    }
  }

  private async certificate(serial: string): Promise<string | null> {
    const cached = certificates.get(serial);
    if (cached && cached.at > Date.now() - CERT_TTL_MS) return cached.pem;
    const r = await this.call('/binancepay/openapi/certificates', {}).catch(() => null);
    const certs = (r?.body.data ?? []) as { certSerial?: string; certPublic?: string }[];
    for (const c of certs) if (c.certSerial && c.certPublic) certificates.set(c.certSerial, { pem: c.certPublic, at: Date.now() });
    return certificates.get(serial)?.pem ?? null;
  }

  // --- Transport ---

  private async call(path: string, payload: unknown): Promise<{ status: number; body: Record<string, unknown> }> {
    const body = JSON.stringify(payload);
    const timestamp = String(Date.now());
    const nonce = randomBytes(16).toString('hex'); // 32 characters
    const signature = createHmac('sha512', this.credentials.apiSecret).update(`${timestamp}\n${nonce}\n${body}\n`).digest('hex').toUpperCase();
    let response: Response;
    try {
      response = await this.fetchImpl(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'BinancePay-Timestamp': timestamp,
          'BinancePay-Nonce': nonce,
          'BinancePay-Certificate-SN': this.credentials.apiKey,
          'BinancePay-Signature': signature,
        },
        body,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      throw new Error(`Could not reach Binance Pay: ${error instanceof Error ? error.message : error}`);
    }
    return { status: response.status, body: ((await response.json().catch(() => ({}))) ?? {}) as Record<string, unknown> };
  }
}

/** Exposed for tests. */
export function clearBinanceCertificates(): void {
  certificates.clear();
}
