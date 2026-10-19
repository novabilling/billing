import { constants, generateKeyPairSync, privateDecrypt } from 'crypto';
import { clearMtnTokenCache, MtnMomoAdapter, referenceToUuid } from '../../../src/modules/money/adapters/mtn-momo.adapter';
import { AirtelMoneyAdapter, clearAirtelTokenCache } from '../../../src/modules/money/adapters/airtel-money.adapter';
import { detectNetwork, toInternational, toNational } from '../../../src/modules/money/msisdn';
import { ProviderRegistryService } from '../../../src/modules/money/provider-registry.service';
import { ProviderAmbiguousError } from '../../../src/modules/money/types';

const json = (status: number, body: unknown) =>
  Promise.resolve({ ok: status < 400, status, json: async () => body, text: async () => (body === null ? '' : JSON.stringify(body)) } as Response);

const mm = (msisdn: string) => ({ type: 'mobile_money' as const, msisdn });

describe('msisdn helpers', () => {
  it('normalises local and international numbers per market', () => {
    expect(toInternational('0772 123 456', 'UG')).toBe('256772123456');
    expect(toInternational('+256772123456', 'UG')).toBe('256772123456');
    expect(toInternational('0244123456', 'GH')).toBe('233244123456');
    expect(toNational('256752123456', 'UG')).toBe('752123456');
    expect(toNational('0752123456', 'UG')).toBe('752123456');
  });

  it('detects Ugandan networks', () => {
    expect(detectNetwork('0772123456')).toBe('MTN');
    expect(detectNetwork('256392123456')).toBe('MTN');
    expect(detectNetwork('0752123456')).toBe('AIRTEL');
    expect(detectNetwork('0702123456')).toBe('AIRTEL');
    expect(detectNetwork('0712123456')).toBeUndefined();
  });
});

describe('MtnMomoAdapter', () => {
  const creds = {
    environment: 'sandbox' as const,
    targetEnvironment: 'mtnuganda',
    collectionSubscriptionKey: 'col-key',
    collectionApiUser: 'col-user',
    collectionApiKey: 'col-secret',
    disbursementSubscriptionKey: 'dis-key',
    disbursementApiUser: 'dis-user',
    disbursementApiKey: 'dis-secret',
  };
  beforeEach(() => clearMtnTokenCache());

  it('derives a stable UUID v4 from our reference (MTN idempotency key)', () => {
    const a = referenceToUuid('col_abc');
    expect(a).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(referenceToUuid('col_abc')).toBe(a);
    expect(referenceToUuid('col_abd')).not.toBe(a);
  });

  it('requests to pay with the right headers and caches the token', async () => {
    const fetch = jest
      .fn()
      .mockImplementationOnce(() => json(200, { access_token: 'tok', expires_in: 3600 }))
      .mockImplementation(() => json(202, null));
    const mtn = new MtnMomoAdapter(creds, fetch as never);
    const request = { reference: 'col_1', amount: '5000', currency: 'UGX', payer: mm('0772123456'), description: 'Install' };
    const out = await mtn.collect(request);
    await mtn.collect({ ...request, reference: 'col_2' });

    expect(fetch.mock.calls[0][0]).toBe('https://sandbox.momodeveloper.mtn.com/collection/token/');
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe(`Basic ${Buffer.from('col-user:col-secret').toString('base64')}`);
    const [url, init] = fetch.mock.calls[1];
    expect(url).toBe('https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay');
    expect(init.headers).toMatchObject({
      Authorization: 'Bearer tok',
      'X-Target-Environment': 'mtnuganda',
      'Ocp-Apim-Subscription-Key': 'col-key',
      'X-Reference-Id': referenceToUuid('col_1'),
    });
    expect(JSON.parse(init.body)).toMatchObject({ amount: '5000', currency: 'UGX', externalId: 'col_1', payer: { partyId: '256772123456' } });
    expect(out).toMatchObject({ state: 'pending', providerTxnId: referenceToUuid('col_1') });
    expect(fetch).toHaveBeenCalledTimes(3); // one token, two requests
  });

  it('treats a repeated reference (409) as already submitted, never as a failure', async () => {
    const fetch = jest.fn().mockImplementationOnce(() => json(200, { access_token: 't' })).mockImplementationOnce(() => json(409, { code: 'RESOURCE_ALREADY_EXIST' }));
    const out = await new MtnMomoAdapter(creds, fetch as never).payout({ reference: 'pay_1', amount: '1000', currency: 'UGX', payee: mm('256772123456'), description: 'x' });
    expect(fetch.mock.calls[1][0]).toContain('/disbursement/v1_0/transfer');
    expect(out).toMatchObject({ state: 'pending', providerStatus: 'ALREADY_SUBMITTED' });
  });

  it('maps statuses and reports lost answers as ambiguous', async () => {
    const fetch = jest
      .fn()
      .mockImplementationOnce(() => json(200, { access_token: 't' }))
      .mockImplementationOnce(() => json(200, { status: 'SUCCESSFUL', financialTransactionId: '9911' }))
      .mockImplementationOnce(() => json(200, { status: 'FAILED', reason: { code: 'PAYER_NOT_FOUND', message: 'Payer not found' } }))
      .mockImplementationOnce(() => Promise.reject(new Error('socket hang up')));
    const mtn = new MtnMomoAdapter(creds, fetch as never);
    expect(await mtn.getCollection('col_1')).toMatchObject({ state: 'succeeded', providerTxnId: '9911' });
    expect(await mtn.getCollection('col_2')).toMatchObject({ state: 'failed', failureReason: 'PAYER_NOT_FOUND: Payer not found' });
    await expect(mtn.collect({ reference: 'c3', amount: '1', currency: 'UGX', payer: mm('0772123456'), description: 'x' })).rejects.toBeInstanceOf(ProviderAmbiguousError);
  });

  it('reads the registered name for payee checks', async () => {
    const fetch = jest.fn().mockImplementationOnce(() => json(200, { access_token: 't' })).mockImplementationOnce(() => json(200, { given_name: 'Amina', family_name: 'N' }));
    expect(await new MtnMomoAdapter(creds, fetch as never).verifyPayee(mm('0772123456'))).toEqual({ valid: true, name: 'Amina N' });
    expect(fetch.mock.calls[1][0]).toContain('/accountholder/msisdn/256772123456/basicuserinfo');
  });
});

