import { createSign, createVerify, randomBytes } from 'crypto';
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

/**
 * Yo! Payments (Uganda), per "Yo! Payments API Specification v3.48".
 * One XML-over-HTTPS endpoint; credentials travel in every request body.
 */
export interface YoCredentials {
  apiUsername: string;
  apiPassword: string;
  environment: 'sandbox' | 'live';
  /** PEM private key, required when Yo has public-key authentication enabled for withdrawals. */
  privateKey?: string;
  /** PEM public key or certificate Yo uses to sign notifications. Required to accept notifications. */
  notificationPublicKey?: string;
}

const LIVE_URLS = ['https://paymentsapi1.yo.co.ug/ybs/task.php', 'https://paymentsapi2.yo.co.ug/ybs/task.php'];
const SANDBOX_URLS = ['https://sandbox.yo.co.ug/services/yopaymentsdev/task.php'];
const TIMEOUT_MS = 60_000;

/** Status code -22: "requires extra authorization ... DO NOT RE-SUBMIT". */
const AWAITING_AUTHORIZATION = -22;

/** Errors that happen before the request reaches Yo, so trying the other host is safe. */
const CONNECT_ERRORS = new Set(['ECONNREFUSED', 'ENOTFOUND', 'EAI_AGAIN', 'EHOSTUNREACH', 'ENETUNREACH']);

export interface YoResponse {
  Status?: string;
  StatusCode?: string;
  StatusMessage?: string;
  ErrorMessage?: string;
  TransactionStatus?: string;
  TransactionReference?: string;
  MNOTransactionReferenceId?: string;
  [key: string]: string | undefined;
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function unescapeXml(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

/** Flat fields of <Response>; nested sections are read separately where needed. */
export function parseYoResponse(xml: string): YoResponse {
  const body = /<Response>([\s\S]*)<\/Response>/.exec(xml)?.[1] ?? '';
  const fields: YoResponse = {};
  for (const match of body.matchAll(/<([A-Za-z]+)>([^<]*)<\/\1>/g)) {
    if (!(match[1] in fields)) fields[match[1]] = unescapeXml(match[2].trim());
  }
  return fields;
}

export function buildYoRequest(credentials: YoCredentials, method: string, params: Record<string, string | undefined>): string {
  const fields = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `<${k}>${escapeXml(String(v))}</${k}>`)
    .join('');
  return (
    '<?xml version="1.0" encoding="UTF-8"?><AutoCreate><Request>' +
    `<APIUsername>${escapeXml(credentials.apiUsername)}</APIUsername>` +
    `<APIPassword>${escapeXml(credentials.apiPassword)}</APIPassword>` +
    `<Method>${method}</Method>${fields}</Request></AutoCreate>`
  );
}

/** Yo signatures cover concatenated values, each cut to 255 characters. */
const cut = (v: string | undefined) => (v ?? '').slice(0, 255);

export class YoAdapter implements MoneyProvider {
  readonly name = 'yo';
  readonly capabilities: Capabilities = {
    collect: ['mobile_money'],
    payout: ['mobile_money', 'bank', 'yo_account'],
    balance: true,
    verifyPayee: true,
  };

