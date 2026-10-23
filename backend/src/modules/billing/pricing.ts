import { Prisma } from '../../generated/prisma-tenant/client';
import { getCurrencyDecimals } from '../../common/utils/currency.utils';

/** Money is computed in decimal, never in floating point. */
export type Dec = Prisma.Decimal;
export const Dec = Prisma.Decimal;
type DecValue = string | number | Dec;

export function dec(value: DecValue | null | undefined): Dec {
  if (value === null || value === undefined || value === '') return new Dec(0);
  try {
    const d = new Dec(value);
    return d.isFinite() ? d : new Dec(0);
  } catch {
    return new Dec(0);
  }
}

/** Round to the currency's minor unit, half away from zero. */
export function roundMoney(value: Dec, currency: string): Dec {
  return value.toDecimalPlaces(getCurrencyDecimals(currency), Dec.ROUND_HALF_UP);
}

export interface PriceRange {
  fromValue: number;
  toValue: number | null;
  perUnitAmount: DecValue;
  flatAmount: DecValue | null;
}

/** What a usage charge costs for `units`, before rounding. */
export function chargeCost(model: string, units: Dec, properties: Record<string, unknown>, ranges: PriceRange[] = []): Dec {
  switch (model) {
    case 'STANDARD':
      return units.mul(dec(properties.amount as string));

    case 'GRADUATED': {
      if (ranges.length === 0) return new Dec(0);
      let total = new Dec(0);
      let remaining = units;
      for (const range of ranges) {
        if (remaining.lte(0)) break;
        const size = range.toValue !== null ? new Dec(range.toValue - range.fromValue + 1) : remaining;
        const inRange = Dec.min(remaining, size);
        total = total.add(inRange.mul(dec(range.perUnitAmount))).add(dec(range.flatAmount));
        remaining = remaining.sub(inRange);
      }
      return total;
    }

    case 'VOLUME': {
      for (const range of ranges) {
        const inRange =
          range.toValue === null ? units.gte(range.fromValue) : units.gte(range.fromValue) && units.lte(range.toValue);
        if (inRange) return units.mul(dec(range.perUnitAmount)).add(dec(range.flatAmount));
      }
      return new Dec(0);
    }

    case 'PACKAGE': {
      const size = dec(properties.packageSize as string);
      const packageSize = size.gt(0) ? size : new Dec(1);
      return units.div(packageSize).ceil().mul(dec(properties.amount as string));
    }

    case 'PERCENTAGE': {
      const free = dec(properties.freeUnitsPerTotalAggregation as string);
      const billable = Dec.max(0, units.sub(free));
      if (billable.lte(0)) return new Dec(0);
      return billable.mul(dec(properties.rate as string)).div(100).add(dec(properties.fixedAmount as string));
    }

    default:
      return new Dec(0);
  }
}
