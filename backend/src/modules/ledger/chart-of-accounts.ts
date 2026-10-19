import { LedgerAccountType } from '../../generated/prisma-tenant/client';

/**
 * A ledger account reference. Accounts are created on first use, keyed by
 * (code, currency), so the chart of accounts below is the only place codes
 * are spelled out.
 */
export interface AccountSpec {
  code: string;
  name: string;
  type: LedgerAccountType;
  currency: string;
  customerId?: string;
  walletId?: string;
  provider?: string;
}

const cur = (currency: string) => currency.toUpperCase();

export const Accounts = {
  /** Amounts customers owe on issued invoices. */
  receivable: (currency: string): AccountSpec => ({
    code: 'receivable',
    name: 'Accounts receivable',
    type: 'ASSET',
    currency: cur(currency),
  }),

  /** Funds captured by a payment provider and not yet settled to the tenant's bank. */
  providerClearing: (provider: string, currency: string): AccountSpec => ({
    code: `provider_clearing:${provider.toLowerCase()}`,
    name: `Provider clearing (${provider.toLowerCase()})`,
    type: 'ASSET',
    currency: cur(currency),
    provider: provider.toLowerCase(),
  }),

  /**
   * Paid wallet top-ups recorded without a payment in the system (the money
   * was collected elsewhere). Its balance is what still needs to be matched.
   */
  walletTopUpClearing: (currency: string): AccountSpec => ({
    code: 'wallet_topup_clearing',
    name: 'Wallet top-ups collected outside the system',
    type: 'ASSET',
    currency: cur(currency),
  }),

  revenue: (currency: string): AccountSpec => ({
    code: 'revenue',
    name: 'Billing revenue',
    type: 'REVENUE',
    currency: cur(currency),
  }),

  taxPayable: (currency: string): AccountSpec => ({
    code: 'tax_payable',
    name: 'Tax payable',
    type: 'LIABILITY',
    currency: cur(currency),
  }),

  /** Contra-revenue: refunds given back to customers. */
  refunds: (currency: string): AccountSpec => ({
    code: 'refunds',
    name: 'Refunds',
    type: 'REVENUE',
    currency: cur(currency),
  }),

  /** Contra-revenue: finalized credit notes. */
  creditNotes: (currency: string): AccountSpec => ({
    code: 'credit_notes',
    name: 'Credit notes issued',
    type: 'REVENUE',
    currency: cur(currency),
  }),

  /** Amounts owed back to customers from credit notes, until refunded or applied. */
  customerCredit: (currency: string): AccountSpec => ({
    code: 'customer_credit',
    name: 'Customer credit owed',
    type: 'LIABILITY',
    currency: cur(currency),
  }),

  customerWallet: (walletId: string, customerId: string, currency: string): AccountSpec => ({
    code: `customer_wallet:${walletId}`,
    name: `Customer wallet ${walletId}`,
    type: 'LIABILITY',
    currency: cur(currency),
    walletId,
    customerId,
  }),

  /** Cost of free (granted) wallet credits. */
  promotionalCredits: (currency: string): AccountSpec => ({
    code: 'promotional_credits',
    name: 'Promotional credits granted',
    type: 'EXPENSE',
    currency: cur(currency),
  }),

  /** Wallet credits that expired or were voided without being used. */
  walletBreakage: (currency: string): AccountSpec => ({
    code: 'wallet_breakage',
    name: 'Expired or voided wallet credits',
    type: 'REVENUE',
    currency: cur(currency),
  }),

  /** Wallet money committed to a payout that the provider has not confirmed yet. */
  payoutsInFlight: (currency: string): AccountSpec => ({
    code: 'payouts_in_flight',
    name: 'Payouts in flight',
    type: 'LIABILITY',
    currency: cur(currency),
  }),

  /** Payouts sent from the tenant's own provider balance (not from a customer wallet). */
  payoutsSent: (currency: string): AccountSpec => ({
    code: 'payouts_sent',
    name: 'Payouts sent',
    type: 'EXPENSE',
    currency: cur(currency),
  }),

  /** Clearing account for wallet-to-wallet transfers; nets to zero once both legs post. */
  walletTransfers: (currency: string): AccountSpec => ({
    code: 'wallet_transfers',
    name: 'Wallet transfers clearing',
    type: 'LIABILITY',
    currency: cur(currency),
  }),

  /** Revenue from one-time collections not tied to an invoice. */
  oneTimeRevenue: (currency: string): AccountSpec => ({
    code: 'one_time_revenue',
    name: 'One-time collections',
    type: 'REVENUE',
    currency: cur(currency),
  }),

  providerFees: (provider: string, currency: string): AccountSpec => ({
    code: `provider_fees:${provider.toLowerCase()}`,
    name: `Provider fees (${provider.toLowerCase()})`,
    type: 'EXPENSE',
    currency: cur(currency),
    provider: provider.toLowerCase(),
  }),

  /** Commission owed to the platform operator, until it is settled. */
  platformCommissionPayable: (currency: string): AccountSpec => ({
    code: 'platform_commission_payable',
    name: 'Platform commission payable',
    type: 'LIABILITY',
    currency: cur(currency),
  }),

  /** Commission the tenant bears (not passed on to payers). */
  platformCommission: (currency: string): AccountSpec => ({
    code: 'platform_commission',
    name: 'Platform commission',
    type: 'EXPENSE',
    currency: cur(currency),
  }),
};
