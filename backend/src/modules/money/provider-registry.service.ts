import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { CHECKOUT_PROVIDER_NAMES, ProviderFactory } from '../../providers/provider.factory';
import { EncryptionService } from '../../services/encryption.service';
import { FlutterwavePayouts } from './adapters/flutterwave-payout.adapter';
import { HostedCheckout } from './adapters/hosted-checkout.adapter';
import { YoAdapter, YoCredentials } from './adapters/yo.adapter';
import { Capabilities, MoneyProvider, Rail } from './types';

/** Providers that only move money (no invoice checkout). */
export const MONEY_ONLY_PROVIDERS = ['yo'];

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
    return this.build(name, JSON.parse(this.encryption.decrypt(config.credentials)));
  }

  /** Every active provider with what it can do. */
  async list(db: PrismaClient): Promise<{ provider: string; capabilities: Capabilities }[]> {
    const configs = await db.paymentProvider.findMany({ where: { isActive: true }, orderBy: { priority: 'asc' } });
    return configs
      .filter((c) => [...CHECKOUT_PROVIDER_NAMES, ...MONEY_ONLY_PROVIDERS].includes(c.providerName.toLowerCase()))
      .map((c) => ({ provider: c.providerName.toLowerCase(), capabilities: this.capabilitiesOf(c.providerName.toLowerCase()) }));
  }

  /** First active provider, by priority, that supports this rail. */
  async pick(db: PrismaClient, kind: 'collect' | 'payout', rail: Rail): Promise<string> {
    const match = (await this.list(db)).find((p) => p.capabilities[kind].includes(rail));
    if (!match) {
      throw new BadRequestException(
        `No configured provider can ${kind === 'collect' ? 'collect from' : 'pay out to'} ${rail.replace('_', ' ')}`,
      );
    }
    return match.provider;
  }

  capabilitiesOf(name: string): Capabilities {
    if (name === 'yo') {
      return { collect: ['mobile_money'], payout: ['mobile_money', 'bank', 'yo_account'], balance: true, verifyPayee: true };
    }
    const hosted: Rail[] = name === 'paypal' ? ['hosted', 'paypal'] : ['hosted'];
    if (name === 'flutterwave') {
      return { collect: hosted, payout: ['bank', 'mobile_money'], balance: false, verifyPayee: false };
    }
    return { collect: hosted, payout: [], balance: false, verifyPayee: false };
  }

  build(name: string, credentials: Record<string, unknown>): MoneyProvider {
    if (name === 'yo') {
      return new YoAdapter(credentials as unknown as YoCredentials);
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
