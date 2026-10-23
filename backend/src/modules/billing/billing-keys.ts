import { InvoiceKind } from '../../queues/billing.queue';

/** The invoice key for one billing event of a subscription: at most one invoice per key. */
export function billingKey(subscriptionId: string, kind: InvoiceKind, at: Date): string {
  return `${subscriptionId}|${kind}|${at.toISOString()}`;
}

/** A BullMQ job id for a key (job ids may not contain ':'), so a duplicate job is not even queued. */
export function jobIdFor(key: string): string {
  return key.replace(/[^A-Za-z0-9_-]/g, '_');
}
