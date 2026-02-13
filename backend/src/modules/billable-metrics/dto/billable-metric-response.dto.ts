import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BillableMetricFilterResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty()
  billableMetricId: string;

  @ApiProperty({ example: 'region' })
  key: string;

  @ApiProperty({ example: ['us-east', 'us-west', 'eu'], type: [String] })
  values: string[];
}

export class BillableMetricResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty({ example: 'API Calls' })
  name: string;

  @ApiProperty({ example: 'api_calls' })
  code: string;

  @ApiPropertyOptional({ example: 'Number of API calls made' })
  description?: string;

  @ApiProperty({ example: 'COUNT', enum: ['COUNT', 'SUM', 'MAX', 'UNIQUE_COUNT', 'LATEST', 'WEIGHTED_SUM'] })
  aggregationType: string;

  @ApiPropertyOptional({ example: 'tokens' })
  fieldName?: string;

  @ApiProperty({ example: false })
  recurring: boolean;

  @ApiProperty({ type: [BillableMetricFilterResponse] })
  filters: BillableMetricFilterResponse[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
