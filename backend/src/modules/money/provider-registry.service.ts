import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { CHECKOUT_PROVIDER_NAMES, ProviderFactory } from '../../providers/provider.factory';
import { EncryptionService } from '../../services/encryption.service';
import { FlutterwavePayouts } from './adapters/flutterwave-payout.adapter';
import { HostedCheckout } from './adapters/hosted-checkout.adapter';
import { YoAdapter, YoCredentials } from './adapters/yo.adapter';
import { MtnMomoAdapter, MtnMomoCredentials } from './adapters/mtn-momo.adapter';
import { AirtelMoneyAdapter, AirtelMoneyCredentials } from './adapters/airtel-money.adapter';
import { NowPaymentsAdapter, NowPaymentsCredentials } from './adapters/nowpayments.adapter';
import { EVERSEND_COINS, EversendAdapter, EversendCredentials } from './adapters/eversend.adapter';
import { TronUsdtAdapter, TronUsdtCredentials } from './adapters/tron-usdt.adapter';
import { detectNetwork } from './msisdn';
import { Capabilities, MoneyProvider, Party, Rail } from './types';

/** Providers that only move money (no invoice checkout). */
export const MONEY_ONLY_PROVIDERS = ['yo', 'mtn_momo', 'airtel_money', 'nowpayments', 'eversend', 'tron_usdt'];

/** Crypto providers that collect in the stablecoin itself rather than at a fiat price. */
const STABLECOIN_PROVIDERS: Record<string, { coins: string[]; chains?: string[] }> = {
  eversend: { coins: EVERSEND_COINS },
  tron_usdt: { coins: ['USDT'], chains: ['TRON', 'TRC20', 'TRX'] },
};

/** Operator APIs that only serve their own network's subscribers. */
const NETWORK_PROVIDERS: Record<string, 'MTN' | 'AIRTEL'> = { mtn_momo: 'MTN', airtel_money: 'AIRTEL' };

/**
 * Builds a MoneyProvider for one of the tenant's configured providers,
 * combining what each integration supports.
 */
@Injectable()
export class ProviderRegistryService {
  constructor(private readonly encryption: EncryptionService) {}

  async get(db: PrismaClient, providerName: string): Promise<MoneyProvider> {
    const name = providerName.toLowerCase();
    const config = await db.paymentProvider.findFirst({ where: { providerName: name, isActive: true } });
    if (!config) {
      throw new BadRequestException(`The ${name} provider is not configured or is inactive`);
    }
    return this.build(name, JSON.parse(this.encryption.decrypt(config.credentials)), db);
  }

  /** Every active provider with what it can do. */
  async list(db: PrismaClient): Promise<{ provider: string; capabilities: Capabilities }[]> {
    const configs = await db.paymentProvider.findMany({ where: { isActive: true }, orderBy: { priority: 'asc' } });
    return configs
      .filter((c) => [...CHECKOUT_PROVIDER_NAMES, ...MONEY_ONLY_PROVIDERS].includes(c.providerName.toLowerCase()))
      .map((c) => ({ provider: c.providerName.toLowerCase(), capabilities: this.capabilitiesOf(c.providerName.toLowerCase()) }));
  }

  /**
   * First active provider, by priority, that supports this rail. For mobile
   * money, an operator's own API (MTN, Airtel) is only chosen for its own
   * subscribers, and is preferred over aggregators for them. For crypto,
   * stablecoin providers (Eversend, USDT on TRON) only take collections in
   * their coins (and chains) and NOWPayments only fiat-priced ones, so the
   * currency decides.
   */
  async pick(db: PrismaClient, kind: 'collect' | 'payout', rail: Rail, party?: Party, currency?: string): Promise<string> {
    let candidates = (await this.list(db)).filter((p) => p.capabilities[kind].includes(rail));
    if (rail === 'crypto' && currency) {
      const coin = currency.toUpperCase();
      const chain = party?.type === 'crypto' ? party.chain : undefined;
      candidates = candidates.filter((p) => {
        const s = STABLECOIN_PROVIDERS[p.provider];
        if (!s) return ![...EVERSEND_COINS, 'USDT'].includes(coin);
        return s.coins.includes(coin) && (!chain || !s.chains || s.chains.includes(chain));
      });
    }
    if (rail === 'mobile_money' && party?.type === 'mobile_money') {
      const network = (party.network?.toUpperCase().startsWith('MTN') ? 'MTN' : party.network?.toUpperCase().startsWith('AIRTEL') ? 'AIRTEL' : undefined) ?? detectNetwork(party.msisdn);
      candidates = candidates.filter((p) => !NETWORK_PROVIDERS[p.provider] || NETWORK_PROVIDERS[p.provider] === network);
      const direct = candidates.find((p) => NETWORK_PROVIDERS[p.provider] === network);
      if (direct) candidates = [direct];
    }
    const match = candidates[0];
    if (!match) {
      throw new BadRequestException(
        `No configured provider can ${kind === 'collect' ? 'collect from' : 'pay out to'} ${rail.replace('_', ' ')}`,
      );
    }
    return match.provider;
  }

