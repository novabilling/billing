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
};

export function formatCurrency(
  amount: number,
  currency: string = "USD",
  options?: { showSymbol?: boolean; abbreviated?: boolean }
): string {
  const { showSymbol = true, abbreviated = false } = options || {};
  
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
    minimumFractionDigits: abbreviated ? 1 : 2,
    maximumFractionDigits: abbreviated ? 1 : 2,
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
