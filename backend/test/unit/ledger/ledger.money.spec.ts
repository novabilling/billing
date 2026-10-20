import { formatScaled, toScaled } from '../../../src/modules/ledger/ledger.money';

describe('ledger money', () => {
  it('converts decimals to scale-4 integers without float error', () => {
    expect(toScaled('0.1')).toBe(1000n);
    expect(toScaled('0.2')).toBe(2000n);
    expect(toScaled('0.1') + toScaled('0.2')).toBe(toScaled('0.3'));
    expect(toScaled('1234567890123.4567')).toBe(12345678901234567n);
    expect(toScaled('-15.5')).toBe(-155000n);
    expect(toScaled(50000)).toBe(500000000n);
    expect(toScaled(19.99)).toBe(199900n);
  });

  it('accepts Prisma Decimal-like values', () => {
    expect(toScaled({ toFixed: () => '12.3400' })).toBe(123400n);
  });

  it('treats null and undefined as zero', () => {
    expect(toScaled(null)).toBe(0n);
    expect(toScaled(undefined)).toBe(0n);
  });

  it('rejects malformed input', () => {
    expect(() => toScaled('abc')).toThrow();
    expect(() => toScaled(Number.NaN)).toThrow();
  });

  it('formats back to decimal strings', () => {
    expect(formatScaled(123400n)).toBe('12.3400');
    expect(formatScaled(-5n)).toBe('-0.0005');
    expect(formatScaled(0n)).toBe('0.0000');
  });
});
