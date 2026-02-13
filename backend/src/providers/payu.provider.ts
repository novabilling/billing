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

interface PayUCredentials {
  apiKey: string;
  safeKey: string;
  environment: 'staging' | 'production';
}

export class PayUProvider extends BasePaymentProvider {
  readonly name = 'payu';
  private readonly logger = new Logger(PayUProvider.name);
  private readonly credentials: PayUCredentials;

  constructor(credentials: PayUCredentials) {
    super();
    this.credentials = credentials;
  }

  private get baseUrl(): string {
    return this.credentials.environment === 'production'
      ? 'https://secure.payu.co.za/api'
      : 'https://staging.payu.co.za/api';
  }

  private get paymentUrl(): string {
    return this.credentials.environment === 'production'
      ? 'https://secure.payu.co.za/rpp.do'
      : 'https://staging.payu.co.za/rpp.do';
  }

  async charge(params: ChargeParams): Promise<PaymentResult> {
    try {
      // Create payment redirect
      const reference = params.reference;
      const amount = Math.round(params.amount * 100); // PayU uses cents

      const [firstName, ...rest] = (params.customerName || '').split(' ');
      const lastName = rest.join(' ') || '';

      // Build redirect form data
      const formParams: Record<string, string> = {
        safekey: this.credentials.safeKey,
        merchantReference: reference,
        amount: amount.toString(),
        currencyCode: params.currency,
        'basket.description': `Payment for ${reference}`,
        'basket.amountInCents': amount.toString(),
        'basket.currencyCode': params.currency,
        'customer.email': params.email,
        returnUrl: params.callbackUrl || '',
        cancelUrl: params.callbackUrl || '',
        notifyUrl: params.callbackUrl || '',
      };

      if (firstName) formParams['customer.firstName'] = firstName;
      if (lastName) formParams['customer.lastName'] = lastName;

      const formData = new URLSearchParams(formParams);

      // For redirect-based payment, we don't make an API call here
      // Instead, we return the payment URL with parameters
      return {
        success: true,
        paymentUrl: `${this.paymentUrl}?${formData.toString()}`,
        transactionId: reference,
      };
    } catch (error) {
      this.logger.error('PayU charge failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async refund(params: RefundParams): Promise<RefundResult> {
    try {
      const response = await fetch(`${this.baseUrl}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Api: this.credentials.apiKey,
          Safekey: this.credentials.safeKey,
          MerchantReference: params.transactionId,
          Amount: params.amount ? Math.round(params.amount * 100) : undefined,
        }),
      });

      const data = await response.json();

      if (data.return?.successful === true) {
        return { success: true, refundId: data.return?.payUReference };
      }

      return {
        success: false,
        error: data.return?.displayMessage || 'Refund failed',
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
      const response = await fetch(`${this.baseUrl}/getTransaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Api: this.credentials.apiKey,
          Safekey: this.credentials.safeKey,
          MerchantReference: transactionId,
        }),
      });

      const data = await response.json();
      const txData = data.return;

      let status: 'succeeded' | 'pending' | 'failed' = 'pending';
      if (txData?.transactionState === 'SUCCESSFUL') {
        status = 'succeeded';
      } else if (
        txData?.transactionState === 'FAILED' ||
        txData?.transactionState === 'CANCELLED'
      ) {
        status = 'failed';
      }

      return {
        status,
        transactionId: txData?.payUReference || transactionId,
        amount: (txData?.basket?.amountInCents || 0) / 100,
        currency: txData?.basket?.currencyCode || '',
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
    // PayU IPN (Instant Payment Notification)
    const merchantReference = String(payload.MerchantReference || '');
    const transactionState = String(payload.TransactionState || '');
    const amountInCents = Number(payload.AmountInCents || 0);
    const currencyCode = String(payload.CurrencyCode || '');
    const payUReference = String(payload.PayUReference || '');

    const result: WebhookData = {
      status: transactionState === 'SUCCESSFUL' ? 'succeeded' : 'failed',
      transactionId: payUReference,
      amount: amountInCents / 100,
      currency: currencyCode,
      invoiceId: merchantReference,
    };

    return result;
  }

  async testConnection(): Promise<boolean> {
    try {
      // Test with a simple lookup (will fail but confirms API access)
      const response = await fetch(`${this.baseUrl}/getTransaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Api: this.credentials.apiKey,
          Safekey: this.credentials.safeKey,
          MerchantReference: 'test_connection',
        }),
      });

      const data = await response.json();
      // If we get a response structure (even an error), connection works
      return data.return !== undefined;
    } catch {
      return false;
    }
  }

  // PayU SA recurring billing requires the Enterprise SOAP API with
  // storePaymentMethod, AuthenticationType=TOKEN, and processingType=REAL_TIME_RECURRING.
  // Our current integration uses the simpler RPP (Redirect Payment Page) which does not
  // support merchant-initiated recurring. Each payment requires a new customer redirect.
  // TODO: Implement SOAP-based Enterprise API for recurring support.
}
