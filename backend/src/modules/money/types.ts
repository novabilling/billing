/**
 * Shared shapes for one-time collections, payouts and transfers.
 */

export type Rail = 'card' | 'bank' | 'mobile_money' | 'paypal' | 'yo_account' | 'hosted' | 'crypto' | 'wallet';

/** Who pays (collections) or who is paid (payouts). */
export type Party =
  | { type: 'mobile_money'; msisdn: string; network?: string; name?: string }
  | {
      type: 'bank';
      accountNumber: string;
      accountName: string;
      bankCode?: string;
      bankName?: string;
      country?: string;
      transferType?: 'RTGS' | 'EFT' | 'TT';
      /** Account holder's phone, international format; some providers (Eversend) require it. */
      phone?: string;
    }
  | { type: 'paypal'; email: string; name?: string }
  | { type: 'yo_account'; accountNumber: string; email: string; name?: string }
  // Hosted checkout: the payer chooses card, bank or mobile money on the provider's page.
  | { type: 'hosted'; email: string; name?: string }
  // Crypto. NOWPayments: hosted checkout priced in fiat, paid in the coin the
  // payer picks (or `payCurrency`, e.g. "usdttrc20"). Eversend: a deposit
  // address for a USDT/USDC collection on `chain` (e.g. "TRON").
  | { type: 'crypto'; email?: string; name?: string; payCurrency?: string; chain?: string };

/** How the payer pays when it is not a redirect (e.g. a crypto deposit address). */
export interface PaymentDetails {
  kind: 'crypto_address';
  coin: string;
  chain: string;
  address: string;
  amount: string;
  memo?: string;
}

export type ProviderState = 'pending' | 'succeeded' | 'failed';

export interface ProviderOutcome {
  state: ProviderState;
  /** The provider's id for the transaction, when it gives one. */
  providerTxnId?: string;
  /** Redirect the payer here to finish a hosted payment. */
  paymentUrl?: string;
  /** Or show the payer these instructions. */
  paymentDetails?: PaymentDetails;
  /** Provider-specific status text, kept for support. */
  providerStatus?: string;
  failureReason?: string;
  /** Fee the provider charged, in major units, when reported. */
  fee?: number;
  /**
   * The provider could not say whether the money moved (e.g. Yo's
   * INDETERMINATE). Treated as stuck: never resubmitted, only re-checked.
   */
  indeterminate?: boolean;
}

export interface CollectRequest {
  /** Our reference, sent to the provider and used to look the transaction up later. */
  reference: string;
  amount: string;
  currency: string;
  payer: Party;
  description: string;
  callbackUrl?: string;
  notificationUrl?: string;
  failureNotificationUrl?: string;
}

export interface PayoutRequest {
  reference: string;
  amount: string;
  currency: string;
  payee: Party;
  description: string;
}

/**
 * The provider may or may not have acted (timeout, connection reset,
 * "indeterminate"). The operation must not be repeated until a status check
 * settles it.
 */
export class ProviderAmbiguousError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProviderAmbiguousError';
  }
}

export interface Capabilities {
  collect: Rail[];
  payout: Rail[];
  balance: boolean;
  verifyPayee: boolean;
}

export interface MoneyProvider {
  readonly name: string;
  readonly capabilities: Capabilities;
  collect?(request: CollectRequest): Promise<ProviderOutcome>;
  /** `expected` is what the payer was asked for, for providers that only report deposits. */
  getCollection?(reference: string, providerTxnId?: string | null, expected?: string): Promise<ProviderOutcome>;
  payout?(request: PayoutRequest): Promise<ProviderOutcome>;
  getPayout?(reference: string, providerTxnId: string | null | undefined, rail: Rail): Promise<ProviderOutcome>;
  /** Available balance per currency, in major units as decimal strings. */
  getBalance?(): Promise<Record<string, string>>;
  /** Name registered to a payee account, where the provider can look it up. */
  verifyPayee?(party: Party): Promise<{ valid: boolean; name?: string }>;
}

export function partyRail(party: Party): Rail {
  return party.type;
}

/** Major-unit amount as a plain string with the currency's usual decimals. */
export function majorAmount(amount: { toFixed(dp: number): string } | number | string, decimals: number): string {
  const value = typeof amount === 'object' ? amount.toFixed(4) : String(amount);
  const [whole, frac = ''] = value.split('.');
  if (decimals === 0) return whole;
  return `${whole}.${(frac + '0'.repeat(decimals)).slice(0, decimals)}`;
}
