export const BILLING_QUEUE = 'billing';
export const PAYMENT_QUEUE = 'payment';
export const WEBHOOK_QUEUE = 'webhook';
export const EMAIL_QUEUE = 'email';

export enum BillingJobType {
  DAILY_BILLING_CYCLE = 'daily-billing-cycle',
  GENERATE_INVOICE = 'generate-invoice',
  SUBSCRIPTION_RENEWAL = 'subscription-renewal',
  PAYMENT_REMINDERS = 'payment-reminders',
  FINALIZE_DRAFT_INVOICES = 'finalize-draft-invoices',
  CHECK_PROGRESSIVE_BILLING = 'check-progressive-billing',
}

export enum PaymentJobType {
  PROCESS_PAYMENT = 'process-payment',
  RETRY_FAILED_PAYMENT = 'retry-failed-payment',
  PROCESS_REFUND = 'process-refund',
  AUTO_CHARGE_PAYMENT_METHOD = 'auto-charge-payment-method',
}

export enum WebhookJobType {
  SEND_WEBHOOK = 'send-webhook',
}

export enum EmailJobType {
  SEND_EMAIL = 'send-email',
}

export type InvoiceKind = 'start' | 'renewal' | 'plan_change' | 'progressive' | 'cancellation';

/** A plan's recurring price for a period (or `fraction` of it, when prorated). */
export interface BaseCharge {
  planId: string;
  periodStart: string;
  periodEnd: string;
  /** Share of the period billed, 0..1; 1 when omitted. */
  fraction?: number;
}

/** Usage of a plan's metered charges over [from, to), within the period starting `periodStart`. */
export interface UsageCharge {
  planId: string;
  periodStart: string;
  from: string;
  to: string;
}

/**
 * One invoice from the billing engine. `billingKey` makes it idempotent:
 * however many times the job runs, at most one invoice has that key.
 * Jobs queued before keys existed carry none and bill the current period.
 */
export interface GenerateInvoiceData {
  tenantId: string;
  subscriptionId: string;
  customerId: string;
  billingKey?: string;
  kind?: InvoiceKind;
  bases?: BaseCharge[];
  usage?: UsageCharge;
  /** Legacy flag from older jobs. */
  progressive?: boolean;
}

export interface ProcessPaymentData {
  tenantId: string;
  invoiceId: string;
  providerName?: string;
}

export interface SendWebhookData {
  tenantId: string;
  event: string;
  payload: Record<string, unknown>;
}

export interface AutoChargeData {
  tenantId: string;
  invoiceId: string;
  subscriptionId: string;
  paymentMethodId: string;
}

export interface EmailAttachment {
  filename: string;
  /** Base64-encoded content */
  content: string;
  contentType: string;
}

export interface SendEmailData {
  tenantId?: string;
  to: string;
  subject: string;
  template: string;
  context: Record<string, unknown>;
  attachments?: EmailAttachment[];
}
