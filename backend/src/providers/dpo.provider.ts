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

interface DpoCredentials {
  companyToken: string;
  serviceType: string;
  environment: 'test' | 'live';
}

export class DpoProvider extends BasePaymentProvider {
  readonly name = 'dpo';
  private readonly logger = new Logger(DpoProvider.name);
  private readonly credentials: DpoCredentials;

  constructor(credentials: DpoCredentials) {
    super();
    this.credentials = credentials;
  }

  private get baseUrl(): string {
    return this.credentials.environment === 'live'
      ? 'https://secure.3gdirectpay.com'
      : 'https://secure.3gdirectpay.com';
  }

  async charge(params: ChargeParams): Promise<PaymentResult> {
    try {
      // Create payment token (transaction)
      const [firstName, ...rest] = (params.customerName || '').split(' ');
      const lastName = rest.join(' ') || '';

      const createTokenXml = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${this.credentials.companyToken}</CompanyToken>
  <Request>createToken</Request>
  <Transaction>
    <PaymentAmount>${params.amount}</PaymentAmount>
    <PaymentCurrency>${params.currency}</PaymentCurrency>
    <CompanyRef>${params.reference}</CompanyRef>
    <RedirectURL>${params.callbackUrl || ''}</RedirectURL>
    <BackURL>${params.callbackUrl || ''}</BackURL>
    <CompanyRefUnique>1</CompanyRefUnique>
    <PTL>5</PTL>
    <customerEmail>${params.email}</customerEmail>
    ${firstName ? `<customerFirstName>${firstName}</customerFirstName>` : ''}
    ${lastName ? `<customerLastName>${lastName}</customerLastName>` : ''}
  </Transaction>
  <Services>
    <Service>
      <ServiceType>${this.credentials.serviceType}</ServiceType>
      <ServiceDescription>Payment for ${params.reference}</ServiceDescription>
      <ServiceDate>${new Date().toISOString().split('T')[0]}</ServiceDate>
    </Service>
  </Services>
</API3G>`;

      const response = await fetch(`${this.baseUrl}/API/v6/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/xml' },
        body: createTokenXml,
      });

      const xmlText = await response.text();

      // Parse XML response (simple extraction)
      const resultMatch = xmlText.match(/<Result>(.*?)<\/Result>/);
      const tokenMatch = xmlText.match(/<TransToken>(.*?)<\/TransToken>/);
      const resultExplanationMatch = xmlText.match(/<ResultExplanation>(.*?)<\/ResultExplanation>/);

      const result = resultMatch?.[1];
      const transToken = tokenMatch?.[1];

      if (result === '000' && transToken) {
        return {
          success: true,
          paymentUrl: `${this.baseUrl}/payv2.php?ID=${transToken}`,
          transactionId: transToken,
        };
      }

      return {
        success: false,
        error: resultExplanationMatch?.[1] || 'Transaction creation failed',
      };
    } catch (error) {
      this.logger.error('DPO charge failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async refund(params: RefundParams): Promise<RefundResult> {
    try {
      const refundXml = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${this.credentials.companyToken}</CompanyToken>
  <Request>refundToken</Request>
  <TransactionToken>${params.transactionId}</TransactionToken>
  <refundAmount>${params.amount || ''}</refundAmount>
  <refundDetails>Refund request</refundDetails>
</API3G>`;

      const response = await fetch(`${this.baseUrl}/API/v6/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/xml' },
        body: refundXml,
      });

      const xmlText = await response.text();
      const resultMatch = xmlText.match(/<Result>(.*?)<\/Result>/);

      if (resultMatch?.[1] === '000') {
        return { success: true, refundId: params.transactionId };
      }

      return { success: false, error: 'Refund failed' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund failed',
      };
    }
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentStatusResult> {
    const verifyXml = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${this.credentials.companyToken}</CompanyToken>
  <Request>verifyToken</Request>
  <TransactionToken>${transactionId}</TransactionToken>
</API3G>`;

    const response = await fetch(`${this.baseUrl}/API/v6/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: verifyXml,
    });

    const xmlText = await response.text();
    const resultMatch = xmlText.match(/<Result>(.*?)<\/Result>/);
    const amountMatch = xmlText.match(/<TransactionAmount>(.*?)<\/TransactionAmount>/);
    const currencyMatch = xmlText.match(/<TransactionCurrency>(.*?)<\/TransactionCurrency>/);
    const approvalMatch = xmlText.match(/<TransactionApproval>(.*?)<\/TransactionApproval>/);

    let status: 'succeeded' | 'pending' | 'failed' = 'pending';
    if (resultMatch?.[1] === '000' && approvalMatch?.[1] === '00') {
      status = 'succeeded';
    } else if (resultMatch?.[1] === '000') {
      status = 'pending';
    } else {
      status = 'failed';
    }

    return {
      status,
      transactionId,
      amount: parseFloat(amountMatch?.[1] || '0'),
      currency: currencyMatch?.[1] || '',
    };
  }

  async handleWebhook(payload: Record<string, unknown>, _signature: string): Promise<WebhookData> {
    // DPO sends XML webhooks - parse the payload
    const transToken = String(payload.TransToken || payload.transToken || '');
    const companyRef = String(payload.CompanyRef || payload.companyRef || '');

    // Verify token status
    const status = await this.getPaymentStatus(transToken);

    const result: WebhookData = {
      status: status.status === 'succeeded' ? 'succeeded' : 'failed',
      transactionId: transToken,
      amount: status.amount,
      currency: status.currency,
      invoiceId: companyRef,
    };

    return result;
  }

  async testConnection(): Promise<boolean> {
    try {
      // Test with a minimal verify request (will fail but confirms API access)
      const testXml = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${this.credentials.companyToken}</CompanyToken>
  <Request>verifyToken</Request>
  <TransactionToken>test</TransactionToken>
</API3G>`;

      const response = await fetch(`${this.baseUrl}/API/v6/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/xml' },
        body: testXml,
      });

      const xmlText = await response.text();
      // If we get a valid XML response (even an error), connection works
      return xmlText.includes('<API3G>');
    } catch {
      return false;
    }
  }

  // DPO does NOT support merchant-initiated recurring billing.
  // TransTokens are single-use (per-transaction) and chargeTokenAuth is for
  // auth/capture settlement only. Each payment requires a new customer redirect.
}
