import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMeta } from '../../../common/dto/pagination.dto';

export class TaxResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty({ example: 'VAT' })
  name: string;

  @ApiProperty({ example: 'vat_18' })
  code: string;

  @ApiProperty({ example: '18.0000' })
  rate: string;

  @ApiPropertyOptional({ example: 'Value Added Tax' })
  description?: string;

  @ApiProperty({ example: true })
  appliedByDefault: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class PaginatedTaxResponse {
  @ApiProperty({ type: [TaxResponse] })
  data: TaxResponse[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}
