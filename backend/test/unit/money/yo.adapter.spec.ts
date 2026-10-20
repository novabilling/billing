import { createSign, createVerify, generateKeyPairSync } from 'crypto';
import { buildYoRequest, normaliseMsisdn, parseYoResponse, YoAdapter } from '../../../src/modules/money/adapters/yo.adapter';
import { ProviderAmbiguousError } from '../../../src/modules/money/types';

const xml = (fields: Record<string, string>, extra = '') =>
  `<?xml version="1.0" encoding="UTF-8"?><AutoCreate><Response>${Object.entries(fields)
    .map(([k, v]) => `<${k}>${v}</${k}>`)
    .join('')}${extra}</Response></AutoCreate>`;

const reply = (body: string, status = 200) => Promise.resolve({ ok: status < 400, status, text: async () => body } as Response);

const keys = () =>
  generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

const sentFields = (fetchMock: jest.Mock, call = 0) => parseYoRequest(String(fetchMock.mock.calls[call][1].body));
function parseYoRequest(body: string) {
  const fields: Record<string, string> = {};
  for (const m of body.matchAll(/<([A-Za-z0-9]+)>([^<]*)<\/\1>/g)) fields[m[1]] = m[2];
  return fields;
}

describe('YoAdapter', () => {
  const base = { apiUsername: 'user', apiPassword: 'pa&ss', environment: 'sandbox' as const };

  it('builds escaped XML requests and skips empty fields', () => {
    const body = buildYoRequest(base, 'acdepositfunds', { Narrative: 'Fish & <chips>', Empty: '', Missing: undefined });
    expect(body).toContain('<APIPassword>pa&amp;ss</APIPassword>');
    expect(body).toContain('<Narrative>Fish &amp; &lt;chips&gt;</Narrative>');
    expect(body).not.toContain('Empty');
    expect(body).not.toContain('Missing');
  });

  it('parses flat response fields', () => {
    expect(parseYoResponse(xml({ Status: 'OK', StatusCode: '0', TransactionReference: 'A&amp;B' }))).toMatchObject({
      Status: 'OK',
      StatusCode: '0',
      TransactionReference: 'A&B',
    });
  });

  it('normalises Ugandan numbers to international format', () => {
    expect(normaliseMsisdn('0771 234 567')).toBe('256771234567');
    expect(normaliseMsisdn('+256771234567')).toBe('256771234567');
  });

  describe('status mapping', () => {
    const outcomeFor = async (fields: Record<string, string>) => {
      const fetchMock = jest.fn((..._args: any[]) => reply(xml(fields)));
      const yo = new YoAdapter(base, fetchMock as never);
      return yo.collect({ reference: 'col_1', amount: '5000', currency: 'UGX', payer: { type: 'mobile_money', msisdn: '256771234567' }, description: 'x' });
    };

    it('succeeded', async () => {
      expect(await outcomeFor({ Status: 'OK', StatusCode: '0', TransactionStatus: 'SUCCEEDED', TransactionReference: 'T1' })).toMatchObject({
        state: 'succeeded',
        providerTxnId: 'T1',
      });
    });
    it('pending (non-blocking)', async () => {
      expect(await outcomeFor({ Status: 'OK', StatusCode: '1', TransactionStatus: 'PENDING', TransactionReference: 'T2' })).toMatchObject({
        state: 'pending',
        providerTxnId: 'T2',
      });
    });
    it('indeterminate is never treated as failed', async () => {
      expect(await outcomeFor({ Status: 'ERROR', StatusCode: '7', TransactionStatus: 'INDETERMINATE' })).toMatchObject({
        state: 'pending',
        indeterminate: true,
      });
    });
    it('-22 waits for authorisation instead of failing', async () => {
      expect(await outcomeFor({ Status: 'ERROR', StatusCode: '-22', StatusMessage: 'needs auth' })).toMatchObject({
        state: 'pending',
        providerStatus: 'AWAITING_AUTHORIZATION',
      });
    });
    it('negative codes are clean failures', async () => {
      expect(await outcomeFor({ Status: 'ERROR', StatusCode: '-46', StatusMessage: 'Do-Not-Disturb' })).toMatchObject({
        state: 'failed',
        failureReason: 'Do-Not-Disturb',
      });
    });
  });

  it('sends deposits non-blocking with our reference and notification URLs', async () => {
    const fetchMock = jest.fn((..._args: any[]) => reply(xml({ Status: 'OK', StatusCode: '1', TransactionStatus: 'PENDING' })));
    await new YoAdapter(base, fetchMock as never).collect({
      reference: 'col_9',
      amount: '5000',
      currency: 'UGX',
      payer: { type: 'mobile_money', msisdn: '0771234567', network: 'MTN_UGANDA' },
      description: 'Install fee',
      notificationUrl: 'https://api.example.com/webhooks/yo/t1/ipn',
    });
    expect(fetchMock.mock.calls[0][0]).toBe('https://sandbox.yo.co.ug/services/yopaymentsdev/task.php');
    expect(sentFields(fetchMock)).toMatchObject({
      Method: 'acdepositfunds',
      NonBlocking: 'TRUE',
      Account: '256771234567',
      AccountProviderCode: 'MTN_UGANDA',
      ExternalReference: 'col_9',
      InstantNotificationUrl: 'https://api.example.com/webhooks/yo/t1/ipn',
    });
  });

  it('signs withdrawals with RSA-SHA1 over the fields the spec lists', async () => {
    const { privateKey, publicKey } = keys();
    const fetchMock = jest.fn((..._args: any[]) => reply(xml({ Status: 'OK', StatusCode: '1', TransactionStatus: 'PENDING' })));
    await new YoAdapter({ ...base, privateKey }, fetchMock as never).payout({
      reference: 'pay_1',
      amount: '120000',
      currency: 'UGX',
      payee: { type: 'mobile_money', msisdn: '256771234567' },
      description: 'Supplier',
    });
    const sent = sentFields(fetchMock);
    expect(sent.Method).toBe('acwithdrawfunds');
    const signed = `user120000256771234567Supplierpay_1${sent.PublicKeyAuthenticationNonce}`;
    expect(createVerify('RSA-SHA1').update(signed).verify(publicKey, sent.PublicKeyAuthenticationSignatureBase64, 'base64')).toBe(true);
  });

  it('uses a fresh nonce for every withdrawal call', async () => {
    const { privateKey } = keys();
    const fetchMock = jest.fn((..._args: any[]) => reply(xml({ Status: 'OK', StatusCode: '1', TransactionStatus: 'PENDING' })));
    const yo = new YoAdapter({ ...base, privateKey }, fetchMock as never);
    const request = { reference: 'pay_1', amount: '1', currency: 'UGX', payee: { type: 'mobile_money' as const, msisdn: '256771234567' }, description: 'x' };
    await yo.payout(request);
    await yo.payout(request);
    expect(sentFields(fetchMock, 0).PublicKeyAuthenticationNonce).not.toBe(sentFields(fetchMock, 1).PublicKeyAuthenticationNonce);
  });

  it('pays registered bank accounts and checks them with the bank settlement status call', async () => {
    const fetchMock = jest
      .fn()
      .mockImplementationOnce(() => reply(xml({ Status: 'OK', StatusCode: '0', SettlementTransactionIdentifier: 'S1' })))
      .mockImplementationOnce(() => reply(xml({ Status: 'OK', StatusCode: '0', TransactionStatus: 'CAPTURED', SettlementTransactionIdentifier: 'S1' })));
    const yo = new YoAdapter(base, fetchMock as never);
    const submitted = await yo.payout({
      reference: 'pay_b',
      amount: '500000',
      currency: 'UGX',
      payee: { type: 'bank', accountNumber: '0123', accountName: 'Acme Ltd', bankCode: 'STANBIC', transferType: 'EFT' },
      description: 'Settlement',
    });
    expect(sentFields(fetchMock)).toMatchObject({ Method: 'acwithdrawfundstobank', PrivateTransactionReference: 'pay_b', BankAccountIdentifier: 'STANBIC' });
    expect(submitted).toMatchObject({ state: 'pending', providerTxnId: 'S1' });

    const checked = await yo.getPayout('pay_b', 'S1', 'bank');
    expect(sentFields(fetchMock, 1)).toMatchObject({ Method: 'accheckbanksettlementstatus', SettlementTransactionIdentifier: 'S1' });
    expect(checked.state).toBe('succeeded');
  });

  it('looks up transactions by our reference when Yo has not given an id', async () => {
    const fetchMock = jest.fn((..._args: any[]) => reply(xml({ Status: 'ERROR', StatusCode: '-30', StatusMessage: 'not found' })));
    const outcome = await new YoAdapter(base, fetchMock as never).getCollection('col_404', null);
    expect(sentFields(fetchMock)).toMatchObject({ Method: 'actransactioncheckstatus', PrivateTransactionReference: 'col_404' });
    expect(outcome).toMatchObject({ state: 'failed', providerStatus: 'NOT_FOUND' });
  });

  it('reports a lost answer on a money-moving call as ambiguous', async () => {
    const fetchMock = jest.fn((..._args: any[]) => Promise.reject(Object.assign(new Error('timeout'), { name: 'TimeoutError' })));
    await expect(
      new YoAdapter(base, fetchMock as never).payout({
        reference: 'pay_t',
        amount: '1',
        currency: 'UGX',
        payee: { type: 'mobile_money', msisdn: '256771234567' },
        description: 'x',
      }),
    ).rejects.toBeInstanceOf(ProviderAmbiguousError);
  });

  it('fails over to the second live host only when the first was never reached', async () => {
    const refused = Object.assign(new TypeError('fetch failed'), { cause: { code: 'ECONNREFUSED' } });
    const fetchMock = jest
      .fn()
      .mockRejectedValueOnce(refused)
      .mockImplementationOnce(() => reply(xml({ Status: 'OK', StatusCode: '1', TransactionStatus: 'PENDING' })));
    const outcome = await new YoAdapter({ ...base, environment: 'live' }, fetchMock as never).payout({
      reference: 'pay_f',
      amount: '1',
      currency: 'UGX',
      payee: { type: 'mobile_money', msisdn: '256771234567' },
      description: 'x',
    });
    expect(fetchMock.mock.calls.map((c) => c[0])).toEqual([
      'https://paymentsapi1.yo.co.ug/ybs/task.php',
      'https://paymentsapi2.yo.co.ug/ybs/task.php',
    ]);
    expect(outcome.state).toBe('pending');
  });

  it('reads balances per currency code', async () => {
    const fetchMock = jest.fn(() =>
      reply(
        xml(
          { Status: 'OK', StatusCode: '0' },
          '<Balance><Currency><Code>UGX-MTNMM</Code><Balance>150000</Balance></Currency><Currency><Code>UGX-WTLMM</Code><Balance>20000</Balance></Currency></Balance>',
        ),
      ),
    );
    expect(await new YoAdapter(base, fetchMock as never).getBalance()).toEqual({ 'UGX-MTNMM': '150000', 'UGX-WTLMM': '20000' });
  });

  it('verifies notification signatures with the configured Yo public key', () => {
    const { privateKey, publicKey } = keys();
    const body: Record<string, string> = {
      date_time: '2026-10-19 10:00:00',
      amount: '5000',
      narrative: 'Install fee',
      network_ref: 'MTN123',
      external_ref: 'col_9',
      msisdn: '256771234567',
    };
    body.signature = createSign('RSA-SHA1')
      .update('2026-10-19 10:00:005000Install feeMTN123col_9256771234567')
      .sign(privateKey, 'base64');

    const yo = new YoAdapter({ ...base, notificationPublicKey: publicKey });
    expect(yo.verifyPaymentNotification(body)).toBe(true);
    expect(yo.verifyPaymentNotification({ ...body, amount: '9999' })).toBe(false);
    expect(new YoAdapter(base).verifyPaymentNotification(body)).toBe(false);

    const failure = { failed_transaction_reference: 'col_9', transaction_init_date: '2026-10-19 10:00:00' } as Record<string, string>;
    failure.verification = createSign('RSA-SHA1').update('col_92026-10-19 10:00:00').sign(privateKey, 'base64');
    expect(yo.verifyFailureNotification(failure)).toBe(true);
  });
});
