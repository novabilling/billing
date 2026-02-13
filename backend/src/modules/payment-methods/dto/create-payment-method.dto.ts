import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsInt, Min, Max } from 'class-validator';

export enum PaymentMethodType {
  CARD = 'CARD',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  WALLET = 'WALLET',
}

export class CreatePaymentMethodDto {
  @ApiProperty({ example: 'cus_abc123' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ example: 'stripe', description: 'Payment provider (stripe, paystack, flutterwave, dpo, payu, pesapal)' })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({ enum: PaymentMethodType, example: 'CARD', required: false })
  @IsEnum(PaymentMethodType)
  @IsOptional()
  type?: PaymentMethodType;

  @ApiProperty({ example: 'pm_abc123', description: 'Provider-specific token/payment method ID' })
  @IsString()
  @IsNotEmpty()
  tokenId: string;

  @ApiProperty({ example: '4242', required: false })
  @IsString()
  @IsOptional()
  last4?: string;

  @ApiProperty({ example: 'visa', required: false })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ example: 12, required: false })
  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  expMonth?: number;

  @ApiProperty({ example: 2028, required: false })
  @IsInt()
  @Min(2024)
  @IsOptional()
  expYear?: number;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  cardholderName?: string;

  @ApiProperty({ example: 'US', required: false })
  @IsString()
  @IsOptional()
  country?: string;
}
