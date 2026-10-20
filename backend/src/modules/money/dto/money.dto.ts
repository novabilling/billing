import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsEmail, IsObject, IsOptional, IsString, IsUrl, Length, MaxLength, ValidateNested } from 'class-validator';

const PARTY_DOC =
  'One of: { type: "mobile_money", msisdn, network?, name? } · { type: "bank", accountNumber, accountName, bankCode?, ' +
  'bankName?, country?, transferType? } · { type: "paypal", email } · { type: "yo_account", accountNumber, email } · ' +
  '{ type: "hosted", email, name? } (payer finishes on the provider\'s checkout page).';

export class CreateCollectionDto {
  @ApiProperty({ example: '50000', description: 'Amount in major units, e.g. "50000" UGX or "19.99" USD' })
  @IsDefined()
  amount!: string | number;

  @ApiProperty({ example: 'UGX' })
  @IsString()
  @Length(3, 3)
  currency!: string;

  @ApiProperty({ example: { type: 'mobile_money', msisdn: '256771234567' }, description: PARTY_DOC })
  @IsObject()
  payer!: Record<string, unknown>;

  @ApiPropertyOptional({ example: 'yo', description: 'Provider to use; defaults to the first configured one that supports the payer type' })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional({ example: 'Order #1042' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({ example: 'order-1042', description: 'Your reference. Reusing it returns the original collection instead of charging again.' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  reference?: string;

  @ApiPropertyOptional({ description: 'Customer this collection belongs to' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiPropertyOptional({ description: 'Credit this wallet with the amount once paid' })
  @IsOptional()
  @IsString()
  walletId?: string;

  @ApiPropertyOptional({ description: 'Where the provider sends the payer after a hosted checkout' })
  @IsOptional()
  @IsUrl({ require_tld: false })
  returnUrl?: string;

  @ApiPropertyOptional({
    example: { pinId: 'dg524fhsgfde', pin: '123456' },
    description: 'Code the payer received after POST /money/providers/{provider}/otp, where the provider asks for one (Eversend)',
  })
  @IsOptional()
  @IsObject()
  otp?: { pinId: string; pin: string };

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class CreatePayoutDto {
  @ApiProperty({ example: '120000' })
  @IsDefined()
  amount!: string | number;

  @ApiProperty({ example: 'UGX' })
  @IsString()
  @Length(3, 3)
  currency!: string;

  @ApiProperty({ example: { type: 'mobile_money', msisdn: '256771234567', name: 'Amina N' }, description: PARTY_DOC })
  @IsObject()
  payee!: Record<string, unknown>;

  @ApiPropertyOptional({ example: 'flutterwave' })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional({ example: 'Supplier invoice 77' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({ example: 'supplier-77', description: 'Your reference. Reusing it returns the original payout instead of paying twice.' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  reference?: string;

  @ApiPropertyOptional({ description: 'Pay out of this customer wallet (the amount is held immediately)' })
  @IsOptional()
  @IsString()
  walletId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class CreateTransferDto {
  @ApiProperty()
  @IsString()
  fromWalletId!: string;

  @ApiProperty()
  @IsString()
  toWalletId!: string;

  @ApiProperty({ example: '20000' })
  @IsDefined()
  amount!: string | number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({ description: 'Your reference. Reusing it returns the original transfer.' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  reference?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class UpdateMoneySettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  collections?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  transfers?: boolean;

  @ApiPropertyOptional({ example: { UGX: '1000000' }, description: 'Payouts at or above these amounts wait for approval' })
  @IsOptional()
  @IsObject()
  payoutApprovalThreshold?: Record<string, string>;

  @ApiPropertyOptional({ example: { UGX: '10000000' }, description: 'Maximum payouts per currency per UTC day' })
  @IsOptional()
  @IsObject()
  payoutDailyLimit?: Record<string, string>;
}

export class VerifyPayeeDto {
  @ApiProperty({ example: { type: 'mobile_money', msisdn: '256771234567' } })
  @IsObject()
  payee!: Record<string, unknown>;
}

export class AssignDepositDto {
  @ApiProperty({ description: 'Open USDT on TRON collection this deposit pays' })
  @IsString()
  collectionId!: string;
}

export class ManagedBankDto {
  @ApiProperty({ example: '044', description: 'Bank code from Flutterwave\'s bank list for the country' })
  @IsString()
  @Length(2, 20)
  code!: string;

  @ApiProperty({ example: '0690000031' })
  @IsString()
  @Length(5, 34)
  accountNumber!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  accountName?: string;
}

export class OpenManagedAccountDto {
  @ApiProperty({ example: 'Rapcio Ltd' })
  @IsString()
  @Length(2, 120)
  businessName!: string;

  @ApiProperty({ example: 'finance@rapcio.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '+256700000001' })
  @IsString()
  @Length(9, 16)
  phone!: string;

  @ApiProperty({ example: 'UG' })
  @IsString()
  @Length(2, 2)
  country!: string;

  @ApiProperty({ example: 'UGX', description: 'Currency the bank account settles in' })
  @IsString()
  @Length(3, 3)
  currency!: string;

  @ApiProperty({ type: ManagedBankDto })
  @ValidateNested()
  @Type(() => ManagedBankDto)
  bank!: ManagedBankDto;
}

export class RequestOtpDto {
  @ApiProperty({ example: '256771234567', description: 'Payer mobile number in international format' })
  @IsString()
  @Length(9, 16)
  phone!: string;
}
