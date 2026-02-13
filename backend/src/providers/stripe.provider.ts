import { Logger } from '@nestjs/common';
import {
  BasePaymentProvider,
  ChargeParams,
  PaymentResult,
  RefundParams,
  RefundResult,
  PaymentStatusResult,
  WebhookData,
  SavedPaymentMethodParams,
  SavedPaymentMethodResult,
  ChargePaymentMethodParams,
} from './base-payment.provider';

interface StripeCredentials {
  secretKey: string;
  webhookSecret: string;
}

export class StripeProvider extends BasePaymentProvider {
  readonly name = 'stripe';
  private readonly logger = new Logger(StripeProvider.name);
  private readonly credentials: StripeCredentials;
  private readonly baseUrl = 'https://api.stripe.com/v1';

  constructor(credentials: StripeCredentials) {
    super();
    this.credentials = credentials;
  }

  private get authHeaders() {
    return {
      Authorization: `Bearer ${this.credentials.secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  }

  private encodeParams(params: Record<string, string | number | undefined>): string {
    return Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
  }

  async charge(params: ChargeParams): Promise<PaymentResult> {
    try {
      if (!params.callbackUrl) {
        return { success: false, error: 'callbackUrl is required for Stripe checkout' };
      }

      // Create a Checkout Session for redirect-based payment
      const sessionParams: Record<string, string | number | undefined> = {
        'line_items[0][price_data][currency]': params.currency.toLowerCase(),
        'line_items[0][price_data][product_data][name]': `Invoice ${params.reference}`,
        'line_items[0][price_data][unit_amount]': Math.round(params.amount * 100),
        'line_items[0][quantity]': 1,
        mode: 'payment',
        'metadata[reference]': params.reference,
        'metadata[email]': params.email,
        success_url: `${params.callbackUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: params.callbackUrl,
        customer_email: params.email,
      };

      // Restrict to card if specified (enables tokenization)
      if (params.paymentOptions === 'card') {
        sessionParams['payment_method_types[0]'] = 'card';
      }

      const body = this.encodeParams(sessionParams);

      const response = await fetch(`${this.baseUrl}/checkout/sessions`, {
        method: 'POST',
        headers: this.authHeaders,
        body,
      });

      const data = await response.json();

      if (data.id) {
        return {
          success: true,
          paymentUrl: data.url,
          transactionId: data.id,
        };
      }

      return {
        success: false,
        error: data.error?.message || 'Stripe session creation failed',
      };
    } catch (error) {
      this.logger.error('Stripe charge failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async refund(params: RefundParams): Promise<RefundResult> {
    try {
      // First retrieve the checkout session to get the payment intent
      const sessionRes = await fetch(`${this.baseUrl}/checkout/sessions/${params.transactionId}`, {
        headers: this.authHeaders,
      });
      const session = await sessionRes.json();
      const paymentIntent = session.payment_intent;

      if (!paymentIntent) {
        return { success: false, error: 'No payment intent found for this session' };
      }

      const body = this.encodeParams({
        payment_intent: paymentIntent,
        ...(params.amount ? { amount: Math.round(params.amount * 100) } : {}),
      });

      const response = await fetch(`${this.baseUrl}/refunds`, {
        method: 'POST',
        headers: this.authHeaders,
        body,
      });

      const data = await response.json();

      if (data.id) {
        return { success: true, refundId: data.id };
      }

      return { success: false, error: data.error?.message || 'Refund failed' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund failed',
      };
    }
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentStatusResult> {
    const response = await fetch(`${this.baseUrl}/checkout/sessions/${transactionId}`, {
      headers: this.authHeaders,
    });

    const data = await response.json();

    let status: 'succeeded' | 'pending' | 'failed' = 'pending';
    if (data.payment_status === 'paid') status = 'succeeded';
    else if (data.status === 'expired') status = 'failed';

    return {
      status,
      transactionId: data.id || transactionId,
      amount: (data.amount_total || 0) / 100,
      currency: (data.currency || '').toUpperCase(),
    };
  }

  async handleWebhook(payload: Record<string, unknown>, _signature: string): Promise<WebhookData> {
    // In production you'd verify the signature with this.credentials.webhookSecret
    const event = payload as {
      type?: string;
      data?: { object?: Record<string, unknown> };
    };

    const obj = event.data?.object || {};
    const isSuccess =
      event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded';

    const result: WebhookData = {
      status: isSuccess ? 'succeeded' : 'failed',
      transactionId: String(obj.id || ''),
      amount: Number(obj.amount_total || obj.amount || 0) / 100,
      currency: String(obj.currency || '').toUpperCase(),
      invoiceId: String((obj.metadata as Record<string, string>)?.reference || ''),
    };

    // Extract payment method from successful payment_intent for recurring billing
    if (isSuccess && event.type === 'payment_intent.succeeded') {
      const paymentMethod = String(obj.payment_method || '');
      const customer = String(obj.customer || '');
      if (paymentMethod && customer) {
        result.paymentMethodToken = {
          token: paymentMethod,
        };
      }
    }

    return result;
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/balance`, {
        headers: this.authHeaders,
      });
      const data = await response.json();
      return Array.isArray(data.available);
    } catch {
      return false;
    }
  }

  // ============================================================
  // Tokenization Methods (Card on File / Recurring Billing)
  // ============================================================

  async createPaymentMethod(params: SavedPaymentMethodParams): Promise<SavedPaymentMethodResult> {
    try {
      // Create or retrieve Stripe customer
      let customerId = params.customerId;

      if (!customerId) {
        const customerBody = this.encodeParams({
          email: params.customerEmail,
          ...(params.metadata ? { 'metadata[source]': 'novabilling' } : {}),
        });

        const customerResponse = await fetch(`${this.baseUrl}/customers`, {
          method: 'POST',
          headers: this.authHeaders,
          body: customerBody,
        });

        const customer = await customerResponse.json();
        if (!customer.id) {
          return {
            success: false,
            error: customer.error?.message || 'Failed to create Stripe customer',
          };
        }
        customerId = customer.id;
      }

      // Create a SetupIntent for collecting payment method
      const setupBody = this.encodeParams({
        customer: customerId,
        'payment_method_types[0]': 'card',
        usage: 'off_session', // Allow charging when customer is not present
      });

      const setupResponse = await fetch(`${this.baseUrl}/setup_intents`, {
        method: 'POST',
        headers: this.authHeaders,
        body: setupBody,
      });

      const setupIntent = await setupResponse.json();

      if (!setupIntent.id) {
        return {
          success: false,
          error: setupIntent.error?.message || 'Failed to create setup intent',
        };
      }

      // Return setup intent for frontend to complete
      // Frontend will use Stripe.js to confirm the SetupIntent with card details
      return {
        success: true,
        paymentMethodId: setupIntent.id, // This is the SetupIntent ID
        // Card details will be available after frontend confirms the setup
      };
    } catch (error) {
      this.logger.error('Stripe createPaymentMethod failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async chargePaymentMethod(params: ChargePaymentMethodParams): Promise<PaymentResult> {
    try {
      // Create a PaymentIntent with saved payment method
      const body = this.encodeParams({
        amount: Math.round(params.amount * 100), // Convert to cents
        currency: params.currency.toLowerCase(),
        payment_method: params.paymentMethodId,
        customer: params.customerId,
        confirm: 'true', // Automatically confirm the payment
        off_session: 'true', // Customer is not present
        'metadata[reference]': params.reference,
        ...(params.metadata
          ? Object.entries(params.metadata).reduce(
              (acc, [key, value]) => ({
                ...acc,
                [`metadata[${key}]`]: String(value),
              }),
              {},
            )
          : {}),
      });

      const response = await fetch(`${this.baseUrl}/payment_intents`, {
        method: 'POST',
        headers: this.authHeaders,
        body,
      });

      const paymentIntent = await response.json();

      if (paymentIntent.status === 'succeeded') {
        return {
          success: true,
          transactionId: paymentIntent.id,
        };
      }

      if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_payment_method') {
        return {
          success: false,
          error: 'Payment requires additional authentication or failed',
        };
      }

      return {
        success: false,
        error: paymentIntent.error?.message || `Payment failed with status: ${paymentIntent.status}`,
      };
    } catch (error) {
      this.logger.error('Stripe chargePaymentMethod failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async deletePaymentMethod(paymentMethodId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/payment_methods/${paymentMethodId}/detach`, {
        method: 'POST',
        headers: this.authHeaders,
      });

      const data = await response.json();

      if (data.id) {
        return { success: true };
      }

      return {
        success: false,
        error: data.error?.message || 'Failed to detach payment method',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
