import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PlanOverrideResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty({ example: 'clx_customer_123' })
  customerId: string;

  @ApiProperty({ example: 'clx_plan_456' })
  planId: string;

  @ApiPropertyOptional({ example: [{ currency: 'USD', amount: 49.99 }] })
  overriddenPrices?: unknown;

  @ApiPropertyOptional({ example: 500 })
  overriddenMinimumCommitment?: number;

  @ApiPropertyOptional()
  overriddenCharges?: unknown;

  @ApiPropertyOptional()
  metadata?: unknown;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PaginatedPlanOverrideResponse {
  @ApiProperty({ type: [PlanOverrideResponse] })
  data: PlanOverrideResponse[];

  @ApiProperty()
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
