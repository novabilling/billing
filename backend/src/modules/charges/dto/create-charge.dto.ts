import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsObject,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum ChargeModel {
  STANDARD = 'STANDARD',
  GRADUATED = 'GRADUATED',
  VOLUME = 'VOLUME',
  PACKAGE = 'PACKAGE',
  PERCENTAGE = 'PERCENTAGE',
}

export enum BillingTiming {
  IN_ADVANCE = 'IN_ADVANCE',
  IN_ARREARS = 'IN_ARREARS',
}

export class GraduatedRangeDto {
  @ApiProperty({ example: 0, description: 'Start of range (inclusive)' })
  @IsNumber()
  fromValue: number;

  @ApiProperty({ required: false, example: 100, description: 'End of range (inclusive), null = infinity' })
  @IsNumber()
  @IsOptional()
  toValue?: number;

  @ApiProperty({ example: 0.10, description: 'Price per unit in this range' })
  @IsNumber()
  perUnitAmount: number;

  @ApiProperty({ required: false, example: 0, description: 'Flat fee for entering this range' })
  @IsNumber()
  @IsOptional()
  flatAmount?: number;
}

export class ChargeFilterDto {
  @ApiProperty({ example: 'region', description: 'Filter key (must match metric filter)' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: ['us-east'], description: 'Subset of allowed values' })
  @IsArray()
  @IsString({ each: true })
  values: string[];

  @ApiProperty({ required: false, description: 'Override properties for this filter' })
  @IsObject()
  @IsOptional()
  properties?: Record<string, any>;
}

export class CreateChargeDto {
  @ApiProperty({ description: 'Plan ID to attach this charge to' })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({ description: 'Billable metric ID' })
  @IsString()
  @IsNotEmpty()
  billableMetricId: string;

  @ApiProperty({ enum: ChargeModel, example: 'STANDARD' })
  @IsEnum(ChargeModel)
  chargeModel: ChargeModel;

  @ApiProperty({ enum: BillingTiming, required: false, default: 'IN_ARREARS' })
  @IsEnum(BillingTiming)
  @IsOptional()
  billingTiming?: BillingTiming;

  @ApiProperty({ required: false, example: 'API Calls', description: 'Display name on invoices' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  invoiceDisplayName?: string;

  @ApiProperty({ required: false, example: 100, description: 'Minimum charge in cents' })
  @IsNumber()
  @IsOptional()
  minAmountCents?: number;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  prorated?: boolean;

  @ApiProperty({
    required: false,
    description: 'Model-specific config. Standard: { amount, currency }. Package: { amount, packageSize, currency }. Percentage: { rate, fixedAmount, freeUnitsPerEvent, freeUnitsPerTotalAggregation }',
    example: { amount: '0.10', currency: 'USD' },
  })
  @IsObject()
  @IsOptional()
  properties?: Record<string, any>;

  @ApiProperty({ required: false, type: [GraduatedRangeDto], description: 'Required for GRADUATED and VOLUME charge models' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GraduatedRangeDto)
  @IsOptional()
  graduatedRanges?: GraduatedRangeDto[];

  @ApiProperty({ required: false, type: [ChargeFilterDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChargeFilterDto)
  @IsOptional()
  filters?: ChargeFilterDto[];
}
