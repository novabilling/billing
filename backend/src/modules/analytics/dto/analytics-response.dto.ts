import { ApiProperty } from '@nestjs/swagger';

export class RevenueAnalyticsResponse {
  @ApiProperty({ example: '12500.0000', description: 'Total revenue as decimal string' })
  totalRevenue: string;

  @ApiProperty({ example: 45 })
  invoiceCount: number;

  @ApiProperty({ example: '4200.0000', description: 'Monthly recurring revenue' })
  mrr: string;

  @ApiProperty({ example: '50400.0000', description: 'Annual recurring revenue' })
  arr: string;
}

export class SubscriptionAnalyticsResponse {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 85 })
  active: number;

  @ApiProperty({ example: 5 })
  canceled: number;

  @ApiProperty({ example: 8 })
  trialing: number;

  @ApiProperty({ example: 2 })
  paused: number;

  @ApiProperty({ example: 12 })
  newSubscriptions: number;

  @ApiProperty({ example: '5.00', description: 'Churn rate percentage' })
  churnRate: string;

  @ApiProperty({ example: '95.00', description: 'Retention rate percentage' })
  retentionRate: string;
}

export class CustomerAnalyticsResponse {
  @ApiProperty({ example: 150 })
  totalCustomers: number;

  @ApiProperty({ example: 12 })
  newCustomers: number;

  @ApiProperty({ example: '83.33', description: 'Average revenue per user' })
  arpu: string;

  @ApiProperty({ example: '12500.0000' })
  totalRevenue: string;
}

export class PaymentAnalyticsResponse {
  @ApiProperty({ example: 200 })
  totalPayments: number;

  @ApiProperty({ example: 180 })
  succeeded: number;

  @ApiProperty({ example: 15 })
  failed: number;

  @ApiProperty({ example: 5 })
  pending: number;

  @ApiProperty({ example: '90.00', description: 'Success rate percentage' })
  successRate: string;
}

export class MrrPlanBreakdown {
  @ApiProperty() planId: string;
  @ApiProperty() planName: string;
  @ApiProperty() mrr: number;
  @ApiProperty() subscriptionCount: number;
}

export class MrrBreakdownResponse {
  @ApiProperty() totalMrr: number;
  @ApiProperty() newMrr: number;
  @ApiProperty() expansionMrr: number;
  @ApiProperty() contractionMrr: number;
  @ApiProperty() churnMrr: number;
  @ApiProperty() netNewMrr: number;
  @ApiProperty({ type: [MrrPlanBreakdown] }) byPlan: MrrPlanBreakdown[];
}

export class NetRevenueResponse {
  @ApiProperty() grossRevenue: number;
  @ApiProperty() refunds: number;
  @ApiProperty() creditNotes: number;
  @ApiProperty() netRevenue: number;
}

export class CohortRow {
  @ApiProperty({ example: '2026-01' }) month: string;
  @ApiProperty() totalCustomers: number;
  @ApiProperty({ type: [Number] }) retentionPercentages: number[];
}

export class ChurnCohortsResponse {
  @ApiProperty({ type: [String] }) months: string[];
  @ApiProperty({ type: [CohortRow] }) cohorts: CohortRow[];
}

export class LtvPlanBreakdown {
  @ApiProperty() planId: string;
  @ApiProperty() planName: string;
  @ApiProperty() avgLtv: number;
  @ApiProperty() avgLifespanDays: number;
}

export class LtvResponse {
  @ApiProperty() avgLtv: number;
  @ApiProperty() avgLifespanDays: number;
  @ApiProperty({ type: [LtvPlanBreakdown] }) byPlan: LtvPlanBreakdown[];
}
