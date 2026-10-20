import { isEmail, parseParty } from '../../../src/modules/money/party';

describe('isEmail', () => {
  it('accepts ordinary addresses and refuses malformed ones', () => {
    expect(isEmail('jane@example.com')).toBe(true);
    expect(isEmail('j.doe+tag@mail.example.co.ug')).toBe(true);
    for (const bad of ['jane', 'jane@', '@example.com', 'jane@example', 'jane@example.', 'ja ne@example.com', 'a@b@c.com', 'jane@.com']) {
      expect(isEmail(bad)).toBe(false);
    }
  });

  it('stays fast on long hostile input', () => {
    const hostile = '!@!.' + '!.'.repeat(50_000);
    const started = Date.now();
    isEmail(hostile);
    expect(() => parseParty({ type: 'hosted', email: hostile }, 'payer')).toThrow();
    expect(Date.now() - started).toBeLessThan(200);
  });
});
