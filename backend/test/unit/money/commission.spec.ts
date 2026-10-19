import { quoteCommission, validateCommission } from '../../../src/modules/money/commission';

describe('commission', () => {
  it('applies rate, flat fee, minimum and maximum per currency', () => {
    const rules = { collection: { rateBps: 150, flat: { UGX: '200' }, min: { UGX: '500' }, max: { UGX: '10000' } } };
    expect(quoteCommission(rules, 'collection', '10000', 'UGX', 0)?.amount).toBe('500.0000'); // 150 + 200 → min 500
    expect(quoteCommission(rules, 'collection', '100000', 'UGX', 0)?.amount).toBe('1700.0000');
    expect(quoteCommission(rules, 'collection', '5000000', 'UGX', 0)?.amount).toBe('10000.0000'); // capped
  });

  it('rounds up to the smallest unit of the currency', () => {
    expect(quoteCommission({ payout: { rateBps: 125 } }, 'payout', '10.01', 'USD', 2)?.amount).toBe('0.1300');
    expect(quoteCommission({ payout: { rateBps: 125 } }, 'payout', '1001', 'UGX', 0)?.amount).toBe('13.0000');
  });

  it('adds commission to what the payer pays only when the rule says so', () => {
    expect(quoteCommission({ collection: { rateBps: 200, chargeTo: 'payer' } }, 'collection', '50000', 'UGX', 0)).toEqual({
      amount: '1000.0000',
      chargeTo: 'payer',
      charged: '51000.0000',
    });
    expect(quoteCommission({ collection: { rateBps: 200 } }, 'collection', '50000', 'UGX', 0)?.charged).toBe('50000.0000');
  });

  it('is nothing without a rule', () => {
    expect(quoteCommission({}, 'payout', '100', 'UGX', 0)).toBeNull();
    expect(quoteCommission(undefined, 'payout', '100', 'UGX', 0)).toBeNull();
  });

  it('rejects malformed rules', () => {
    expect(() => validateCommission({ refund: {} })).toThrow(/not a known movement/);
    expect(() => validateCommission({ payout: { rateBps: 9000 } })).toThrow(/0 to 5000/);
    expect(() => validateCommission({ payout: { chargeTo: 'payer' } })).toThrow(/Only collections/);
    expect(() => validateCommission({ collection: { flat: { ugx: 'abc' } } })).toThrow(/amounts like/);
    expect(validateCommission({ collection: { rateBps: 100, chargeTo: 'payer' } })).toEqual({ collection: { rateBps: 100, chargeTo: 'payer' } });
  });
});
