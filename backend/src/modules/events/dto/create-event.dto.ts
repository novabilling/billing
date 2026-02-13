import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'evt_12345', description: 'Unique transaction ID for idempotency' })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({ example: 'sub_abc123', description: 'Subscription ID or external subscription ID' })
  @IsString()
  @IsNotEmpty()
  subscriptionId: string;

  @ApiProperty({ example: 'api_calls', description: 'Billable metric code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ required: false, example: '2026-02-10T12:00:00Z', description: 'Event timestamp (defaults to now)' })
  @IsDateString()
  @IsOptional()
  timestamp?: string;

  @ApiProperty({ required: false, example: { tokens: 1500, region: 'us-east' }, description: 'Event properties' })
  @IsObject()
  @IsOptional()
  properties?: Record<string, any>;
}
