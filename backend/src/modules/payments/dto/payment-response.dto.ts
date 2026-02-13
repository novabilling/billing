import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMeta } from '../../../common/dto/pagination.dto';

export class PaymentResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty({ example: 'clxinv123' })
  invoiceId: string;

  @ApiProperty({ example: 'paystack' })
  provider: string;

  @ApiPropertyOptional({ example: 'PAY_txn_abc123' })
  providerTransactionId?: string;

  @ApiProperty({ example: '99.9900', description: 'Decimal amount as string' })
  amount: string;

  @ApiProperty({ example: 'USD' })
  currency: string;

  @ApiProperty({ example: 'SUCCEEDED', enum: ['PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'REFUNDED'] })
  status: string;

  @ApiPropertyOptional({ example: 'Insufficient funds' })
  failureReason?: string;

  @ApiPropertyOptional({ additionalProperties: true })
  metadata?: Record<string, any>;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class PaginatedPaymentResponse {
  @ApiProperty({ type: [PaymentResponse] })
  data: PaymentResponse[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}