  constructor(
    private readonly credentials: YoCredentials,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  // --- Collections (acdepositfunds, pull) ---

  async collect(request: CollectRequest): Promise<ProviderOutcome> {
    if (request.payer.type !== 'mobile_money') {
      return { state: 'failed', failureReason: 'Yo! Payments collects from mobile money numbers only' };
    }
    const response = await this.send(
      'acdepositfunds',
      {
        NonBlocking: 'TRUE',
        Amount: request.amount,
        Account: normaliseMsisdn(request.payer.msisdn),
        AccountProviderCode: request.payer.network,
        Narrative: request.description,
        ExternalReference: request.reference,
        InstantNotificationUrl: request.notificationUrl,
        FailureNotificationUrl: request.failureNotificationUrl,
      },
      true,
    );
    return this.toOutcome(response);
  }

  async getCollection(reference: string, providerTxnId?: string | null): Promise<ProviderOutcome> {
    return this.checkStatus(reference, providerTxnId);
  }

  // --- Payouts ---

  async payout(request: PayoutRequest): Promise<ProviderOutcome> {
    const { payee } = request;
    switch (payee.type) {
      case 'mobile_money':
        return this.withdrawToMobile(request, normaliseMsisdn(payee.msisdn), payee.network);
      case 'bank':
        return this.withdrawToBank(request, payee);
      case 'yo_account':
        return this.toOutcome(
          await this.send(
            'acinternaltransfer',
            {
              CurrencyCode: request.currency,
              Amount: request.amount,
              BeneficiaryAccount: payee.accountNumber,
              BeneficiaryEmail: payee.email,
              Narrative: request.description,
              ExternalReference: request.reference,
            },
            true,
          ),
        );
      default:
        return { state: 'failed', failureReason: `Yo! Payments cannot pay out to ${payee.type}` };
    }
  }

  async getPayout(reference: string, providerTxnId: string | null | undefined, rail: Rail): Promise<ProviderOutcome> {
    if (rail !== 'bank') return this.checkStatus(reference, providerTxnId);

    const response = await this.send('accheckbanksettlementstatus', {
      SettlementTransactionIdentifier: providerTxnId ?? undefined,
      PrivateTransactionReference: providerTxnId ? undefined : reference,
    });
    if (response.Status !== 'OK') return this.toOutcome(response);
    const status = response.TransactionStatus ?? '';
    return {
      // CAPTURED: Yo has taken the settlement for processing to the bank.
      state: status === 'CAPTURED' ? 'succeeded' : status === 'CANCELLED' ? 'failed' : 'pending',
      providerStatus: status,
      providerTxnId: response.SettlementTransactionIdentifier ?? providerTxnId ?? undefined,
      ...(status === 'CANCELLED' && { failureReason: 'Bank settlement cancelled' }),
    };
  }

  private async withdrawToMobile(request: PayoutRequest, account: string, network?: string): Promise<ProviderOutcome> {
    const nonce = this.credentials.privateKey ? newNonce() : undefined;
    const signature = nonce
      ? this.sign([this.credentials.apiUsername, request.amount, account, cut(request.description), cut(request.reference), cut(nonce)])
      : undefined;
    return this.toOutcome(
      await this.send(
        'acwithdrawfunds',
        {
          NonBlocking: 'TRUE',
          Amount: request.amount,
          Account: account,
          AccountProviderCode: network,
          Narrative: request.description,
          ExternalReference: request.reference,
          PublicKeyAuthenticationNonce: nonce,
          PublicKeyAuthenticationSignatureBase64: signature,
        },
        true,
      ),
    );
  }

  /** Only bank accounts already registered and verified in the Yo account can receive these. */
  private async withdrawToBank(
    request: PayoutRequest,
    payee: Extract<Party, { type: 'bank' }>,
  ): Promise<ProviderOutcome> {
    const nonce = this.credentials.privateKey ? newNonce() : undefined;
    const signature = nonce
      ? this.sign([
          this.credentials.apiUsername,
          request.amount,
          request.currency,
          cut(payee.accountName),
          payee.accountNumber,
          payee.bankCode ?? '',
          payee.transferType ?? '',
          cut(request.reference),
          cut(nonce),
        ])
      : undefined;
    const response = await this.send(
      'acwithdrawfundstobank',
      {
        Amount: request.amount,
        CurrencyCode: request.currency,
        BankAccountName: payee.accountName,
        BankAccountNumber: payee.accountNumber,
        BankAccountIdentifier: payee.bankCode,
        TransferTransactionType: payee.transferType,
        PrivateTransactionReference: request.reference,
        PublicKeyAuthenticationNonce: nonce,
        PublicKeyAuthenticationSignatureBase64: signature,
      },
      true,
    );
    if (response.Status === 'OK') {
      return {
        state: 'pending',
        providerStatus: 'SUBMITTED',
        providerTxnId: response.SettlementTransactionIdentifier ?? response.SettlementRequestIdentifier,
      };
    }
    return this.toOutcome(response);
  }

  // --- Queries ---

  async getBalance(): Promise<Record<string, string>> {
    const xml = await this.post(buildYoRequest(this.credentials, 'acacctbalance', {}), false);
    const balances: Record<string, string> = {};
    for (const match of xml.matchAll(/<Currency>\s*<Code>([^<]*)<\/Code>\s*<Balance>([^<]*)<\/Balance>\s*<\/Currency>/g)) {
      balances[match[1].trim()] = match[2].trim();
    }
    const response = parseYoResponse(xml);
    if (response.Status !== 'OK') throw new Error(response.StatusMessage || 'Yo balance request failed');
    return balances;
  }

  async verifyPayee(party: Party): Promise<{ valid: boolean; name?: string }> {
    if (party.type !== 'mobile_money') return { valid: false };
    const xml = await this.post(buildYoRequest(this.credentials, 'acgetmsisdnkycinfo', { Msisdn: normaliseMsisdn(party.msisdn) }), false);
    const response = parseYoResponse(xml);
    if (response.Status !== 'OK') return { valid: false };
    const name = [response.FirstName, response.MiddleName, response.Surname].filter(Boolean).join(' ');
    return { valid: true, name: name || undefined };
  }

  private async checkStatus(reference: string, providerTxnId?: string | null): Promise<ProviderOutcome> {
    const response = await this.send('actransactioncheckstatus', {
      TransactionReference: providerTxnId ?? undefined,
      PrivateTransactionReference: providerTxnId ? undefined : reference,
    });
    // -30: transaction not found. The request never registered at Yo.
    if (response.StatusCode === '-30') {
      return { state: 'failed', failureReason: 'Yo has no record of this transaction', providerStatus: 'NOT_FOUND' };
    }
    return this.toOutcome(response);
  }

  // --- Notifications ---

  /** Whether notifications can be signature-checked (Yo's public key is configured). */
  get canVerifyNotifications(): boolean {
    return Boolean(this.credentials.notificationPublicKey);
  }

  /**
   * Verify an Instant Payment Notification: RSA-SHA1 over date_time, amount,
   * narrative, network_ref, external_ref and msisdn, signed by Yo.
   */
  verifyPaymentNotification(body: Record<string, string>): boolean {
    const data = ['date_time', 'amount', 'narrative', 'network_ref', 'external_ref', 'msisdn'].map((k) => body[k] ?? '').join('');
    return this.verify(data, body.signature);
  }

  /** Verify a failure notification: RSA-SHA1 over failed_transaction_reference and transaction_init_date. */
  verifyFailureNotification(body: Record<string, string>): boolean {
    const data = (body.failed_transaction_reference ?? '') + (body.transaction_init_date ?? '');
    return this.verify(data, body.verification);
  }

  private verify(data: string, signature: string | undefined): boolean {
    if (!this.credentials.notificationPublicKey || !signature) return false;
    try {
      return createVerify('RSA-SHA1').update(data).verify(this.credentials.notificationPublicKey, signature, 'base64');
    } catch {
      return false;
    }
  }

  // --- Transport ---

  private sign(parts: string[]): string {
    return createSign('RSA-SHA1').update(parts.join('')).sign(this.credentials.privateKey!, 'base64');
  }

  private async send(method: string, params: Record<string, string | undefined>, moneyMoving = false): Promise<YoResponse> {
    return parseYoResponse(await this.post(buildYoRequest(this.credentials, method, params), moneyMoving));
  }

  /**
   * POST to Yo. For requests that move money, anything other than a clean
   * connection failure before sending means Yo may have acted, so it is
   * reported as ambiguous rather than retried.
   */
  private async post(xml: string, moneyMoving: boolean): Promise<string> {
    const urls = this.credentials.environment === 'live' ? LIVE_URLS : SANDBOX_URLS;
    let lastError: unknown;
    for (const url of urls) {
      try {
        const response = await this.fetchImpl(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/xml', 'Content-transfer-encoding': 'text' },
          body: xml,
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        const text = await response.text();
        if (!response.ok && !text.includes('<Response>')) {
          if (moneyMoving) throw new ProviderAmbiguousError(`Yo returned HTTP ${response.status}`);
          throw new Error(`Yo returned HTTP ${response.status}`);
        }
        return text;
      } catch (error) {
        if (error instanceof ProviderAmbiguousError) throw error;
        const code = (error as { cause?: { code?: string } }).cause?.code;
        if (code && CONNECT_ERRORS.has(code)) {
          lastError = new Error(`Could not reach Yo! Payments (${code} for ${new URL(url).host})`);
          continue; // never reached Yo: the other host is safe to try
        }
        if (moneyMoving) {
          throw new ProviderAmbiguousError(`No answer from Yo: ${error instanceof Error ? error.message : error}`);
        }
        throw error;
      }
    }
    throw lastError instanceof Error ? lastError : new Error('Yo is unreachable');
  }

  private toOutcome(response: YoResponse): ProviderOutcome {
    const code = Number(response.StatusCode ?? NaN);
    const txn = response.TransactionReference || undefined;
    const reason = response.ErrorMessage || response.StatusMessage;
    const status = response.TransactionStatus;

    if (status === 'INDETERMINATE') {
      return { state: 'pending', indeterminate: true, providerStatus: status, providerTxnId: txn, failureReason: reason };
    }
    if (response.Status === 'OK' && status === 'SUCCEEDED') {
      return { state: 'succeeded', providerStatus: status, providerTxnId: txn };
    }
    if (response.Status === 'OK' && (code === 1 || status === 'PENDING')) {
      return { state: 'pending', providerStatus: status ?? 'PENDING', providerTxnId: txn };
    }
    if (code === AWAITING_AUTHORIZATION) {
      return { state: 'pending', providerStatus: 'AWAITING_AUTHORIZATION', providerTxnId: txn, failureReason: reason };
    }
    // Below zero: the request was refused and nothing was created at Yo.
    if (code < 0 || status === 'FAILED') {
      return { state: 'failed', providerStatus: status ?? `ERROR_${code}`, providerTxnId: txn, failureReason: reason || 'Rejected by Yo' };
    }
    // Any other answer leaves the outcome open; treat as unknown.
    return { state: 'pending', indeterminate: true, providerStatus: status ?? `CODE_${response.StatusCode}`, providerTxnId: txn, failureReason: reason };
  }
}

/** Yo wants international format without "+": 256771234567. */
export function normaliseMsisdn(msisdn: string): string {
  const digits = msisdn.replace(/[^\d]/g, '');
  if (digits.startsWith('0') && digits.length === 10) return `256${digits.slice(1)}`;
  return digits;
}

/** Unique per API call, as Yo requires even for retries; allowed characters [A-Za-z0-9,-+]. */
function newNonce(): string {
  return `${Date.now()}-${randomBytes(12).toString('hex')}`;
}
