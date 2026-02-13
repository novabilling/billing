import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMeta } from '../../../common/dto/pagination.dto';

export class CustomerResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty({ example: 'user_12345' })
  externalId: string;

  @ApiProperty({ example: 'customer@example.com' })
  email: string;

  @ApiPropertyOptional({ example: 'Jane Doe' })
  name?: string;

  @ApiPropertyOptional({ example: 'US' })
  country?: string;

  @ApiProperty({ example: 'USD' })
  currency: string;

  @ApiPropertyOptional({ additionalProperties: true })
  metadata?: Record<string, any>;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class PaginatedCustomerResponse {
  @ApiProperty({ type: [CustomerResponse] })
  data: CustomerResponse[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}
