import { ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';

/**
 * Who pays (collections) or who is paid (payouts), for the API docs and SDKs.
 * Requests are still checked by parseParty in party.ts; keep the two in step
 * with Party in types.ts.
 */
export class MobileMoneyParty {
  @ApiProperty({ enum: ['mobile_money'] })
  type: 'mobile_money';

  @ApiProperty({ example: '256771234567', description: 'International format, digits only' })
  msisdn: string;

  @ApiPropertyOptional({ example: 'MTN', description: 'Detected from the number when left out' })
  network?: string;

  @ApiPropertyOptional({ example: 'Amina Nakato' })
  name?: string;
}

export class BankParty {
  @ApiProperty({ enum: ['bank'] })
  type: 'bank';

  @ApiProperty({ example: '0123456789' })
  accountNumber: string;

  @ApiProperty({ example: 'Amina Nakato' })
  accountName: string;

  @ApiPropertyOptional({ example: '044' })
  bankCode?: string;

  @ApiPropertyOptional({ example: 'Stanbic Bank' })
  bankName?: string;

  @ApiPropertyOptional({ example: 'UG' })
  country?: string;

  @ApiPropertyOptional({ enum: ['RTGS', 'EFT', 'TT'] })
  transferType?: 'RTGS' | 'EFT' | 'TT';

  @ApiPropertyOptional({
    example: '256771234567',
    description: "Account holder's phone; some providers (Eversend) require it",
  })
  phone?: string;
}

export class PaypalParty {
  @ApiProperty({ enum: ['paypal'] })
  type: 'paypal';

  @ApiProperty({ example: 'amina@example.com' })
  email: string;

  @ApiPropertyOptional()
  name?: string;
}

export class YoAccountParty {
  @ApiProperty({ enum: ['yo_account'] })
  type: 'yo_account';

  @ApiProperty({ example: '100123456789' })
  accountNumber: string;

  @ApiProperty({ example: 'amina@example.com' })
  email: string;

  @ApiPropertyOptional()
  name?: string;
}

/** The payer finishes on the provider's checkout page (card, bank or mobile money). */
export class HostedParty {
  @ApiProperty({ enum: ['hosted'] })
  type: 'hosted';

  @ApiProperty({ example: 'amina@example.com' })
  email: string;

  @ApiPropertyOptional()
  name?: string;
}

export class CryptoParty {
  @ApiProperty({ enum: ['crypto'] })
  type: 'crypto';

  @ApiPropertyOptional({ example: 'amina@example.com' })
  email?: string;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'USDT',
    description: 'Coin to pay in, when it differs from the currency',
  })
  payCurrency?: string;

  @ApiPropertyOptional({ example: 'tron', description: 'tron, ethereum, bsc or bitcoin' })
  chain?: string;
}

export const PARTY_MODELS = [
  MobileMoneyParty,
  BankParty,
  PaypalParty,
  YoAccountParty,
  HostedParty,
  CryptoParty,
];

/**
 * The Party schema: one of the party types, told apart by `type`. Nest cannot
 * describe a union class, so buildOpenApiDocument registers it under this
 * name, and payer and payee properties refer to it.
 */
export const PARTY_SCHEMA_NAME = 'Party';
export const PARTY_SCHEMA = {
  description: 'Who pays (collections) or who is paid (payouts), told apart by `type`',
  oneOf: PARTY_MODELS.map((m) => ({ $ref: getSchemaPath(m) })),
};

/** For a payer or payee property. */
export const partySchema = { $ref: getSchemaPath(PARTY_SCHEMA_NAME) };

export class PayerOtpDto {
  @ApiProperty({
    example: 'dg524fhsgfde',
    description: 'pinId returned by POST /money/providers/{provider}/otp',
  })
  pinId: string;

  @ApiProperty({ example: '123456', description: 'The code the payer received' })
  pin: string;
}
