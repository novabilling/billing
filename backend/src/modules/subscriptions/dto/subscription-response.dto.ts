import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMeta } from '../../../common/dto/pagination.dto';

export class SubscriptionCustomerResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty({ example: 'Jane Doe' })
  name: string;

  @ApiProperty({ example: 'jane@example.com' })
  email: string;
}

export class SubscriptionPlanResponse {
  @ApiProperty({ example: 'clxplan123' })
  id: string;

  @ApiProperty({ example: 'Premium Monthly' })
  name: string;

  @ApiProperty({ example: 'MONTHLY', enum: ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'] })
  billingInterval: string;
}

export class SubscriptionResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiPropertyOptional({ example: 'ext_sub_123' })
  externalId?: string;

  @ApiProperty({ example: 'clxcust123' })
  customerId: string;

  @ApiProperty({ example: 'clxplan123' })
  planId: string;

  @ApiPropertyOptional()
  previousPlanId?: string;

  @ApiProperty({ example: 'ACTIVE', enum: ['ACTIVE', 'PAST_DUE', 'CANCELED', 'TRIALING', 'PAUSED'] })
  status: string;

  @ApiProperty({ example: 'USD' })
  currency: string;

  @ApiProperty({ example: 'IN_ARREARS', enum: ['IN_ADVANCE', 'IN_ARREARS'] })
  billingTiming: string;

  @ApiProperty()
  currentPeriodStart: string;

  @ApiProperty()
  currentPeriodEnd: string;

  @ApiPropertyOptional()
  cancelAt?: string;

  @ApiPropertyOptional()
  canceledAt?: string;

  @ApiPropertyOptional()
  trialStart?: string;

  @ApiPropertyOptional()
  trialEnd?: string;

  @ApiProperty()
  startedAt: string;

  @ApiPropertyOptional({ additionalProperties: true })
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ type: SubscriptionCustomerResponse })
  customer?: SubscriptionCustomerResponse;

  @ApiPropertyOptional({ type: SubscriptionPlanResponse })
  plan?: SubscriptionPlanResponse;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class PaginatedSubscriptionResponse {
  @ApiProperty({ type: [SubscriptionResponse] })
  data: SubscriptionResponse[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}
