import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsInt,
  IsNumber,
  Min,
  Max,
  ValidateNested,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreatePlanPriceDto } from './create-plan-price.dto';

export enum BillingInterval {
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export enum BillingTiming {
  IN_ADVANCE = 'IN_ADVANCE',
  IN_ARREARS = 'IN_ARREARS',
}

export class CreatePlanDto {
  @ApiProperty({ example: 'Premium Monthly' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'premium_monthly', description: 'Unique plan code (lowercase, underscores)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9_]+$/, { message: 'Code must contain only lowercase letters, numbers, and underscores' })
  code: string;

  @ApiProperty({ required: false, example: 'Premium plan with all features' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ enum: BillingInterval, example: 'MONTHLY' })
  @IsEnum(BillingInterval)
  billingInterval: BillingInterval;

  @ApiProperty({
    enum: BillingTiming,
    example: 'IN_ARREARS',
    required: false,
    description: 'When to charge: IN_ADVANCE (at period start) or IN_ARREARS (at period end). Defaults to IN_ARREARS.'
  })
  @IsEnum(BillingTiming)
  @IsOptional()
  billingTiming?: BillingTiming;

  @ApiProperty({ required: false, example: ['Unlimited users', 'Priority support'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @ApiProperty({ required: false, type: [CreatePlanPriceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePlanPriceDto)
  @IsOptional()
  prices?: CreatePlanPriceDto[];

  @ApiProperty({ required: false, example: 30, description: 'Net payment terms in days (overrides org default)' })
  @IsInt()
  @Min(0)
  @Max(365)
  @IsOptional()
  netPaymentTerms?: number;

  @ApiProperty({ required: false, example: 3, description: 'Grace period in days before draft invoices are finalized' })
  @IsInt()
  @Min(0)
  @Max(90)
  @IsOptional()
  invoiceGracePeriodDays?: number;

  @ApiProperty({ required: false, example: 1000, description: 'Usage cost threshold for mid-cycle progressive billing invoices' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  progressiveBillingThreshold?: number;
}
