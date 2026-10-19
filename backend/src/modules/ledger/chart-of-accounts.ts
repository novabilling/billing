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
};
