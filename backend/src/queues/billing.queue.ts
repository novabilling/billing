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

export interface GenerateInvoiceData {
  tenantId: string;
  subscriptionId: string;
  customerId: string;
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

export interface SendEmailData {
  tenantId?: string;
  to: string;
  subject: string;
  template: string;
  context: Record<string, unknown>;
}
