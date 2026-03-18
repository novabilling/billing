import { Logger } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import {
  BasePaymentProvider,
  ChargeParams,
  PaymentResult,
  RefundParams,
  RefundResult,
  PaymentStatusResult,
  WebhookData,
  ChargePaymentMethodParams,
} from './base-payment.provider';

interface PayPalCredentials {
  clientId: string;
  clientSecret: string;
  webhookId: string;
  environment: 'sandbox' | 'live';
}

export class PayPalProvider extends BasePaymentProvider {
  readonly name = 'paypal';
  private readonly logger = new Logger(PayPalProvider.name);
  private readonly credentials: PayPalCredentials;
  private readonly baseUrl: string;

  constructor(credentials: PayPalCredentials) {
    super();
    this.credentials = credentials;
    this.baseUrl =
      credentials.environment === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';
  }

  // Obtain a short-lived OAuth 2 access token
  private async getAccessToken(): Promise<string> {
    const credentials = Buffer.from(
      `${this.credentials.clientId}:${this.credentials.clientSecret}`,
    ).toString('base64');

    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`PayPal auth failed: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token as string;
  }

  async charge(params: ChargeParams): Promise<PaymentResult> {
    try {
      if (!params.callbackUrl) {
        return { success: false, error: 'callbackUrl is required for PayPal checkout' };
      }

      const accessToken = await this.getAccessToken();

      const order = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: params.reference,
            amount: {
              currency_code: params.currency.toUpperCase(),
              value: params.amount.toFixed(2),
            },
            description: `Invoice ${params.reference}`,
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
              return_url: params.callbackUrl,
              cancel_url: params.callbackUrl,
            },
          },
        },
        application_context: {
          return_url: params.callbackUrl,
          cancel_url: params.callbackUrl,
        },
      };

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      const data = await response.json();

      if (!response.ok) {
        this.logger.error('PayPal charge failed', data);
        return { success: false, error: data.message || 'PayPal order creation failed' };
      }

      // Find the approval link for redirect-based payment
      const approveLink = (data.links as Array<{ href: string; rel: string }>)?.find(
        (l) => l.rel === 'payer-action' || l.rel === 'approve',
      );

      return {
        success: true,
        transactionId: data.id,
        paymentUrl: approveLink?.href,
      };
    } catch (error) {
      this.logger.error('PayPal charge error', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PayPal charge failed',
      };
    }
  }

  async refund(params: RefundParams): Promise<RefundResult> {
    try {
      const accessToken = await this.getAccessToken();

      // First we need to get the capture ID from the order
      const orderResponse = await fetch(`${this.baseUrl}/v2/checkout/orders/${params.transactionId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!orderResponse.ok) {
        return { success: false, error: 'PayPal order not found' };
      }

      const orderData = await orderResponse.json();
      const captureId: string | undefined = orderData.purchase_units?.[0]?.payments?.captures?.[0]?.id;

      if (!captureId) {
        return { success: false, error: 'No capture found for this order' };
      }

      const body: Record<string, unknown> = {};
      if (params.amount !== undefined) {
        const currencyCode: string =
          orderData.purchase_units?.[0]?.amount?.currency_code || 'USD';
        body.amount = {
          value: params.amount.toFixed(2),
          currency_code: currencyCode,
        };
      }

      const refundResponse = await fetch(`${this.baseUrl}/v2/payments/captures/${captureId}/refund`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const refundData = await refundResponse.json();

      if (!refundResponse.ok) {
        this.logger.error('PayPal refund failed', refundData);
        return { success: false, error: refundData.message || 'PayPal refund failed' };
      }

      return { success: true, refundId: refundData.id };
    } catch (error) {
      this.logger.error('PayPal refund error', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PayPal refund failed',
      };
    }
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentStatusResult> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${transactionId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();

    const statusMap: Record<string, PaymentStatusResult['status']> = {
      COMPLETED: 'succeeded',
      APPROVED: 'pending',
      CREATED: 'pending',
      SAVED: 'pending',
      PAYER_ACTION_REQUIRED: 'pending',
      VOIDED: 'failed',
    };

    const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
    const amount = capture
      ? Number(capture.amount?.value)
      : Number(data.purchase_units?.[0]?.amount?.value) || 0;
    const currency = capture
      ? capture.amount?.currency_code
      : data.purchase_units?.[0]?.amount?.currency_code || 'USD';

    return {
      status: statusMap[data.status] || 'pending',
      transactionId,
      amount,
      currency,
    };
  }

  async handleWebhook(
    payload: Record<string, unknown>,
    signature: string,
    rawBody?: string,
  ): Promise<WebhookData> {
    // Verify webhook signature using PayPal's HMAC-SHA256 scheme
    if (rawBody && signature && this.credentials.webhookId) {
      const parts = signature.split('&').reduce<Record<string, string>>((acc, part) => {
        const [k, v] = part.split('=');
        acc[k] = v;
        return acc;
      }, {});

      const transmissionId = parts['PAYPAL-TRANSMISSION-ID'] || '';
      const timestamp = parts['PAYPAL-TRANSMISSION-TIME'] || '';
      const certUrl = parts['PAYPAL-CERT-URL'] || '';
      const authAlgo = parts['PAYPAL-AUTH-ALGO'] || '';

      if (authAlgo.includes('SHA256')) {
        // The expected signature is a CRC32 of the raw body embedded in the signature string
        const signaturePayload = `${transmissionId}|${timestamp}|${this.credentials.webhookId}|${rawBody}`;
        const expectedSig = createHmac('sha256', this.credentials.clientSecret)
          .update(signaturePayload)
          .digest('base64');
        const providedSig = parts['PAYPAL-TRANSMISSION-SIG'] || '';
        try {
          const expected = Buffer.from(expectedSig);
          const provided = Buffer.from(providedSig);
          if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
            throw new Error('PayPal webhook signature mismatch');
          }
        } catch {
          throw new Error('PayPal webhook signature verification failed');
        }
      }
    }

    const eventType = payload.event_type as string;
    const resource = payload.resource as Record<string, unknown>;

    const succeededEvents = [
      'PAYMENT.CAPTURE.COMPLETED',
      'CHECKOUT.ORDER.APPROVED',
      'CHECKOUT.ORDER.COMPLETED',
    ];
    const failedEvents = ['PAYMENT.CAPTURE.DENIED', 'PAYMENT.CAPTURE.DECLINED'];

    const status: WebhookData['status'] = succeededEvents.includes(eventType)
      ? 'succeeded'
      : failedEvents.includes(eventType)
        ? 'failed'
        : 'failed';

    const transactionId =
      (resource?.id as string) ||
      (resource?.order_id as string) ||
      '';

    const captureAmount = resource?.amount as Record<string, string> | undefined;
    const amount = captureAmount ? Number(captureAmount.value) : 0;
    const currency = captureAmount?.currency_code || 'USD';
    const invoiceId = (resource as any)?.invoice_id ||
      ((resource as any)?.purchase_units?.[0] as any)?.invoice_id;

    return { status, transactionId, amount, currency, invoiceId };
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getAccessToken();
      return true;
    } catch {
      return false;
    }
  }

  async chargePaymentMethod(params: ChargePaymentMethodParams): Promise<PaymentResult> {
    // PayPal does not natively support charging a stored vault token without
    // the Vault v3 API, which requires additional onboarding. We redirect
    // the customer to a fresh checkout order instead.
    return this.charge({
      amount: params.amount,
      currency: params.currency,
      email: '',
      reference: params.reference,
      metadata: params.metadata,
    });
  }
}
