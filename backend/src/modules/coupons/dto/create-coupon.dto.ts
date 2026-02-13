import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsArray, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCouponDto {
  @ApiProperty({ description: 'Unique coupon code', example: 'WELCOME20' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Display name', example: '20% Welcome Discount' })
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ['PERCENTAGE', 'FIXED_AMOUNT'] })
  @IsEnum(['PERCENTAGE', 'FIXED_AMOUNT'] as const)
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';

  @ApiProperty({ description: 'Discount value (percentage 0-100 or fixed amount)', example: 20 })
  @IsNumber()
  @Min(0)
  discountValue: number;

  @ApiPropertyOptional({ description: 'Currency for FIXED_AMOUNT discounts' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ description: 'Max number of redemptions (null = unlimited)' })
  @IsOptional()
  @IsNumber()
  maxRedemptions?: number;

  @ApiPropertyOptional({ description: 'Plan IDs this coupon applies to (empty = all)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  appliesToPlanIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class ApplyCouponDto {
  @ApiProperty()
  @IsString()
  couponId: string;

  @ApiProperty()
  @IsString()
  customerId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subscriptionId?: string;

  @ApiPropertyOptional({ description: 'Number of billing cycles to apply (null = forever)' })
  @IsOptional()
  @IsNumber()
  usesRemaining?: number;
}

export class UpdateCouponDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
