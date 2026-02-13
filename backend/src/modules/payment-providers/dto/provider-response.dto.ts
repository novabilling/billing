import { ApiProperty } from '@nestjs/swagger';

export class PaymentProviderResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty({ example: 'paystack' })
  providerName: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 1 })
  priority: number;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class ProviderTestResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Connection successful' })
  message: string;
}
