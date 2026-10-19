/**
 * Watch-only USDT on Ethereum and Bitcoin against a real tenant database,
 * with Etherscan, Esplora and the BTC price scripted. See
 * ledger.integration.spec.ts for setup.
 */
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma-tenant/client';
import { MoneyService } from '../../src/modules/money/money.service';
import { EthUsdtAdapter } from '../../src/modules/money/adapters/eth-usdt.adapter';
import { BtcAdapter, deriveAddress } from '../../src/modules/money/adapters/btc.adapter';
import { resetScanThrottle } from '../../src/modules/money/adapters/stablecoin-watch';
import { MoneyProvider } from '../../src/modules/money/types';
import { WalletsService } from '../../src/modules/wallets/wallets.service';
import { createMockQueue } from '../helpers/mock-queue';

const url = process.env.LEDGER_TEST_DATABASE_URL;
const describeDb = url ? describe : describe.skip;

const json = (body: unknown, status = 200) => ({ ok: status < 400, status, json: async () => body }) as unknown as Response;

describeDb('native crypto (postgres)', () => {
  let db: PrismaClient;
  let adapter: MoneyProvider;
  const registry = { get: jest.fn(async () => adapter), pick: jest.fn(async () => adapter.name), assertNetwork: jest.fn() };
  const money = new MoneyService(registry as never, new WalletsService(createMockQueue() as never), { client: {} } as never, createMockQueue() as never);
  const tenant = { id: 't1', settings: { money: { collections: true } } };

  beforeAll(() => {
    db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url! }) });
  });
  afterAll(() => db.$disconnect());
  beforeEach(async () => {
    resetScanThrottle();
    await db.$executeRawUnsafe(`TRUNCATE "MoneyIntent", "CryptoAmountClaim", "CryptoAddressClaim", "CryptoDeposit" CASCADE`);
  });

  describe('USDT on Ethereum', () => {
    const MERCHANT = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed';
    const USDT = '0xdac17f958d2ee523a2206206994597c13d831ec7';
    let rows: Record<string, unknown>[] = [];
    let n = 0;
    const fetch = jest.fn(async (u: string) => {
      expect(u).toContain('action=tokentx');
      return json(rows.length ? { status: '1', message: 'OK', result: [...rows].reverse() } : { status: '0', message: 'No transactions found', result: [] });
    });
    const send = (amount: string, confirmations = 20, to = MERCHANT.toLowerCase()) => {
      const [w, f = ''] = amount.split('.');
      const hash = `0xhash${++n}`;
      rows.push({
        hash,
        timeStamp: String(Math.floor(Date.now() / 1000)),
        from: '0xpayer',
        to,
        value: (BigInt(w) * 1_000_000n + BigInt((f + '000000').slice(0, 6))).toString(),
        tokenDecimal: '6',
        contractAddress: USDT,
        confirmations: String(confirmations),
      });
      return hash;
    };
    const collect = (amount: string) => money.createCollection(db, tenant, { amount, currency: 'USDT', payer: { type: 'crypto', chain: 'ETHEREUM' } });
    const refresh = (id: string) => {
      resetScanThrottle();
      return money.refresh(db, 't1', id);
    };

    beforeEach(() => {
      rows = [];
      adapter = new EthUsdtAdapter({ address: MERCHANT, apiKey: 'k' }, db, fetch as never);
    });

    it('asks for a unique amount and settles once the transfer is 12 blocks deep', async () => {
      const c = await collect('50');
      expect(c.paymentDetails).toMatchObject({ coin: 'USDT', chain: 'ETHEREUM', address: MERCHANT });
      const amount = c.paymentDetails!.amount;
      expect(amount).toMatch(/^50\.00\d{1,2}$/);

      send(amount, 3);
      expect(await refresh(c.id)).toMatchObject({ status: 'processing' });
      rows[0].confirmations = '12';
      expect(await refresh(c.id)).toMatchObject({ status: 'succeeded', providerTransactionId: '0xhash1' });
    });

    it('needs an Etherscan key and a valid address', async () => {
      adapter = new EthUsdtAdapter({ address: MERCHANT, apiKey: '' }, db, fetch as never);
      expect(await collect('5')).toMatchObject({ status: 'failed', failureReason: expect.stringMatching(/Etherscan API key/) });
      adapter = new EthUsdtAdapter({ address: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAeD', apiKey: 'k' }, db, fetch as never);
      expect(await collect('5')).toMatchObject({ status: 'failed', failureReason: expect.stringMatching(/not valid/) });
    });

    it('lets a person assign a deposit, but only one sent to the address the collection asked for', async () => {
      const a = await collect('20');
      const b = await collect('20');
      send('20');
      await refresh(a.id);
      const [deposit] = (await money.listCryptoDeposits(db, { status: 'unmatched' })).data;
      expect(await money.assignCryptoDeposit(db, 't1', deposit.id, b.id)).toMatchObject({ status: 'succeeded' });
    });
  });

  describe('Bitcoin', () => {
    const zpub = 'zpub6rFR7y4Q2AijBEqTUquhVz398htDFrtymD9xYYfG1m4wAcvPhXNfE3EfH1r1ADqtfSdVCToUG868RvUUkgDKf31mGDtKsAYz2oz2AGutZYs';
    let tip = 800_000;
    let txs: Record<string, unknown[]> = {};
    const fetch = jest.fn(async (u: string) => {
      if (u.includes('exchange-rates')) return json({ data: { rates: { UGX: '250000000', USD: '65000' } } });
      if (u.endsWith('/blocks/tip/height')) return json(tip);
      const m = /address\/([^/]+)\/txs/.exec(u);
      if (m) return json(txs[m[1]] ?? []);
      throw new Error(`unexpected ${u}`);
    });
    const pay = (address: string, btc: string, height?: number, blockTime = Math.floor(Date.now() / 1000)) => {
      const [w, f = ''] = btc.split('.');
      const sats = Number(BigInt(w) * 100_000_000n + BigInt((f + '00000000').slice(0, 8)));
      const txid = `txid${Object.values(txs).flat().length + 1}`;
      (txs[address] ??= []).push({
        txid,
        status: height ? { confirmed: true, block_height: height, block_time: blockTime } : { confirmed: false },
        vout: [{ scriptpubkey_address: 'bc1qsomeoneelse', value: 5000 }, { scriptpubkey_address: address, value: sats }],
      });
      return txid;
    };
    const collect = (amount: string) => money.createCollection(db, tenant, { amount, currency: 'UGX', payer: { type: 'crypto', chain: 'BTC' } });

    beforeEach(() => {
      txs = {};
      tip = 800_000;
      adapter = new BtcAdapter({ xpub: zpub }, db, fetch as never);
    });

    it('gives each collection its own address from the merchant key, priced at the quote', async () => {
      const a = await collect('100000');
      const b = await collect('100000');
      expect(a.paymentDetails).toEqual({ kind: 'crypto_address', coin: 'BTC', chain: 'BITCOIN', address: deriveAddress(zpub, 0).address, amount: '0.0004' });
      expect(b.paymentDetails!.address).toBe(deriveAddress(zpub, 1).address);
      expect(a.amount).toBe('100000');
      expect(a.currency).toBe('UGX');
    });

    it('waits for two confirmations, then settles in the merchant currency', async () => {
      const c = await collect('100000');
      const address = c.paymentDetails!.address;
      const txid = pay(address, '0.0004');
      expect(await money.refresh(db, 't1', c.id)).toMatchObject({ status: 'processing', providerStatus: 'CONFIRMING_0.0004_BTC' });

      (txs[address][0] as { status: unknown }).status = { confirmed: true, block_height: 800_000, block_time: Math.floor(Date.now() / 1000) };
      expect(await money.refresh(db, 't1', c.id)).toMatchObject({ status: 'processing' }); // 1 confirmation
      tip = 800_001;
      expect(await money.refresh(db, 't1', c.id)).toMatchObject({ status: 'succeeded', providerTransactionId: txid, providerStatus: 'RECEIVED_0.0004_BTC' });
      const deposit = await db.cryptoDeposit.findFirstOrThrow();
      expect(deposit).toMatchObject({ status: 'MATCHED', rawAmount: '40000', decimals: 8, chain: 'BITCOIN' });
    });

    it('accepts small wallet rounding, holds real underpayments, expires unpaid quotes', async () => {
      const close = await collect('100000');
      pay(close.paymentDetails!.address, '0.000399', 799_990); // 0.25% short
      expect(await money.refresh(db, 't1', close.id)).toMatchObject({ status: 'succeeded' });

      const short = await collect('100000');
      pay(short.paymentDetails!.address, '0.0003', 799_990);
      expect(await money.refresh(db, 't1', short.id)).toMatchObject({ status: 'processing', providerStatus: 'PARTIAL_0.0003_BTC' });
      await db.cryptoAddressClaim.update({ where: { reference: (await db.moneyIntent.findUniqueOrThrow({ where: { id: short.id } })).providerReference! }, data: { expiresAt: new Date(Date.now() - 3600_000) } });
      expect(await money.refresh(db, 't1', short.id)).toMatchObject({ status: 'stuck', failureReason: 'Underpaid: received 0.0003 of 0.0004 BTC' });

      const unpaid = await collect('100000');
      const ref = (await db.moneyIntent.findUniqueOrThrow({ where: { id: unpaid.id } })).providerReference!;
      await db.cryptoAddressClaim.update({ where: { reference: ref }, data: { expiresAt: new Date(Date.now() - 3600_000) } });
      expect(await money.refresh(db, 't1', unpaid.id)).toMatchObject({ status: 'failed', providerStatus: 'EXPIRED' });
    });

    it('reuses an address that expired unpaid a week ago, never one that received money', async () => {
      const paid = await collect('100000');
      pay(paid.paymentDetails!.address, '0.0004', 799_990);
      await money.refresh(db, 't1', paid.id);
      const unpaid = await collect('100000');
      await db.cryptoAddressClaim.updateMany({ data: { expiresAt: new Date(Date.now() - 8 * 24 * 3600_000) } });

      const next = await collect('50000');
      expect(next.paymentDetails!.address).toBe(unpaid.paymentDetails!.address);
      const after = await collect('50000');
      expect(after.paymentDetails!.address).toBe(deriveAddress(zpub, 2).address);
    });

    it('refuses stablecoin or BTC pricing and private keys', async () => {
      expect(await money.createCollection(db, tenant, { amount: '1', currency: 'BTC', payer: { type: 'crypto' } })).toMatchObject({
        status: 'failed',
        failureReason: expect.stringMatching(/own currency/),
      });
      adapter = new BtcAdapter({ xpub: 'xprv9s21ZrQH143K3GJpoapnV8SFfukcVBSfeCficPSGfubmSFDxo1kuHnLisriDvSnRRuL2Qrg5ggqHKNVpxR86QEC8w35uxmGoggxtQTPvfUu' }, db, fetch as never);
      expect(await collect('1000')).toMatchObject({ status: 'failed', failureReason: expect.stringMatching(/extended public key/) });
    });
  });
});
