import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Invoice ID this payment is for' })
  @IsString()
  @IsNotEmpty()
  invoiceId: string;

  @ApiProperty({ description: 'Payment provider name (e.g. stripe, paystack, manual)', example: 'manual' })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({ description: 'Payment amount', example: 49.99 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Currency', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: 'Payment status', enum: ['PROCESSING', 'SUCCEEDED', 'FAILED', 'REFUNDED'] })
  @IsEnum(['PROCESSING', 'SUCCEEDED', 'FAILED', 'REFUNDED'] as const)
  status: 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED';

  @ApiPropertyOptional({ description: 'Provider transaction ID' })
  @IsOptional()
  @IsString()
  providerTransactionId?: string;

  @ApiPropertyOptional({ description: 'Failure reason (for FAILED payments)' })
  @IsOptional()
  @IsString()
  failureReason?: string;

  @ApiPropertyOptional({ description: 'Backdate createdAt (ISO 8601). For data imports.' })
  @IsOptional()
  @IsDateString()
  createdAt?: string;
}
