import { HttpStatus } from '@nestjs/common';
import { assertPlanAllows, countedBy, featureOf, loadPlan, parseLimits, PlanLimitException, routeOf, usageCounter } from '../../../src/common/guards/plan-limits';

const plan = (limits: Record<string, unknown> | null) => ({ limits: parseLimits(limits), planName: 'Free', manageUrl: 'https://pay.example/upgrade/x' });
const counts = (values: Record<string, number>) => jest.fn(async (what: string) => values[what] ?? 0);

describe('routes', () => {
  it('normalises paths and finds features and counted creations', () => {
    expect(routeOf('/api/customers/?page=2')).toBe('/customers');
    expect(featureOf('/events/batch')).toBe('usage_billing');
    expect(featureOf('/payouts/abc')).toBe('money_movement');
    expect(featureOf('/eventsx')).toBeUndefined();
    expect(countedBy('POST', '/customers')).toBe('customers');
    expect(countedBy('GET', '/customers')).toBeUndefined();
    expect(countedBy('POST', '/subscriptions/abc/cancel')).toBeUndefined();
  });
});

describe('parseLimits', () => {
  it('keeps known, well-formed limits only', () => {
    expect(parseLimits({ customers: 25, teamMembers: -1, invoicesPerMonth: 2.5, junk: 3, disabledFeatures: ['ledger', 'nope', 'ledger'] })).toEqual({
      customers: 25,
      disabledFeatures: ['ledger'],
    });
    expect(parseLimits({})).toBeNull();
    expect(parseLimits(null)).toBeNull();
    expect(parseLimits([1])).toBeNull();
  });
});

describe('assertPlanAllows', () => {
  it('lets everything through without limits, without counting', async () => {
    const count = counts({});
    await expect(assertPlanAllows(plan(null), 'POST', '/customers', count)).resolves.toBeUndefined();
    expect(count).not.toHaveBeenCalled();
  });

  it('refuses creation at the limit with a 402 that says how to upgrade', async () => {
    const limited = plan({ customers: 25 });
    await expect(assertPlanAllows(limited, 'POST', '/customers', counts({ customers: 24 }))).resolves.toBeUndefined();
    try {
      await assertPlanAllows(limited, 'POST', '/customers', counts({ customers: 25 }));
      fail('expected a refusal');
    } catch (error) {
      expect(error).toBeInstanceOf(PlanLimitException);
      expect((error as PlanLimitException).getStatus()).toBe(HttpStatus.PAYMENT_REQUIRED);
      expect((error as PlanLimitException).getResponse()).toMatchObject({
        code: 'PLAN_LIMIT',
        message: 'The Free plan allows up to 25 customers.',
        upgradeUrl: 'https://pay.example/upgrade/x',
      });
    }
  });

  it('only counts the resource being created', async () => {
    const count = counts({ customers: 99 });
    await expect(assertPlanAllows(plan({ customers: 1 }), 'POST', '/invoices', count)).resolves.toBeUndefined();
    expect(count).not.toHaveBeenCalled();
  });

  it('refuses a feature the plan leaves out, for reads too', async () => {
    await expect(assertPlanAllows(plan({ disabledFeatures: ['wallets'] }), 'GET', '/wallets', counts({}))).rejects.toThrow(
      'Wallets is not included in the Free plan.',
    );
    await expect(assertPlanAllows(plan({ disabledFeatures: ['wallets'] }), 'GET', '/customers', counts({}))).resolves.toBeUndefined();
  });
});

describe('loadPlan and usageCounter', () => {
  it('caches the plan briefly', async () => {
    const findUnique = jest.fn(async () => ({ limits: { customers: 3 }, planName: 'Free', manageUrl: null }));
    const central = { tenantBilling: { findUnique } } as never;
    expect(await loadPlan(central, 'cache-test', 1_000)).toEqual({ limits: { customers: 3 }, planName: 'Free', manageUrl: null });
    await loadPlan(central, 'cache-test', 20_000);
    expect(findUnique).toHaveBeenCalledTimes(1);
    await loadPlan(central, 'cache-test', 40_000);
    expect(findUnique).toHaveBeenCalledTimes(2);
  });

  it('counts people with pending invitations, and invoices from the start of the month', async () => {
    const invoiceCount = jest.fn(async () => 7);
    const central = { membership: { count: async () => 2 }, invitation: { count: async () => 1 } } as never;
    const db = { invoice: { count: invoiceCount } } as never;
    const counter = usageCounter(central, db, 't1', new Date('2026-10-20T12:00:00Z'));
    expect(await counter('teamMembers')).toBe(3);
    expect(await counter('invoicesPerMonth')).toBe(7);
    expect(invoiceCount).toHaveBeenCalledWith({ where: { createdAt: { gte: new Date('2026-10-01T00:00:00Z') } } });
  });
});
