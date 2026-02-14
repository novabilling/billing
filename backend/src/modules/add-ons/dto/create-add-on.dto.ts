import { IsString, IsOptional, IsArray, IsDateString, ValidateNested, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AddOnPriceDto {
  @ApiProperty({ description: 'ISO 4217 currency code', example: 'UGX' })
  @IsString()
  currency: string;

  @ApiProperty({ description: 'Price amount', example: 50000 })
  @IsNumber()
  @Min(0)
  amount: number;
}

export class CreateAddOnDto {
  @ApiProperty({ description: 'Display name', example: 'Premium Support' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Unique code for the add-on', example: 'premium_support' })
  @IsString()
  code: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Custom name shown on invoices' })
  @IsOptional()
  @IsString()
  invoiceDisplayName?: string;

  @ApiProperty({ description: 'Prices in different currencies', type: [AddOnPriceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddOnPriceDto)
  prices: AddOnPriceDto[];

  @ApiPropertyOptional({ description: 'Backdate createdAt (ISO 8601). For data imports.' })
  @IsOptional()
  @IsDateString()
  createdAt?: string;
}

export class UpdateAddOnDto {
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
  @IsString()
  invoiceDisplayName?: string;

  @ApiPropertyOptional({ type: [AddOnPriceDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddOnPriceDto)
  prices?: AddOnPriceDto[];
}

export class ApplyAddOnDto {
  @ApiProperty({ description: 'Add-on ID' })
  @IsString()
  addOnId: string;

  @ApiProperty({ description: 'Customer ID' })
  @IsString()
  customerId: string;

  @ApiPropertyOptional({ description: 'Subscription to attach the charge to' })
  @IsOptional()
  @IsString()
  subscriptionId?: string;

  @ApiProperty({ description: 'Charge amount', example: 50000 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Currency', example: 'UGX' })
  @IsString()
  currency: string;
}
