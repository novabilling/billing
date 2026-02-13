import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PlanPriceResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty({ example: 'clxplan123' })
  planId: string;

  @ApiProperty({ example: 'USD' })
  currency: string;

  @ApiProperty({ example: '49.9900', description: 'Decimal amount as string' })
  amount: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class PlanResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty({ example: 'Premium Monthly' })
  name: string;

  @ApiProperty({ example: 'premium_monthly' })
  code: string;

  @ApiPropertyOptional({ example: 'Premium plan with all features' })
  description?: string;

  @ApiProperty({ example: 'MONTHLY', enum: ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'] })
  billingInterval: string;

  @ApiPropertyOptional({ example: ['Unlimited users', 'Priority support'], type: [String] })
  features?: string[];

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 'IN_ARREARS', enum: ['IN_ADVANCE', 'IN_ARREARS'] })
  billingTiming: string;

  @ApiPropertyOptional({ example: '100.0000', description: 'Minimum commitment amount' })
  minimumCommitment?: string;

  @ApiProperty({ type: [PlanPriceResponse] })
  prices: PlanPriceResponse[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
