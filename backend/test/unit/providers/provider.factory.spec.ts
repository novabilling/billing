import { ProviderFactory } from '../../../src/providers/provider.factory';
import { FlutterwaveProvider } from '../../../src/providers/flutterwave.provider';
import { PaystackProvider } from '../../../src/providers/paystack.provider';
import { StripeProvider } from '../../../src/providers/stripe.provider';

describe('ProviderFactory', () => {
  it('should create a FlutterwaveProvider', () => {
    const provider = ProviderFactory.create('flutterwave', {
      publicKey: 'pk_test',
      secretKey: 'sk_test',
      encryptionKey: 'ek_test',
    });

    expect(provider).toBeInstanceOf(FlutterwaveProvider);
    expect(provider.name).toBe('flutterwave');
  });

  it('should create a PaystackProvider', () => {
    const provider = ProviderFactory.create('paystack', {
      publicKey: 'pk_test',
      secretKey: 'sk_test',
    });

    expect(provider).toBeInstanceOf(PaystackProvider);
    expect(provider.name).toBe('paystack');
  });

  it('should create a StripeProvider', () => {
    const provider = ProviderFactory.create('stripe', {
      secretKey: 'sk_test',
      webhookSecret: 'whsec_test',
    });

    expect(provider).toBeInstanceOf(StripeProvider);
    expect(provider.name).toBe('stripe');
  });

  it('should throw for unsupported provider', () => {
    expect(() =>
      ProviderFactory.create('unknown_provider', {}),
    ).toThrow('Unsupported payment provider: unknown_provider');
  });

  it('should handle case-insensitive provider names', () => {
    const provider = ProviderFactory.create('Flutterwave', {
      publicKey: 'pk_test',
      secretKey: 'sk_test',
      encryptionKey: 'ek_test',
    });

    expect(provider).toBeInstanceOf(FlutterwaveProvider);
  });
});
