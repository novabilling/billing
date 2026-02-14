import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsObject,
  IsDateString,
  IsEnum,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'Customer ID' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ description: 'Plan ID' })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({ example: 'NGN', description: 'Currency for billing' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(3)
  currency: string;

  @ApiProperty({ required: false, example: 14, description: 'Number of trial days' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(365)
  trialDays?: number;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;

  // --- Backdating fields (for data imports) ---

  @ApiProperty({ required: false, description: 'Override subscription start date (ISO 8601). Defaults to now.' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ required: false, description: 'Override current period end (ISO 8601). Defaults to calculated from startDate + billing interval.' })
  @IsDateString()
  @IsOptional()
  currentPeriodEnd?: string;

  @ApiProperty({ required: false, description: 'Override subscription status for imports', enum: ['ACTIVE', 'TRIALING', 'PAUSED', 'PAST_DUE', 'CANCELED'] })
  @IsEnum(['ACTIVE', 'TRIALING', 'PAUSED', 'PAST_DUE', 'CANCELED'] as const)
  @IsOptional()
  status?: 'ACTIVE' | 'TRIALING' | 'PAUSED' | 'PAST_DUE' | 'CANCELED';

  @ApiProperty({ required: false, description: 'Backdate createdAt (ISO 8601). For data imports.' })
  @IsDateString()
  @IsOptional()
  createdAt?: string;

  @ApiProperty({ required: false, description: 'External ID for linking to external systems' })
  @IsString()
  @IsOptional()
  externalId?: string;

  @ApiProperty({ required: false, description: 'Canceled at date (ISO 8601). For importing canceled subscriptions.' })
  @IsDateString()
  @IsOptional()
  canceledAt?: string;
}
