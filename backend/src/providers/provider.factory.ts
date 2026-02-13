import { BasePaymentProvider } from './base-payment.provider';
import { FlutterwaveProvider } from './flutterwave.provider';
import { PaystackProvider } from './paystack.provider';
import { StripeProvider } from './stripe.provider';
import { DpoProvider } from './dpo.provider';
import { PayUProvider } from './payu.provider';
import { PesapalProvider } from './pesapal.provider';

export class ProviderFactory {
  static create(providerName: string, credentials: Record<string, unknown>): BasePaymentProvider {
    switch (providerName.toLowerCase()) {
      case 'stripe':
        return new StripeProvider(
          credentials as { secretKey: string; webhookSecret: string },
        );
      case 'paystack':
        return new PaystackProvider(credentials as { publicKey: string; secretKey: string });
      case 'flutterwave':
        return new FlutterwaveProvider(
          credentials as { publicKey: string; secretKey: string; encryptionKey: string },
        );
      case 'dpo':
      case 'dpo-group':
        return new DpoProvider(
          credentials as { companyToken: string; serviceType: string; environment: 'test' | 'live' },
        );
      case 'payu':
        return new PayUProvider(
          credentials as { apiKey: string; safeKey: string; environment: 'staging' | 'production' },
        );
      case 'pesapal':
        return new PesapalProvider(
          credentials as { consumerKey: string; consumerSecret: string; environment: 'sandbox' | 'live' },
        );
      default:
        throw new Error(`Unsupported payment provider: ${providerName}`);
    }
  }
}
