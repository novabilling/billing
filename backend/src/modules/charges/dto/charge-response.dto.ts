import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChargeGraduatedRangeResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty()
  chargeId: string;

  @ApiProperty({ example: 0 })
  fromValue: number;

  @ApiPropertyOptional({ example: 1000 })
  toValue?: number;

  @ApiProperty({ example: '0.0100', description: 'Per-unit amount as decimal string' })
  perUnitAmount: string;

  @ApiProperty({ example: '0.0000', description: 'Flat fee for this range' })
  flatAmount: string;

  @ApiProperty({ example: 0 })
  order: number;
}

export class ChargeFilterResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty()
  chargeId: string;

  @ApiProperty({ example: 'region' })
  key: string;

  @ApiProperty({ example: ['us-east'], type: [String] })
  values: string[];

  @ApiPropertyOptional({ additionalProperties: true })
  properties?: Record<string, any>;
}

export class ChargeResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty({ example: 'clxplan123' })
  planId: string;

  @ApiProperty({ example: 'clxbm123' })
  billableMetricId: string;

  @ApiProperty({ example: 'GRADUATED', enum: ['STANDARD', 'GRADUATED', 'VOLUME', 'PACKAGE', 'PERCENTAGE'] })
  chargeModel: string;

  @ApiProperty({ example: 'IN_ARREARS', enum: ['IN_ADVANCE', 'IN_ARREARS'] })
  billingTiming: string;

  @ApiPropertyOptional({ example: 'API Usage' })
  invoiceDisplayName?: string;

  @ApiPropertyOptional({ example: 100 })
  minAmountCents?: number;

  @ApiProperty({ example: false })
  prorated: boolean;

  @ApiPropertyOptional({ additionalProperties: true, description: 'Model-specific config' })
  properties?: Record<string, any>;

  @ApiProperty({ type: [ChargeGraduatedRangeResponse] })
  graduatedRanges: ChargeGraduatedRangeResponse[];

  @ApiProperty({ type: [ChargeFilterResponse] })
  filters: ChargeFilterResponse[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
