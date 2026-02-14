const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  NGN: "₦",
  KES: "KSh",
  GHS: "GH₵",
  ZAR: "R",
  UGX: "USh",
  TZS: "TSh",
  EGP: "E£",
  MAD: "DH",
  JPY: "¥",
  CNY: "¥",
  INR: "₹",
  BRL: "R$",
  CAD: "C$",
  AUD: "A$",
  RWF: "RF",
  XOF: "CFA",
  XAF: "FCFA",
};

/** Currencies that have no decimal subunit (no cents) */
export const ZERO_DECIMAL_CURRENCIES = new Set([
  "JPY", "KRW", "UGX", "RWF", "XOF", "XAF", "TZS",
  "VND", "CLP", "GNF", "BIF", "DJF", "KMF", "PYG",
]);

/** Returns the number of decimal places for a currency */
export function getCurrencyDecimals(currency: string): number {
  return ZERO_DECIMAL_CURRENCIES.has(currency?.toUpperCase()) ? 0 : 2;
}

export function formatCurrency(
  amount: number,
  currency: string = "USD",
  options?: { showSymbol?: boolean; abbreviated?: boolean }
): string {
  const { showSymbol = true, abbreviated = false } = options || {};
  const decimals = getCurrencyDecimals(currency);

  let formattedAmount = amount;
  let suffix = "";

  if (abbreviated) {
    if (amount >= 1000000) {
      formattedAmount = amount / 1000000;
      suffix = "M";
    } else if (amount >= 1000) {
      formattedAmount = amount / 1000;
      suffix = "K";
    }
  }

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: abbreviated ? (decimals > 0 ? 1 : 0) : decimals,
    maximumFractionDigits: abbreviated ? (decimals > 0 ? 1 : 0) : decimals,
  }).format(formattedAmount);

  if (showSymbol) {
    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    return `${symbol}${formatted}${suffix}`;
  }

  return `${formatted}${suffix} ${currency}`;
}

export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] || currency;
}

export function parseCurrencyAmount(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]+/g, ""));
}
