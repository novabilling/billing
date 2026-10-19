import { BadRequestException } from '@nestjs/common';
import { Party } from './types';

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/**
 * Validate a payer or payee. Request bodies arrive as plain JSON, so the
 * discriminated union is checked here rather than with DTO decorators.
 */
export function parseParty(raw: unknown, role: 'payer' | 'payee'): Party {
  if (!raw || typeof raw !== 'object') {
    throw new BadRequestException(`${role} is required`);
  }
  const p = raw as Record<string, unknown>;
  const need = (field: string) => {
    const value = str(p[field]);
    if (!value) throw new BadRequestException(`${role}.${field} is required for ${String(p.type)}`);
    return value;
  };
  const email = (field = 'email') => {
    const value = need(field);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new BadRequestException(`${role}.${field} must be an email address`);
    return value;
  };
  const optional = (field: string) => str(p[field]) || undefined;

  switch (p.type) {
    case 'mobile_money': {
      const msisdn = need('msisdn').replace(/[\s-]/g, '');
      if (!/^\+?\d{9,15}$/.test(msisdn)) {
        throw new BadRequestException(`${role}.msisdn must be a phone number in international format, e.g. 256771234567`);
      }
      return { type: 'mobile_money', msisdn: msisdn.replace(/^\+/, ''), network: optional('network'), name: optional('name') };
    }
    case 'bank': {
      const transferType = optional('transferType');
      if (transferType && !['RTGS', 'EFT', 'TT'].includes(transferType)) {
        throw new BadRequestException(`${role}.transferType must be RTGS, EFT or TT`);
      }
      const phone = optional('phone');
      if (phone && !/^\+?\d{9,15}$/.test(phone.replace(/[\s-]/g, ''))) {
        throw new BadRequestException(`${role}.phone must be a phone number in international format`);
      }
      return {
        type: 'bank',
        accountNumber: need('accountNumber'),
        accountName: need('accountName'),
        bankCode: optional('bankCode'),
        bankName: optional('bankName'),
        country: optional('country'),
        transferType: transferType as 'RTGS' | 'EFT' | 'TT' | undefined,
        phone: phone ? phone.replace(/[\s-]/g, '').replace(/^\+/, '') : undefined,
      };
    }
    case 'paypal':
      return { type: 'paypal', email: email(), name: optional('name') };
    case 'yo_account':
      return { type: 'yo_account', accountNumber: need('accountNumber'), email: email(), name: optional('name') };
    case 'hosted':
      return { type: 'hosted', email: email(), name: optional('name') };
    case 'crypto': {
      const payCurrency = optional('payCurrency');
      if (payCurrency && !/^[a-z0-9]{2,20}$/i.test(payCurrency)) {
        throw new BadRequestException(`${role}.payCurrency must be a coin code such as "btc" or "usdttrc20"`);
      }
      const chain = optional('chain');
      if (chain && !/^[a-z0-9 _-]{2,30}$/i.test(chain)) {
        throw new BadRequestException(`${role}.chain must be a network name such as "TRON" or "ETH"`);
      }
      return {
        type: 'crypto',
        email: str(p.email) ? email() : undefined,
        name: optional('name'),
        payCurrency: payCurrency?.toLowerCase(),
        chain: chain?.toUpperCase(),
      };
    }
    default:
      throw new BadRequestException(`${role}.type must be one of mobile_money, bank, paypal, yo_account, hosted, crypto`);
  }
}