  /** Refuse to send an MTN number to Airtel's API or the other way round. */
  assertNetwork(provider: string, party: Party) {
    const expected = NETWORK_PROVIDERS[provider];
    if (!expected || party.type !== 'mobile_money') return;
    const detected = detectNetwork(party.msisdn);
    if (detected && detected !== expected) {
      throw new BadRequestException(`${party.msisdn} looks like an ${detected} number; ${provider} only serves ${expected} subscribers`);
    }
  }

  capabilitiesOf(name: string): Capabilities {
    if (name === 'nowpayments') {
      return { collect: ['crypto'], payout: [], balance: false, verifyPayee: false };
    }
    if (name === 'tron_usdt') {
      return { collect: ['crypto'], payout: [], balance: false, verifyPayee: false };
    }
    if (name === 'eversend') {
      return { collect: ['mobile_money', 'crypto'], payout: ['mobile_money', 'bank'], balance: true, verifyPayee: false };
    }
    if (name === 'mtn_momo' || name === 'airtel_money') {
      return { collect: ['mobile_money'], payout: ['mobile_money'], balance: true, verifyPayee: true };
    }
    if (name === 'yo') {
      return { collect: ['mobile_money'], payout: ['mobile_money', 'bank', 'yo_account'], balance: true, verifyPayee: true };
    }
    const hosted: Rail[] = name === 'paypal' ? ['hosted', 'paypal'] : ['hosted'];
    if (name === 'flutterwave') {
      return { collect: hosted, payout: ['bank', 'mobile_money'], balance: false, verifyPayee: false };
    }
    return { collect: hosted, payout: [], balance: false, verifyPayee: false };
  }

  build(name: string, credentials: Record<string, unknown>, db?: PrismaClient): MoneyProvider {
    if (name === 'yo') {
      return new YoAdapter(credentials as unknown as YoCredentials);
    }
    if (name === 'mtn_momo') {
      return new MtnMomoAdapter(credentials as unknown as MtnMomoCredentials);
    }
    if (name === 'airtel_money') {
      return new AirtelMoneyAdapter(credentials as unknown as AirtelMoneyCredentials);
    }
    if (name === 'nowpayments') {
      return new NowPaymentsAdapter(credentials as unknown as NowPaymentsCredentials);
    }
    if (name === 'eversend') {
      return new EversendAdapter(credentials as unknown as EversendCredentials);
    }
    if (name === 'tron_usdt') {
      if (!db) throw new Error('USDT on TRON needs the tenant database');
      return new TronUsdtAdapter(credentials as unknown as TronUsdtCredentials, db);
    }

    const checkout = new HostedCheckout(ProviderFactory.create(name, credentials));
    const provider: MoneyProvider = {
      name,
      capabilities: this.capabilitiesOf(name),
      collect: (request) => checkout.collect(request),
      getCollection: (reference, txn) => checkout.getCollection(reference, txn),
    };
    if (name === 'flutterwave') {
      const payouts = new FlutterwavePayouts(String(credentials.secretKey ?? ''));
      provider.payout = (request) => payouts.payout(request);
      provider.getPayout = (reference, txn) => payouts.getPayout(reference, txn);
    }
    return provider;
  }

  /** The Yo adapter for verifying notifications, or null when Yo is not configured. */
  async yo(db: PrismaClient): Promise<YoAdapter | null> {
    const config = await db.paymentProvider.findFirst({ where: { providerName: 'yo', isActive: true } });
    if (!config) return null;
    return new YoAdapter(JSON.parse(this.encryption.decrypt(config.credentials)) as YoCredentials);
  }
}
