import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsObject,
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
}
