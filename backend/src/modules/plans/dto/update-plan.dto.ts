import { IsString, IsOptional, IsEnum, IsArray, IsBoolean, IsInt, IsNumber, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BillingInterval, BillingTiming } from './create-plan.dto';

export class UpdatePlanDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ required: false, enum: BillingInterval })
  @IsEnum(BillingInterval)
  @IsOptional()
  billingInterval?: BillingInterval;

  @ApiProperty({ required: false, enum: BillingTiming, description: 'When to charge: IN_ADVANCE or IN_ARREARS' })
  @IsEnum(BillingTiming)
  @IsOptional()
  billingTiming?: BillingTiming;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: false, example: 30, description: 'Net payment terms in days' })
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

  @ApiProperty({ required: false, example: 1000, description: 'Usage cost threshold for progressive billing' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  progressiveBillingThreshold?: number;
}
