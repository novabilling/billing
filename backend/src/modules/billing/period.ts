/**
 * Billing period arithmetic, in UTC. Periods are counted from an anchor so
 * that monthly billing keeps its day of the month: a subscription anchored
 * on Jan 31 renews on Feb 28 (29), Mar 31, Apr 30, ... rather than drifting
 * (or overflowing Jan 31 + 1 month into March, as Date#setMonth does).
 */
export type BillingIntervalName = 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

const FIXED_MS: Partial<Record<BillingIntervalName, number>> = {
  HOURLY: 60 * 60 * 1000,
  DAILY: 24 * 60 * 60 * 1000,
  WEEKLY: 7 * 24 * 60 * 60 * 1000,
};

const MONTHS: Partial<Record<BillingIntervalName, number>> = {
  MONTHLY: 1,
  QUARTERLY: 3,
  YEARLY: 12,
};

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

/** `date` plus `months`, keeping the time of day and clamping the day to the month's length. */
export function addMonthsClamped(date: Date, months: number): Date {
  const total = date.getUTCFullYear() * 12 + date.getUTCMonth() + months;
  const year = Math.floor(total / 12);
  const month = total - year * 12;
  const day = Math.min(date.getUTCDate(), daysInMonth(year, month));
  return new Date(
    Date.UTC(year, month, day, date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds()),
  );
}

/** The first period boundary after `after`, counting whole intervals from `anchor`. */
export function nextBoundary(anchor: Date, after: Date, interval: string): Date {
  const fixed = FIXED_MS[interval as BillingIntervalName];
  if (fixed) {
    const elapsed = after.getTime() - anchor.getTime();
    const steps = Math.max(1, Math.floor(elapsed / fixed) + 1);
    return new Date(anchor.getTime() + steps * fixed);
  }
  const step = MONTHS[interval as BillingIntervalName] ?? 1;
  const monthsApart = (after.getUTCFullYear() - anchor.getUTCFullYear()) * 12 + (after.getUTCMonth() - anchor.getUTCMonth());
  let n = Math.max(1, Math.floor(monthsApart / step));
  let boundary = addMonthsClamped(anchor, n * step);
  while (boundary.getTime() <= after.getTime()) {
    n += 1;
    boundary = addMonthsClamped(anchor, n * step);
  }
  return boundary;
}

/** The end of the first period starting at `start`. */
export function firstPeriodEnd(start: Date, interval: string): Date {
  return nextBoundary(start, start, interval);
}

/** The share of a period between `from` and `to` (0..1), by time. */
export function fractionOfPeriod(periodStart: Date, periodEnd: Date, from: Date, to: Date): number {
  const total = periodEnd.getTime() - periodStart.getTime();
  if (total <= 0) return 0;
  const start = Math.max(periodStart.getTime(), from.getTime());
  const end = Math.min(periodEnd.getTime(), to.getTime());
  return Math.min(1, Math.max(0, (end - start) / total));
}
