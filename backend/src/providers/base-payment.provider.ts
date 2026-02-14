export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  error?: string;
}

export interface RefundResult {
  success: boolean;
  refundId?: string;
  error?: string;
}

export interface PaymentStatusResult {
  status: 'succeeded' | 'pending' | 'failed';
  transactionId: string;
  amount: number;
  currency: string;
}

// Card/payment method token extracted from a successful payment
export interface PaymentMethodToken {
  token: string; // Authorization code, card token, etc.
  last4?: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
  email?: string; // Customer email associated with the token
}

export interface WebhookData {
  status: 'succeeded' | 'failed';
  transactionId: string;
  amount: number;
  currency: string;
  invoiceId?: string;
  // Card token extracted from first payment (for recurring billing)
  paymentMethodToken?: PaymentMethodToken;
}

export interface ChargeParams {
  amount: number;
  currency: string;
  email: string;
  customerName?: string;
  reference: string;
  callbackUrl?: string;
  // Restrict payment methods (e.g., "card" to ensure tokenization for recurring billing)
  paymentOptions?: string;
  metadata?: Record<string, unknown>;
}

export interface RefundParams {
  transactionId: string;
  amount?: number;
}

export interface SavedPaymentMethodParams {
  customerId?: string;
  customerEmail: string;
  currency: string;
  callbackUrl: string;
  amount?: number;
  metadata?: Record<string, unknown>;
}

export interface SavedPaymentMethodResult {
  success: boolean;
  paymentMethodId?: string;
  paymentUrl?: string; // Redirect URL if provider requires customer interaction
  last4?: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
  error?: string;
}

export interface ChargePaymentMethodParams {
  paymentMethodId: string;
  amount: number;
  currency: string;
  reference: string;
  customerId?: string;
  metadata?: Record<string, unknown>;
}

export abstract class BasePaymentProvider {
  abstract readonly name: string;

  abstract charge(params: ChargeParams): Promise<PaymentResult>;

  abstract refund(params: RefundParams): Promise<RefundResult>;

  abstract getPaymentStatus(transactionId: string): Promise<PaymentStatusResult>;

  abstract handleWebhook(payload: Record<string, unknown>, signature: string, rawBody?: string): Promise<WebhookData>;

  abstract testConnection(): Promise<boolean>;

  // Save a card without charging (Stripe SetupIntent, or provider-specific flow)
  // For most African providers, cards are saved automatically on first charge —
  // the token comes back in handleWebhook().paymentMethodToken
  createPaymentMethod?(params: SavedPaymentMethodParams): Promise<SavedPaymentMethodResult>;

  // Charge a previously saved card token / authorization code
  chargePaymentMethod?(params: ChargePaymentMethodParams): Promise<PaymentResult>;

  // Remove a saved payment method
  deletePaymentMethod?(paymentMethodId: string): Promise<{ success: boolean; error?: string }>;
}
