import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMeta } from '../../../common/dto/pagination.dto';

export class AddOnPriceResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty()
  addOnId: string;

  @ApiProperty({ example: 'USD' })
  currency: string;

  @ApiProperty({ example: '29.9900', description: 'Decimal amount as string' })
  amount: string;
}

export class AddOnResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty({ example: 'Extra Storage' })
  name: string;

  @ApiProperty({ example: 'extra_storage' })
  code: string;

  @ApiPropertyOptional({ example: '50GB additional storage' })
  description?: string;

  @ApiPropertyOptional({ example: 'Storage Add-On' })
  invoiceDisplayName?: string;

  @ApiProperty({ type: [AddOnPriceResponse] })
  prices: AddOnPriceResponse[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class AppliedAddOnResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  addOnId: string;

  @ApiProperty()
  customerId: string;

  @ApiPropertyOptional()
  subscriptionId?: string;

  @ApiProperty({ example: '29.9900' })
  amount: string;

  @ApiProperty({ example: 'USD' })
  currency: string;

  @ApiPropertyOptional()
  invoiceId?: string;

  @ApiProperty()
  createdAt: string;
}

export class PaginatedAddOnResponse {
  @ApiProperty({ type: [AddOnResponse] })
  data: AddOnResponse[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}
