import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsNumber,
  IsArray,
  Min,
} from 'class-validator';

export class CreatePlanOverrideDto {
  @ApiProperty({ example: 'clx_customer_123', description: 'Customer ID' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ example: 'clx_plan_456', description: 'Plan ID' })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiPropertyOptional({
    example: [{ currency: 'USD', amount: 49.99 }],
    description: 'Override plan prices: array of { currency, amount }',
  })
  @IsArray()
  @IsOptional()
  overriddenPrices?: Array<{ currency: string; amount: number }>;

  @ApiPropertyOptional({
    example: 500,
    description: 'Override minimum commitment amount',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  overriddenMinimumCommitment?: number;

  @ApiPropertyOptional({
    example: [{ chargeId: 'clx_charge_789', properties: { amount: 0.05 } }],
    description: 'Override charge properties: array of { chargeId, properties?, graduatedRanges? }',
  })
  @IsArray()
  @IsOptional()
  overriddenCharges?: Array<{
    chargeId: string;
    properties?: Record<string, unknown>;
    graduatedRanges?: Array<{
      fromValue: number;
      toValue: number | null;
      perUnitAmount: number;
      flatAmount: number;
    }>;
  }>;

  @ApiPropertyOptional({ description: 'Custom metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class UpdatePlanOverrideDto {
  @ApiPropertyOptional({
    example: [{ currency: 'USD', amount: 39.99 }],
    description: 'Override plan prices',
  })
  @IsArray()
  @IsOptional()
  overriddenPrices?: Array<{ currency: string; amount: number }>;

  @ApiPropertyOptional({
    example: 300,
    description: 'Override minimum commitment amount',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  overriddenMinimumCommitment?: number;

  @ApiPropertyOptional({
    description: 'Override charge properties',
  })
  @IsArray()
  @IsOptional()
  overriddenCharges?: Array<{
    chargeId: string;
    properties?: Record<string, unknown>;
    graduatedRanges?: Array<{
      fromValue: number;
      toValue: number | null;
      perUnitAmount: number;
      flatAmount: number;
    }>;
  }>;

  @ApiPropertyOptional({ description: 'Custom metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
