import {
  IsString,
  IsOptional,
  IsNumber,
  IsObject,
  IsNotEmpty,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletDto {
  @ApiProperty({ example: 'cust_abc123' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ required: false, example: 'Main Wallet' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'USD' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ required: false, example: 1.0, description: '1 credit = rateAmount in currency' })
  @IsNumber()
  @IsOptional()
  @Min(0.0001)
  rateAmount?: number;

  @ApiProperty({ required: false, example: 100, description: 'Paid credits (purchase)' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  paidCredits?: number;

  @ApiProperty({ required: false, example: 10, description: 'Free credits (grant)' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  grantedCredits?: number;

  @ApiProperty({ required: false, description: 'Expiration date (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  expirationAt?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class UpdateWalletDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  expirationAt?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class TopUpWalletDto {
  @ApiProperty({ example: 'wallet_id' })
  @IsString()
  @IsNotEmpty()
  walletId: string;

  @ApiProperty({ required: false, example: 100, description: 'Paid credits to purchase' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  paidCredits?: number;

  @ApiProperty({ required: false, example: 10, description: 'Free credits to grant' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  grantedCredits?: number;

  @ApiProperty({ required: false, example: 25, description: 'Credits to void' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  voidedCredits?: number;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
