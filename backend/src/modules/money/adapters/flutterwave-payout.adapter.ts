import { Party, PayoutRequest, ProviderAmbiguousError, ProviderOutcome } from '../types';

const BASE_URL = 'https://api.flutterwave.com/v3';
const TIMEOUT_MS = 30_000;

/**
 * Flutterwave Transfers (v3) for bank and mobile money payouts. Ported from
 * NovaPay's disburse(), generalised from mobile money only to any payee.
 * The transfer request is never retried automatically: Flutterwave rejects a
 * reused reference, and a lost response is reported as ambiguous.
 */
export class FlutterwavePayouts {
  constructor(
    private readonly secretKey: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async payout(request: PayoutRequest): Promise<ProviderOutcome> {
    const destination = this.destination(request.payee);
    if (!destination) {
      return { state: 'failed', failureReason: `Flutterwave cannot pay out to ${request.payee.type}` };
    }

    let response: Response;
    try {
      response = await this.fetchImpl(`${BASE_URL}/transfers`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({
          ...destination,
          amount: Number(request.amount),
          currency: request.currency,
          debit_currency: request.currency,
          narration: request.description.slice(0, 100),
          reference: request.reference,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      throw new ProviderAmbiguousError(`No answer from Flutterwave: ${error instanceof Error ? error.message : error}`);
    }

    const body = (await response.json().catch(() => null)) as {
      status?: string;
      message?: string;
      data?: { id?: number | string; status?: string; complete_message?: string; fee?: number };
    } | null;
    if (!body) throw new ProviderAmbiguousError(`Unreadable Flutterwave response (HTTP ${response.status})`);
    if (response.status >= 500) throw new ProviderAmbiguousError(`Flutterwave HTTP ${response.status}: ${body.message ?? ''}`);

    if (body.status === 'success' && body.data) {
      return this.mapTransfer(body.data);
    }
    return { state: 'failed', failureReason: body.message || 'Flutterwave refused the transfer' };
  }

  async getPayout(_reference: string, providerTxnId?: string | null): Promise<ProviderOutcome> {
    if (!providerTxnId) {
      return { state: 'pending', indeterminate: true, failureReason: 'No Flutterwave transfer id to check' };
    }
    const response = await this.fetchImpl(`${BASE_URL}/transfers/${encodeURIComponent(providerTxnId)}`, {
      headers: this.headers(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const body = (await response.json().catch(() => ({}))) as { data?: { id?: number | string; status?: string; complete_message?: string; fee?: number } };
    if (!response.ok || !body.data) {
      return { state: 'pending', providerStatus: `HTTP_${response.status}`, providerTxnId };
    }
    return this.mapTransfer(body.data);
  }

  private mapTransfer(data: { id?: number | string; status?: string; complete_message?: string; fee?: number }): ProviderOutcome {
    const status = String(data.status ?? '').toUpperCase();
    return {
      state: status === 'SUCCESSFUL' ? 'succeeded' : status === 'FAILED' ? 'failed' : 'pending',
      providerStatus: status,
      providerTxnId: data.id !== undefined ? String(data.id) : undefined,
      fee: typeof data.fee === 'number' ? data.fee : undefined,
      ...(status === 'FAILED' && { failureReason: data.complete_message || 'Transfer failed' }),
    };
  }

  private destination(payee: Party): Record<string, string> | null {
    switch (payee.type) {
      case 'bank':
        if (!payee.bankCode) return null;
        return {
          account_bank: payee.bankCode,
          account_number: payee.accountNumber,
          beneficiary_name: payee.accountName,
        };
      case 'mobile_money':
        // Flutterwave routes mobile money transfers through the "MPS" bank code.
        return {
          account_bank: 'MPS',
          account_number: payee.msisdn.replace(/[^\d]/g, ''),
          ...(payee.name && { beneficiary_name: payee.name }),
        };
      default:
        return null;
    }
  }

  private headers() {
    return { Authorization: `Bearer ${this.secretKey}`, 'Content-Type': 'application/json' };
  }
}
