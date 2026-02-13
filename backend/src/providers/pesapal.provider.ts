import { Logger } from '@nestjs/common';
import {
  BasePaymentProvider,
  ChargeParams,
  PaymentResult,
  RefundParams,
  RefundResult,
  PaymentStatusResult,
  WebhookData,
} from './base-payment.provider';

interface PesapalCredentials {
  consumerKey: string;
  consumerSecret: string;
  environment: 'sandbox' | 'live';
}

interface PesapalAuthResponse {
  token: string;
  expiryDate: string;
}

export class PesapalProvider extends BasePaymentProvider {
  readonly name = 'pesapal';
  private readonly logger = new Logger(PesapalProvider.name);
  private readonly credentials: PesapalCredentials;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(credentials: PesapalCredentials) {
    super();
    this.credentials = credentials;
  }

  private get baseUrl(): string {
    return this.credentials.environment === 'live'
      ? 'https://pay.pesapal.com/v3'
      : 'https://cybqa.pesapal.com/pesapalv3';
  }

  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    const response = await fetch(`${this.baseUrl}/api/Auth/RequestToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        consumer_key: this.credentials.consumerKey,
        consumer_secret: this.credentials.consumerSecret,
      }),
    });

    const data = (await response.json()) as PesapalAuthResponse;
    this.accessToken = data.token;
    this.tokenExpiry = new Date(data.expiryDate);

    return this.accessToken;
  }

  async charge(params: ChargeParams): Promise<PaymentResult> {
    try {
      const token = await this.getAccessToken();

      // Submit order request
      const orderResponse = await fetch(`${this.baseUrl}/api/Transactions/SubmitOrderRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: params.reference,
          currency: params.currency,
          amount: params.amount,
          description: `Payment for ${params.reference}`,
          callback_url: params.callbackUrl || '',
          notification_id: '',
          billing_address: {
            email_address: params.email,
            ...(params.customerName && {
              first_name: params.customerName.split(' ')[0],
              last_name: params.customerName.split(' ').slice(1).join(' ') || undefined,
            }),
          },
        }),
      });

      const data = await orderResponse.json();

      if (data.status === '200' && data.order_tracking_id) {
        return {
          success: true,
          paymentUrl: data.redirect_url,
          transactionId: data.order_tracking_id,
        };
      }

      return {
        success: false,
        error: data.message || data.error?.message || 'Order submission failed',
      };
    } catch (error) {
      this.logger.error('Pesapal charge failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async refund(params: RefundParams): Promise<RefundResult> {
    try {
      const token = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/api/Transactions/RefundRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          confirmation_code: params.transactionId,
          amount: params.amount,
          username: 'system', // Required field
          remarks: 'Refund request',
        }),
      });

      const data = await response.json();

      if (data.status === '200') {
        return { success: true, refundId: data.refund_request_id };
      }

      return {
        success: false,
        error: data.message || 'Refund failed',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund failed',
      };
    }
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentStatusResult> {
    try {
      const token = await this.getAccessToken();

      const response = await fetch(
        `${this.baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      let status: 'succeeded' | 'pending' | 'failed' = 'pending';
      if (data.payment_status_description === 'Completed') {
        status = 'succeeded';
      } else if (
        data.payment_status_description === 'Failed' ||
        data.payment_status_description === 'Invalid'
      ) {
        status = 'failed';
      }

      return {
        status,
        transactionId: data.confirmation_code || transactionId,
        amount: data.amount || 0,
        currency: data.currency || '',
      };
    } catch {
      return {
        status: 'pending',
        transactionId,
        amount: 0,
        currency: '',
      };
    }
  }

  async handleWebhook(payload: Record<string, unknown>, _signature: string): Promise<WebhookData> {
    // Pesapal IPN sends OrderTrackingId - we need to fetch the status
    const orderTrackingId = String(payload.OrderTrackingId || '');
    const orderMerchantReference = String(payload.OrderMerchantReference || '');

    if (orderTrackingId) {
      const status = await this.getPaymentStatus(orderTrackingId);

      const result: WebhookData = {
        status: status.status === 'succeeded' ? 'succeeded' : 'failed',
        transactionId: orderTrackingId,
        amount: status.amount,
        currency: status.currency,
        invoiceId: orderMerchantReference,
      };

      return result;
    }

    // Fallback if webhook doesn't provide tracking ID
    return {
      status: 'failed',
      transactionId: '',
      amount: 0,
      currency: '',
      invoiceId: orderMerchantReference,
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

  // Pesapal does NOT support merchant-initiated recurring billing.
  // Their recurring model is customer-controlled: the customer opts in on the payment
  // iframe and Pesapal manages the schedule internally. There is no API to charge a
  // saved card on demand. Each ad-hoc payment requires a new customer redirect.
}
