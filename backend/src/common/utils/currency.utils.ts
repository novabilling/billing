/**
 * Currencies that have no decimal subunit (ISO 4217 exponent = 0).
 * Amounts for these currencies should be treated as whole numbers.
 */
export const ZERO_DECIMAL_CURRENCIES = new Set([
  'JPY', 'KRW', 'UGX', 'RWF', 'XOF', 'XAF', 'TZS',
  'VND', 'CLP', 'GNF', 'BIF', 'DJF', 'KMF', 'PYG',
  'MGA', 'ISK',
]);

/**
 * Currencies that use 3 decimal places (ISO 4217 exponent = 3).
 */
export const THREE_DECIMAL_CURRENCIES = new Set([
  'KWD', 'BHD', 'OMR', 'JOD', 'TND', 'LYD',
]);

/**
 * Returns the number of minor-unit decimal places for the given currency code.
 */
export function getCurrencyDecimals(currency: string): number {
  const upper = currency.toUpperCase();
  if (ZERO_DECIMAL_CURRENCIES.has(upper)) return 0;
  if (THREE_DECIMAL_CURRENCIES.has(upper)) return 3;
  return 2;
}

/**
 * Converts a major-unit amount to the smallest currency subunit.
 *
 * Examples:
 *   toSmallestUnit(10.50, 'USD') → 1050   (cents)
 *   toSmallestUnit(1000, 'JPY') → 1000   (yen, already smallest unit)
 *   toSmallestUnit(5.125, 'KWD') → 5125  (fils)
 */
export function toSmallestUnit(amount: number, currency: string): number {
  const decimals = getCurrencyDecimals(currency);
  return Math.round(amount * Math.pow(10, decimals));
}

/**
 * Converts a smallest-unit amount back to major units.
 *
 * Examples:
 *   fromSmallestUnit(1050, 'USD') → 10.50
 *   fromSmallestUnit(1000, 'JPY') → 1000
 */
export function fromSmallestUnit(amount: number, currency: string): number {
  const decimals = getCurrencyDecimals(currency);
  return amount / Math.pow(10, decimals);
}

/**
 * Formats an amount as a decimal string suitable for APIs that accept
 * major-unit values (e.g. PayPal, DPO, Flutterwave).
 * Zero-decimal currencies are returned as integers with no decimal point.
 */
export function formatAmountForApi(amount: number, currency: string): string {
  const decimals = getCurrencyDecimals(currency);
  return amount.toFixed(decimals);
}
