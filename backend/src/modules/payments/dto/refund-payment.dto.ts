import { IsOptional, IsNumber, IsString, Min } from 'class-validator';
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
}
