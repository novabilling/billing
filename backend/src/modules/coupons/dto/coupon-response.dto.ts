import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMeta } from '../../../common/dto/pagination.dto';

export class CouponResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty({ example: 'SUMMER2026' })
  code: string;

  @ApiProperty({ example: 'Summer Sale' })
  name: string;

  @ApiPropertyOptional({ example: '20% off all plans' })
  description?: string;

  @ApiProperty({ example: 'PERCENTAGE', enum: ['PERCENTAGE', 'FIXED_AMOUNT'] })
  discountType: string;

  @ApiProperty({ example: '20.0000', description: 'Discount value as decimal string' })
  discountValue: string;

  @ApiPropertyOptional({ example: 'USD' })
  currency?: string;

  @ApiPropertyOptional({ example: 100 })
  maxRedemptions?: number;

  @ApiProperty({ example: 5 })
  redemptionCount: number;

  @ApiProperty({ example: ['clxplan123'], type: [String] })
  appliesToPlanIds: string[];

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiPropertyOptional()
  expiresAt?: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class AppliedCouponResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  couponId: string;

  @ApiProperty()
  customerId: string;

  @ApiPropertyOptional()
  subscriptionId?: string;

  @ApiPropertyOptional({ example: '20.0000' })
  amountOff?: string;

  @ApiPropertyOptional({ example: 3 })
  usesRemaining?: number;

  @ApiProperty()
  createdAt: string;
}

export class PaginatedCouponResponse {
  @ApiProperty({ type: [CouponResponse] })
  data: CouponResponse[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}
