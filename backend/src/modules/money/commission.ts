import { BadRequestException } from '@nestjs/common';
import { formatScaled, toScaled } from '../ledger/ledger.money';

/**
 * Platform commission on money movement. Off unless an operator sets a rule
 * for the tenant. Amounts are per currency in major units; the rate is in
 * basis points (100 bps = 1%).
 */
export interface CommissionRule {
  rateBps?: number;
  flat?: Record<string, string>;
  min?: Record<string, string>;
  max?: Record<string, string>;
  /**
   * Who bears it. "tenant" (default): taken from the tenant's side and owed
   * to the platform. "payer" (collections only): added on top of what the
   * payer is asked to pay.
   */
  chargeTo?: 'tenant' | 'payer';
}

export interface CommissionSettings {
  collection?: CommissionRule;
  payout?: CommissionRule;
  transfer?: CommissionRule;
}

export type CommissionKind = keyof CommissionSettings;

export interface CommissionQuote {
  /** Commission in major units, as a decimal string at ledger scale. */
  amount: string;
  chargeTo: 'tenant' | 'payer';
  /** What the payer is asked for (collections charged to the payer), else the base amount. */
  charged: string;
}

/** Commission for one movement, or null when no rule applies. */
export function quoteCommission(
  settings: CommissionSettings | undefined,
  kind: CommissionKind,
  amount: string,
  currency: string,
  currencyDecimals: number,
): CommissionQuote | null {
  const rule = settings?.[kind];
  if (!rule) return null;

  const base = toScaled(amount);
  let fee = (base * BigInt(rule.rateBps ?? 0)) / 10000n;
  const flat = rule.flat?.[currency];
  if (flat !== undefined) fee += toScaled(flat);
  const min = rule.min?.[currency];
  const max = rule.max?.[currency];
  if (min !== undefined && fee < toScaled(min)) fee = toScaled(min);
  if (max !== undefined && fee > toScaled(max)) fee = toScaled(max);

  // Round up to the currency's smallest unit so providers can move it.
  const unit = 10n ** BigInt(4 - currencyDecimals);
  if (fee % unit !== 0n) fee = (fee / unit + 1n) * unit;
  if (fee <= 0n) return null;

  const chargeTo = kind === 'collection' && rule.chargeTo === 'payer' ? 'payer' : 'tenant';
  return {
    amount: formatScaled(fee),
    chargeTo,
    charged: formatScaled(chargeTo === 'payer' ? base + fee : base),
  };
}

/** Validate an operator-supplied commission config. */
export function validateCommission(raw: unknown): CommissionSettings {
  if (raw === null || raw === undefined) return {};
  if (typeof raw !== 'object') throw new BadRequestException('commission must be an object');
  const out: CommissionSettings = {};
  for (const [kind, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!['collection', 'payout', 'transfer'].includes(kind)) {
      throw new BadRequestException(`commission.${kind} is not a known movement type`);
    }
    if (value === null) continue;
    const rule = value as CommissionRule;
    if (rule.rateBps !== undefined && (!Number.isInteger(rule.rateBps) || rule.rateBps < 0 || rule.rateBps > 5000)) {
      throw new BadRequestException(`commission.${kind}.rateBps must be a whole number from 0 to 5000`);
    }
    if (rule.chargeTo !== undefined && !['tenant', 'payer'].includes(rule.chargeTo)) {
      throw new BadRequestException(`commission.${kind}.chargeTo must be "tenant" or "payer"`);
    }
    if (rule.chargeTo === 'payer' && kind !== 'collection') {
      throw new BadRequestException('Only collections can pass commission to the payer');
    }
    for (const field of ['flat', 'min', 'max'] as const) {
      for (const [currency, amount] of Object.entries(rule[field] ?? {})) {
        if (!/^[A-Z]{3}$/.test(currency) || !/^\d+(\.\d{1,4})?$/.test(String(amount))) {
          throw new BadRequestException(`commission.${kind}.${field} needs amounts like {"UGX": "500"}`);
        }
      }
    }
    out[kind as CommissionKind] = rule;
  }
  return out;
}
