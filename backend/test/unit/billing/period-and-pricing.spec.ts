import { addMonthsClamped, firstPeriodEnd, fractionOfPeriod, nextBoundary } from '../../../src/modules/billing/period';
import { chargeCost, dec, roundMoney } from '../../../src/modules/billing/pricing';

const d = (iso: string) => new Date(iso);

describe('billing periods', () => {
  it('keeps the day of the month instead of overflowing (Jan 31 → Feb 28 → Mar 31)', () => {
    const anchor = d('2026-01-31T10:00:00Z');
    const feb = nextBoundary(anchor, anchor, 'MONTHLY');
    expect(feb.toISOString()).toBe('2026-02-28T10:00:00.000Z');
    const mar = nextBoundary(anchor, feb, 'MONTHLY');
    expect(mar.toISOString()).toBe('2026-03-31T10:00:00.000Z');
    expect(nextBoundary(anchor, mar, 'MONTHLY').toISOString()).toBe('2026-04-30T10:00:00.000Z');
  });

  it('handles leap years', () => {
    expect(addMonthsClamped(d('2028-01-31T00:00:00Z'), 1).toISOString()).toBe('2028-02-29T00:00:00.000Z');
    expect(addMonthsClamped(d('2028-02-29T00:00:00Z'), 12).toISOString()).toBe('2029-02-28T00:00:00.000Z');
    expect(nextBoundary(d('2028-02-29T00:00:00Z'), d('2029-02-28T00:00:00Z'), 'YEARLY').toISOString()).toBe('2030-02-28T00:00:00.000Z');
  });

  it('counts quarters from the anchor', () => {
    expect(firstPeriodEnd(d('2026-11-30T00:00:00Z'), 'QUARTERLY').toISOString()).toBe('2027-02-28T00:00:00.000Z');
    expect(nextBoundary(d('2026-11-30T00:00:00Z'), d('2027-02-28T00:00:00Z'), 'QUARTERLY').toISOString()).toBe('2027-05-30T00:00:00.000Z');
  });

  it('steps fixed intervals from the anchor, catching up past boundaries', () => {
    const anchor = d('2026-01-01T00:00:00Z');
    expect(nextBoundary(anchor, d('2026-01-01T05:30:00Z'), 'HOURLY').toISOString()).toBe('2026-01-01T06:00:00.000Z');
    expect(nextBoundary(anchor, d('2026-01-01T06:00:00Z'), 'HOURLY').toISOString()).toBe('2026-01-01T07:00:00.000Z');
    expect(nextBoundary(anchor, d('2026-01-10T00:00:00Z'), 'WEEKLY').toISOString()).toBe('2026-01-15T00:00:00.000Z');
  });

  it('measures the used share of a period', () => {
    expect(fractionOfPeriod(d('2026-01-01T00:00:00Z'), d('2026-01-11T00:00:00Z'), d('2026-01-01T00:00:00Z'), d('2026-01-06T00:00:00Z'))).toBe(0.5);
    expect(fractionOfPeriod(d('2026-01-01T00:00:00Z'), d('2026-01-11T00:00:00Z'), d('2026-01-01T00:00:00Z'), d('2026-02-01T00:00:00Z'))).toBe(1);
  });
});

describe('charge pricing (decimal)', () => {
  it('STANDARD is exact where floats are not (0.1 + 0.2)', () => {
    expect(chargeCost('STANDARD', dec(3), { amount: '0.1' }).toString()).toBe('0.3');
  });

  it('GRADUATED prices each tier with its flat fee', () => {
    const ranges = [
      { fromValue: 0, toValue: 99, perUnitAmount: '0.10', flatAmount: '0' },
      { fromValue: 100, toValue: null, perUnitAmount: '0.05', flatAmount: '1' },
    ];
    // 100 × 0.10 + 50 × 0.05 + 1
    expect(chargeCost('GRADUATED', dec(150), {}, ranges).toString()).toBe('13.5');
  });

  it('VOLUME prices all units at the matching tier', () => {
    const ranges = [
      { fromValue: 0, toValue: 99, perUnitAmount: '0.10', flatAmount: '0' },
      { fromValue: 100, toValue: null, perUnitAmount: '0.05', flatAmount: '2' },
    ];
    expect(chargeCost('VOLUME', dec(150), {}, ranges).toString()).toBe('9.5');
  });

  it('PACKAGE rounds packages up', () => {
    expect(chargeCost('PACKAGE', dec(101), { packageSize: 50, amount: '5' }).toString()).toBe('15');
  });

  it('PERCENTAGE applies free units and the fixed fee', () => {
    expect(chargeCost('PERCENTAGE', dec(1000), { rate: '2.5', fixedAmount: '0.30', freeUnitsPerTotalAggregation: 200 }).toString()).toBe('20.3');
    expect(chargeCost('PERCENTAGE', dec(100), { rate: '2.5', fixedAmount: '0.30', freeUnitsPerTotalAggregation: 200 }).toString()).toBe('0');
  });

  it('rounds to the currency minor unit', () => {
    expect(roundMoney(dec('10.005'), 'USD').toString()).toBe('10.01');
    expect(roundMoney(dec('1500.5'), 'UGX').toString()).toBe('1501');
    expect(roundMoney(dec('1.2345'), 'KWD').toString()).toBe('1.235');
  });
});
