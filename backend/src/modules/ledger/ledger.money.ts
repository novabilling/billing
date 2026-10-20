/**
 * Ledger amounts are BigInt at a fixed scale of 4 decimal places, matching the
 * Decimal(19, 4) columns used everywhere else in the tenant schema. Converting
 * through strings (never floats) keeps the ledger an exact mirror of the rows
 * it is derived from.
 */
export const LEDGER_SCALE = 4;
const FACTOR = 10n ** BigInt(LEDGER_SCALE);

type DecimalLike = { toFixed(dp: number): string };

export function toScaled(value: DecimalLike | string | number | bigint | null | undefined): bigint {
  if (value === null || value === undefined) return 0n;
  if (typeof value === 'bigint') return value * FACTOR;

  let text: string;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error(`Cannot convert ${value} to a ledger amount`);
    text = value.toFixed(LEDGER_SCALE);
  } else if (typeof value === 'string') {
    text = value.trim();
  } else {
    text = value.toFixed(LEDGER_SCALE);
  }

  const match = /^(-)?(\d+)(?:\.(\d+))?$/.exec(text);
  if (!match) throw new Error(`Cannot convert "${text}" to a ledger amount`);
  const [, sign, whole, frac = ''] = match;
  // Truncate beyond the ledger scale; source columns never carry more than 4 dp.
  const fraction = (frac + '0'.repeat(LEDGER_SCALE)).slice(0, LEDGER_SCALE);
  const scaled = BigInt(whole) * FACTOR + BigInt(fraction);
  return sign ? -scaled : scaled;
}

/** Format a scaled amount as a plain decimal string, e.g. 12345n → "1.2345". */
export function formatScaled(value: bigint): string {
  const negative = value < 0n;
  const abs = negative ? -value : value;
  const whole = abs / FACTOR;
  const fraction = (abs % FACTOR).toString().padStart(LEDGER_SCALE, '0');
  return `${negative ? '-' : ''}${whole}.${fraction}`;
}
