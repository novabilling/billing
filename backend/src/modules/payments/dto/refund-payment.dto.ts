import { IsBoolean, IsOptional, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefundPaymentDto {
  @ApiProperty({ required: false, description: 'Amount to refund (full refund if omitted)' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  amount?: number;

  @ApiProperty({ required: false, description: 'Reason for refund' })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({
    required: false,
    description:
      'Record a refund that was already made outside the system (no call to the payment provider). ' +
      'Payments recorded with the "manual" provider are always record-only.',
  })
  @IsBoolean()
  @IsOptional()
  recordOnly?: boolean;
}
