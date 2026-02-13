import { ApiProperty } from '@nestjs/swagger';

export class PaymentMethodResponse {
  @ApiProperty({ example: 'pm_abc123' })
  id: string;

  @ApiProperty({ example: 'cus_abc123' })
  customerId: string;

  @ApiProperty({ example: 'stripe' })
  provider: string;

  @ApiProperty({ example: 'CARD' })
  type: string;

  @ApiProperty({ example: 'pm_1234567890' })
  tokenId: string;

  @ApiProperty({ example: true })
  isDefault: boolean;

  @ApiProperty({ example: '4242', required: false })
  last4?: string;

  @ApiProperty({ example: 'visa', required: false })
  brand?: string;

  @ApiProperty({ example: 12, required: false })
  expMonth?: number;

  @ApiProperty({ example: 2028, required: false })
  expYear?: number;

  @ApiProperty({ example: 'John Doe', required: false })
  cardholderName?: string;

  @ApiProperty({ example: 'US', required: false })
  country?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  updatedAt: Date;
}
