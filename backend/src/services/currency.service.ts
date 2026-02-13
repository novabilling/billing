import { Injectable } from '@nestjs/common';

export interface CurrencyInfo {
  symbol: string;
  name: string;
  decimals: number;
}

@Injectable()
export class CurrencyService {
  private readonly currencies: Map<string, CurrencyInfo> = new Map<
    string,
    CurrencyInfo
  >([
    // Major African Currencies (by economy size)
    ['ZAR', { symbol: 'R', name: 'South African Rand', decimals: 2 }],
    ['NGN', { symbol: '\u20A6', name: 'Nigerian Naira', decimals: 2 }],
    ['EGP', { symbol: 'E\u00A3', name: 'Egyptian Pound', decimals: 2 }],
    ['MAD', { symbol: 'DH', name: 'Moroccan Dirham', decimals: 2 }],
    ['KES', { symbol: 'KSh', name: 'Kenyan Shilling', decimals: 2 }],
    ['DZD', { symbol: 'DA', name: 'Algerian Dinar', decimals: 2 }],
    ['TND', { symbol: 'DT', name: 'Tunisian Dinar', decimals: 3 }],
    ['GHS', { symbol: 'GH\u20B5', name: 'Ghanaian Cedi', decimals: 2 }],
    ['AOA', { symbol: 'Kz', name: 'Angolan Kwanza', decimals: 2 }],
    ['ETB', { symbol: 'Br', name: 'Ethiopian Birr', decimals: 2 }],

    // East Africa
    ['UGX', { symbol: 'USh', name: 'Ugandan Shilling', decimals: 0 }],
    ['TZS', { symbol: 'TSh', name: 'Tanzanian Shilling', decimals: 0 }],
    ['RWF', { symbol: 'FRw', name: 'Rwandan Franc', decimals: 0 }],
    ['SDG', { symbol: 'SDG', name: 'Sudanese Pound', decimals: 2 }],
    ['SOS', { symbol: 'Sh', name: 'Somali Shilling', decimals: 2 }],
    ['SSP', { symbol: 'SS\u00A3', name: 'South Sudanese Pound', decimals: 2 }],

    // Southern Africa
    ['BWP', { symbol: 'P', name: 'Botswana Pula', decimals: 2 }],
    ['MWK', { symbol: 'MK', name: 'Malawian Kwacha', decimals: 2 }],
    ['MUR', { symbol: '\u20A8', name: 'Mauritian Rupee', decimals: 2 }],
    ['NAD', { symbol: 'N$', name: 'Namibian Dollar', decimals: 2 }],
    ['SCR', { symbol: '\u20A8', name: 'Seychellois Rupee', decimals: 2 }],
    ['SZL', { symbol: 'L', name: 'Swazi Lilangeni', decimals: 2 }],
    ['ZMW', { symbol: 'ZK', name: 'Zambian Kwacha', decimals: 2 }],
    ['MZN', { symbol: 'MT', name: 'Mozambican Metical', decimals: 2 }],
    ['LSL', { symbol: 'L', name: 'Lesotho Loti', decimals: 2 }],

    // West Africa
    ['XOF', { symbol: 'CFA', name: 'West African CFA Franc', decimals: 0 }],
    ['CVE', { symbol: '$', name: 'Cape Verdean Escudo', decimals: 2 }],
    ['GMD', { symbol: 'D', name: 'Gambian Dalasi', decimals: 2 }],
    ['GNF', { symbol: 'FG', name: 'Guinean Franc', decimals: 0 }],
    ['LRD', { symbol: 'L$', name: 'Liberian Dollar', decimals: 2 }],
    ['SLL', { symbol: 'Le', name: 'Sierra Leonean Leone', decimals: 2 }],

    // Central Africa
    ['XAF', { symbol: 'FCFA', name: 'Central African CFA Franc', decimals: 0 }],
    ['STN', { symbol: 'Db', name: 'S\u00E3o Tom\u00E9 and Pr\u00EDncipe Dobra', decimals: 2 }],

    // North Africa
    ['LYD', { symbol: 'LD', name: 'Libyan Dinar', decimals: 3 }],
    ['MRU', { symbol: 'UM', name: 'Mauritanian Ouguiya', decimals: 2 }],

    // Global Currencies
    ['USD', { symbol: '$', name: 'US Dollar', decimals: 2 }],
    ['EUR', { symbol: '\u20AC', name: 'Euro', decimals: 2 }],
    ['GBP', { symbol: '\u00A3', name: 'British Pound', decimals: 2 }],
    ['CAD', { symbol: 'C$', name: 'Canadian Dollar', decimals: 2 }],
    ['AUD', { symbol: 'A$', name: 'Australian Dollar', decimals: 2 }],
    ['JPY', { symbol: '\u00A5', name: 'Japanese Yen', decimals: 0 }],
    ['CNY', { symbol: '\u00A5', name: 'Chinese Yuan', decimals: 2 }],
    ['INR', { symbol: '\u20B9', name: 'Indian Rupee', decimals: 2 }],
    ['BRL', { symbol: 'R$', name: 'Brazilian Real', decimals: 2 }],
  ]);

  formatAmount(amount: number, currency: string): string {
    const info = this.getCurrencyInfo(currency);
    const formattedNumber = amount.toFixed(info.decimals).replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ',',
    );
    return `${info.symbol}${formattedNumber}`;
  }

  getCurrencyInfo(currency: string): CurrencyInfo {
    const upperCurrency = currency.toUpperCase();
    const info = this.currencies.get(upperCurrency);

    if (!info) {
      throw new Error(
        `Unsupported currency: ${currency}. Supported currencies: ${this.getSupportedCurrencies().join(', ')}`,
      );
    }

    return info;
  }

  validateCurrency(currency: string): boolean {
    return this.currencies.has(currency.toUpperCase());
  }

  getSupportedCurrencies(): string[] {
    return Array.from(this.currencies.keys());
  }
}