describe('AirtelMoneyAdapter', () => {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  const creds = {
    environment: 'staging' as const,
    clientId: 'cid',
    clientSecret: 'secret',
    country: 'UG',
    currency: 'UGX',
    disbursementPin: '1234',
    encryptionPublicKey: publicKey,
  };
  beforeEach(() => clearAirtelTokenCache());

  it('pushes a collection prompt with national msisdn and market headers', async () => {
    const fetch = jest
      .fn()
      .mockImplementationOnce(() => json(200, { access_token: 'atok', expires_in: 180 }))
      .mockImplementationOnce(() => json(200, { data: { transaction: { id: 'col_1', status: 'Success.' } }, status: { success: true, response_code: 'DP00800001006' } }));
    const out = await new AirtelMoneyAdapter(creds, fetch as never).collect({ reference: 'col_1', amount: '5000', currency: 'UGX', payer: mm('0752123456'), description: 'Install' });
    expect(fetch.mock.calls[0][0]).toBe('https://openapiuat.airtel.africa/auth/oauth2/token');
    const [url, init] = fetch.mock.calls[1];
    expect(url).toBe('https://openapiuat.airtel.africa/merchant/v1/payments/');
    expect(init.headers).toMatchObject({ Authorization: 'Bearer atok', 'X-Country': 'UG', 'X-Currency': 'UGX' });
    expect(JSON.parse(init.body)).toMatchObject({ subscriber: { msisdn: '752123456' }, transaction: { amount: 5000, id: 'col_1' } });
    expect(out.state).toBe('pending');
  });

  it('encrypts the disbursement PIN with Airtel\'s public key', async () => {
    const fetch = jest
      .fn()
      .mockImplementationOnce(() => json(200, { access_token: 't' }))
      .mockImplementationOnce(() => json(200, { data: { transaction: { id: 'pay_1', status: 'TIP' } }, status: { success: true } }));
    await new AirtelMoneyAdapter(creds, fetch as never).payout({ reference: 'pay_1', amount: '1000', currency: 'UGX', payee: mm('256752123456'), description: 'x' });
    const body = JSON.parse(fetch.mock.calls[1][1].body);
    expect(fetch.mock.calls[1][0]).toContain('/standard/v1/disbursements/');
    expect(privateDecrypt({ key: privateKey, padding: constants.RSA_PKCS1_PADDING }, Buffer.from(body.pin, 'base64')).toString()).toBe('1234');
    expect(body.payee.msisdn).toBe('752123456');
  });

  it('maps TS / TF / TA / TIP', async () => {
    const statuses = ['TS', 'TF', 'TA', 'TIP'];
    const fetch = jest.fn().mockImplementationOnce(() => json(200, { access_token: 't' }));
    for (const s of statuses) fetch.mockImplementationOnce(() => json(200, { data: { transaction: { status: s, airtel_money_id: 'AM1' } } }));
    const airtel = new AirtelMoneyAdapter(creds, fetch as never);
    const results = [];
    for (const s of statuses) results.push(await airtel.getCollection(`ref-${s}`));
    expect(results.map((r) => [r.state, Boolean(r.indeterminate)])).toEqual([
      ['succeeded', false],
      ['failed', false],
      ['pending', true],
      ['pending', false],
    ]);
  });

  it('refuses currencies the account does not hold', async () => {
    const fetch = jest.fn().mockImplementationOnce(() => json(200, { access_token: 't' }));
    await expect(
      new AirtelMoneyAdapter(creds, fetch as never).collect({ reference: 'x', amount: '1', currency: 'KES', payer: mm('0752123456'), description: 'x' }),
    ).rejects.toThrow(/works in UGX/);
  });
});

describe('provider routing', () => {
  const registry = new ProviderRegistryService({} as never);
  const configs = ['yo', 'mtn_momo', 'airtel_money'].map((providerName, i) => ({ providerName, isActive: true, priority: i + 1 }));
  const db = { paymentProvider: { findMany: jest.fn().mockResolvedValue(configs) } };

  it('sends each number to its own operator and others to the aggregator', async () => {
    expect(await registry.pick(db as never, 'collect', 'mobile_money', mm('0772123456'))).toBe('mtn_momo');
    expect(await registry.pick(db as never, 'payout', 'mobile_money', mm('0752123456'))).toBe('airtel_money');
    expect(await registry.pick(db as never, 'collect', 'mobile_money', mm('0712123456'))).toBe('yo');
  });

  it('refuses an operator for another network\'s number', () => {
    expect(() => registry.assertNetwork('mtn_momo', mm('0752123456'))).toThrow(/AIRTEL number/);
    expect(() => registry.assertNetwork('yo', mm('0752123456'))).not.toThrow();
  });
});
