import { IsString, IsOptional, IsEnum, IsNumber, Min, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCreditNoteDto {
  @ApiProperty({ description: 'Invoice ID to credit against' })
  @IsString()
  invoiceId: string;

  @ApiProperty({ description: 'Customer ID' })
  @IsString()
  customerId: string;

  @ApiProperty({ description: 'Credit amount', example: 25000 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Currency', example: 'UGX' })
  @IsString()
  currency: string;

  @ApiProperty({ enum: ['DUPLICATE', 'PRODUCT_UNSATISFACTORY', 'ORDER_CHANGE', 'OTHER'] })
  @IsEnum(['DUPLICATE', 'PRODUCT_UNSATISFACTORY', 'ORDER_CHANGE', 'OTHER'] as const)
  reason: 'DUPLICATE' | 'PRODUCT_UNSATISFACTORY' | 'ORDER_CHANGE' | 'OTHER';

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class UpdateCreditNoteDto {
  @ApiPropertyOptional({ description: 'Updated amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({ enum: ['DUPLICATE', 'PRODUCT_UNSATISFACTORY', 'ORDER_CHANGE', 'OTHER'] })
  @IsOptional()
  @IsEnum(['DUPLICATE', 'PRODUCT_UNSATISFACTORY', 'ORDER_CHANGE', 'OTHER'] as const)
  reason?: 'DUPLICATE' | 'PRODUCT_UNSATISFACTORY' | 'ORDER_CHANGE' | 'OTHER';

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
