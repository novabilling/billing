import { BasePaymentProvider } from '../../../providers/base-payment.provider';
import { CollectRequest, ProviderOutcome } from '../types';

/**
 * One-time collections through an existing checkout provider (Stripe,
 * Paystack, Flutterwave, DPO, PayU, Pesapal, PayPal). The payer finishes on
 * the provider's hosted page, choosing card, bank or mobile money where the
 * provider offers them; the result arrives by webhook or status check.
 */
export class HostedCheckout {
  constructor(private readonly provider: BasePaymentProvider) {}

  async collect(request: CollectRequest): Promise<ProviderOutcome> {
    if (request.payer.type !== 'hosted' && request.payer.type !== 'paypal') {
      return { state: 'failed', failureReason: `${this.provider.name} collects through its hosted checkout page; use payer type "hosted"` };
    }
    const result = await this.provider.charge({
      amount: Number(request.amount),
      currency: request.currency,
      email: request.payer.email,
      customerName: request.payer.name,
      reference: request.reference,
      callbackUrl: request.callbackUrl,
      metadata: { reference: request.reference },
    });
    if (!result.success) {
      return { state: 'failed', failureReason: result.error || `${this.provider.name} could not start the checkout` };
    }
    return { state: 'pending', providerTxnId: result.transactionId, paymentUrl: result.paymentUrl, providerStatus: 'CHECKOUT_CREATED' };
  }

  async getCollection(_reference: string, providerTxnId?: string | null): Promise<ProviderOutcome> {
    if (!providerTxnId) return { state: 'pending' };
    const status = await this.provider.getPaymentStatus(providerTxnId);
    return { state: status.status, providerTxnId, providerStatus: status.status.toUpperCase() };
  }
}
