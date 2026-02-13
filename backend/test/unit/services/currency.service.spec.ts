import { CurrencyService } from '../../../src/services/currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;

  beforeEach(() => {
    service = new CurrencyService();
  });

  describe('validateCurrency', () => {
    it('should return true for supported currencies', () => {
      expect(service.validateCurrency('USD')).toBe(true);
      expect(service.validateCurrency('NGN')).toBe(true);
      expect(service.validateCurrency('KES')).toBe(true);
      expect(service.validateCurrency('EUR')).toBe(true);
    });

    it('should return false for unsupported currencies', () => {
      expect(service.validateCurrency('XYZ')).toBe(false);
      expect(service.validateCurrency('ABC')).toBe(false);
    });

    it('should be case-insensitive', () => {
      expect(service.validateCurrency('usd')).toBe(true);
      expect(service.validateCurrency('ngn')).toBe(true);
    });
  });

  describe('getCurrencyInfo', () => {
    it('should return currency info for NGN', () => {
      const info = service.getCurrencyInfo('NGN');
      expect(info.symbol).toBe('\u20A6');
      expect(info.name).toBe('Nigerian Naira');
      expect(info.decimals).toBe(2);
    });

    it('should return currency info for USD', () => {
      const info = service.getCurrencyInfo('USD');
      expect(info.symbol).toBe('$');
      expect(info.name).toBe('US Dollar');
    });

    it('should throw for unsupported currency', () => {
      expect(() => service.getCurrencyInfo('XYZ')).toThrow();
    });
  });

  describe('formatAmount', () => {
    it('should format USD amounts correctly', () => {
      const formatted = service.formatAmount(1234.56, 'USD');
      expect(formatted).toContain('$');
      expect(formatted).toContain('1,234.56');
    });

    it('should format NGN amounts correctly', () => {
      const formatted = service.formatAmount(50000, 'NGN');
      expect(formatted).toContain('50,000.00');
    });
  });

  describe('getSupportedCurrencies', () => {
    it('should return an array of supported currencies', () => {
      const currencies = service.getSupportedCurrencies();
      expect(Array.isArray(currencies)).toBe(true);
      expect(currencies.length).toBeGreaterThan(10);
      expect(currencies).toContain('USD');
      expect(currencies).toContain('NGN');
      expect(currencies).toContain('KES');
    });
  });
});
