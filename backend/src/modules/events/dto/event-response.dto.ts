import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMeta } from '../../../common/dto/pagination.dto';

export class UsageEventResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty({ example: 'txn_unique_123' })
  transactionId: string;

  @ApiProperty({ example: 'clxsub123' })
  subscriptionId: string;

  @ApiProperty({ example: 'api_calls' })
  code: string;

  @ApiProperty()
  timestamp: string;

  @ApiPropertyOptional({ additionalProperties: true, example: { region: 'us-east', bytes: 1024 } })
  properties?: Record<string, any>;

  @ApiProperty()
  createdAt: string;
}

export class PaginatedUsageEventResponse {
  @ApiProperty({ type: [UsageEventResponse] })
  data: UsageEventResponse[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}

export class BatchEventResponse {
  @ApiProperty({ example: 5 })
  received: number;

  @ApiProperty({ example: 5 })
  processed: number;

  @ApiProperty({ example: 0 })
  duplicates: number;
}
