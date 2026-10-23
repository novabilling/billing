import { Logger } from '@nestjs/common';
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
import { formatAmountForApi } from '../common/utils/currency.utils';

interface PayPalCredentials {
  clientId: string;
  clientSecret: string;
  webhookId: string;
  environment: 'sandbox' | 'live';
}

interface PayPalPurchaseUnit {
  reference_id?: string;
  invoice_id?: string;
  amount?: { currency_code: string; value: string };
  payments?: {
    captures?: Array<{ id: string; status?: string; amount?: { value: string; currency_code: string } }>;
  };
}

interface PayPalWebhookResource {
  id?: string;
  order_id?: string;
  status?: string;
  supplementary_data?: { related_ids?: { order_id?: string } };
  invoice_id?: string;
  amount?: { value: string; currency_code: string };
  purchase_units?: PayPalPurchaseUnit[];
}

/**
 * PayPal order and capture ids are short alphanumeric strings. Ids from
 * webhooks or callers go into request paths, so anything else is refused
 * rather than allowed to change the URL.
 */
export function paypalId(value: string | undefined | null): string {
  const id = String(value ?? '');
  if (!/^[A-Za-z0-9-]{1,64}$/.test(id)) throw new Error('Invalid PayPal id');
  return encodeURIComponent(id);
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
              value: formatAmountForApi(params.amount, params.currency),
            },
            description: `Invoice ${params.reference}`,
          },
        ],
        // return_url/cancel_url belong in exactly one place. PayPal's Orders
        // v2 API rejects the request outright (422
        // INCOMPATIBLE_PARAMETER_VALUE on all four fields) when both
        // payment_source.paypal.experience_context *and* the legacy
        // top-level application_context set them — confirmed against a
        // real order-creation attempt, not just the docs. experience_context
        // is the current one to use alongside payment_source; the
        // application_context block that used to sit here was the
        // redundant leftover actually causing every checkout to fail.
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
              return_url: params.callbackUrl,
              cancel_url: params.callbackUrl,
            },
          },
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
      const orderResponse = await fetch(`${this.baseUrl}/v2/checkout/orders/${paypalId(params.transactionId)}`, {
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
          value: formatAmountForApi(params.amount, currencyCode),
          currency_code: currencyCode,
        };
      }

      const refundResponse = await fetch(`${this.baseUrl}/v2/payments/captures/${paypalId(captureId)}/refund`, {
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

    const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${paypalId(transactionId)}`, {
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
    _rawBody?: string,
  ): Promise<WebhookData> {
    await this.verifyWebhook(payload, signature);

    const eventType = payload.event_type as string;
    const resource = (payload.resource ?? {}) as PayPalWebhookResource;
    const orderId = this.orderIdOf(eventType, resource);

    // An approved order has not moved any money yet: capture it now. The
    // capture is idempotent on the order id, so a redelivered APPROVED event
    // cannot capture twice.
    if (eventType === 'CHECKOUT.ORDER.APPROVED' && orderId) {
      return this.captureOrder(orderId, resource);
    }

    const succeededEvents = ['PAYMENT.CAPTURE.COMPLETED', 'CHECKOUT.ORDER.COMPLETED'];
    const failedEvents = ['PAYMENT.CAPTURE.DENIED', 'PAYMENT.CAPTURE.DECLINED', 'CHECKOUT.PAYMENT-APPROVAL.REVERSED'];
    const status: WebhookData['status'] = succeededEvents.includes(eventType)
      ? 'succeeded'
      : failedEvents.includes(eventType)
        ? 'failed'
        : 'pending'; // Unknown events treated as pending until confirmed

    const money = resource.amount ?? resource.purchase_units?.[0]?.amount;
    return {
      status,
      transactionId: orderId || resource.id || '',
      amount: money ? Number(money.value) : 0,
      currency: money?.currency_code || 'USD',
      invoiceId: resource.invoice_id || resource.purchase_units?.[0]?.invoice_id || resource.purchase_units?.[0]?.reference_id,
      referenceVerified: true,
    };
  }

  /**
   * Verify a notification with PayPal's verify-webhook-signature API, using
   * the transmission headers and the webhook id configured for this account.
   * Unsigned or unverifiable notifications are rejected.
   */
  private async verifyWebhook(payload: Record<string, unknown>, signature: string): Promise<void> {
    if (!this.credentials.webhookId) {
      throw new Error('PayPal webhook id is not configured; cannot verify notifications');
    }
    let headers: Record<string, string>;
    try {
      headers = JSON.parse(signature || '{}');
    } catch {
      throw new Error('PayPal webhook: malformed signature headers');
    }
    const { authAlgo, certUrl, transmissionId, transmissionSig, transmissionTime } = headers;
    if (!authAlgo || !certUrl || !transmissionId || !transmissionSig || !transmissionTime) {
      throw new Error('PayPal webhook: missing transmission headers');
    }

    const accessToken = await this.getAccessToken();
    const response = await fetch(`${this.baseUrl}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: this.credentials.webhookId,
        webhook_event: payload,
      }),
    });
    const data = (await response.json().catch(() => ({}))) as { verification_status?: string };
    if (!response.ok || data.verification_status !== 'SUCCESS') {
      throw new Error('PayPal webhook signature verification failed');
    }
  }

  /** Order events carry the order id directly; capture events link to it. */
  private orderIdOf(eventType: string, resource: PayPalWebhookResource): string | undefined {
    if (eventType?.startsWith('CHECKOUT.ORDER')) return resource.id;
    return resource.supplementary_data?.related_ids?.order_id ?? resource.order_id;
  }

  private async captureOrder(orderId: string, resource: PayPalWebhookResource): Promise<WebhookData> {
    const accessToken = await this.getAccessToken();
    const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${paypalId(orderId)}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `capture-${orderId}`,
      },
    });
    const data = (await response.json().catch(() => ({}))) as {
      status?: string;
      details?: { issue?: string }[];
      purchase_units?: PayPalPurchaseUnit[];
    };

    const alreadyCaptured = data.details?.some((d) => d.issue === 'ORDER_ALREADY_CAPTURED');
    const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
    const unit = resource.purchase_units?.[0];
    const money = capture?.amount ?? unit?.amount;

    let status: WebhookData['status'] = 'pending';
    if (response.ok && data.status === 'COMPLETED' && capture?.status !== 'PENDING') status = 'succeeded';
    else if (!response.ok && !alreadyCaptured) {
      this.logger.error(`PayPal capture failed for order ${orderId}`, data);
      // Leave the payment pending: the capture can be retried, and a later
      // PAYMENT.CAPTURE.* notification settles it either way.
    }

    return {
      status,
      transactionId: orderId,
      amount: money ? Number(money.value) : 0,
      currency: money?.currency_code || 'USD',
      invoiceId: unit?.invoice_id || unit?.reference_id,
      referenceVerified: true,
    };
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
    // PayPal requires a browser redirect for payment authorisation; merchant-initiated
    // charges without a customer redirect are only supported via the Vault v3 API, which
    // requires additional PayPal onboarding. Without a callbackUrl the payment cannot
    // complete, so we fail fast with a descriptive error.
    if (!params.callbackUrl) {
      return {
        success: false,
        error:
          'PayPal requires a callbackUrl for customer redirect. ' +
          'Pass a callbackUrl in the charge parameters to initiate a PayPal checkout session.',
      };
    }
    return this.charge({
      amount: params.amount,
      currency: params.currency,
      email: '',
      reference: params.reference,
      callbackUrl: params.callbackUrl,
      metadata: params.metadata,
    });
  }
}
