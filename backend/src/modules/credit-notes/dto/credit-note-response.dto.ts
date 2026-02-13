import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMeta } from '../../../common/dto/pagination.dto';

export class CreditNoteResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty({ example: 'clxinv123' })
  invoiceId: string;

  @ApiProperty({ example: 'clxcust123' })
  customerId: string;

  @ApiProperty({ example: '50.0000', description: 'Decimal amount as string' })
  amount: string;

  @ApiProperty({ example: 'USD' })
  currency: string;

  @ApiProperty({ example: 'ORDER_CHANGE', enum: ['DUPLICATE', 'PRODUCT_UNSATISFACTORY', 'ORDER_CHANGE', 'OTHER'] })
  reason: string;

  @ApiProperty({ example: 'DRAFT', enum: ['DRAFT', 'FINALIZED', 'VOIDED'] })
  status: string;

  @ApiPropertyOptional({ additionalProperties: true })
  metadata?: Record<string, any>;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class PaginatedCreditNoteResponse {
  @ApiProperty({ type: [CreditNoteResponse] })
  data: CreditNoteResponse[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}
