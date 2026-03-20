import { ProviderFactory } from '../../../src/providers/provider.factory';
import { FlutterwaveProvider } from '../../../src/providers/flutterwave.provider';
import { PaystackProvider } from '../../../src/providers/paystack.provider';
import { StripeProvider } from '../../../src/providers/stripe.provider';
import { PayPalProvider } from '../../../src/providers/paypal.provider';
import { PesapalProvider } from '../../../src/providers/pesapal.provider';

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

  it('should create a PayPalProvider', () => {
    const provider = ProviderFactory.create('paypal', {
      clientId: 'client_id_test',
      clientSecret: 'client_secret_test',
      webhookId: 'webhook_id_test',
      environment: 'sandbox',
    });

    expect(provider).toBeInstanceOf(PayPalProvider);
    expect(provider.name).toBe('paypal');
  });

  it('should create a PayPalProvider with case-insensitive name', () => {
    const provider = ProviderFactory.create('PayPal', {
      clientId: 'client_id_test',
      clientSecret: 'client_secret_test',
      webhookId: 'webhook_id_test',
      environment: 'live',
    });

    expect(provider).toBeInstanceOf(PayPalProvider);
    expect(provider.name).toBe('paypal');
  });

  it('should create a PesapalProvider', () => {
    const provider = ProviderFactory.create('pesapal', {
      consumerKey: 'ck_test',
      consumerSecret: 'cs_test',
      environment: 'sandbox',
      ipnId: 'test-ipn-uuid',
    });

    expect(provider).toBeInstanceOf(PesapalProvider);
    expect(provider.name).toBe('pesapal');
  });

  it('should create a PesapalProvider without ipnId', () => {
    const provider = ProviderFactory.create('pesapal', {
      consumerKey: 'ck_test',
      consumerSecret: 'cs_test',
      environment: 'live',
    });

    expect(provider).toBeInstanceOf(PesapalProvider);
    expect(provider.name).toBe('pesapal');
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
