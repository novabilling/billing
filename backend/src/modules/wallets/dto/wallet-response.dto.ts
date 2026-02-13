import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMeta } from '../../../common/dto/pagination.dto';

export class WalletCustomerResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty({ example: 'Jane Doe' })
  name: string;

  @ApiProperty({ example: 'jane@example.com' })
  email: string;
}

export class WalletResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty({ example: 'clxcust123' })
  customerId: string;

  @ApiPropertyOptional({ example: 'Main Wallet' })
  name?: string;

  @ApiProperty({ example: 'USD' })
  currency: string;

  @ApiProperty({ example: '1.0000', description: '1 credit = rateAmount in currency' })
  rateAmount: string;

  @ApiProperty({ example: '100.0000', description: 'Available credits' })
  creditsBalance: string;

  @ApiProperty({ example: '100.0000', description: 'Monetary equivalent of credits' })
  balance: string;

  @ApiProperty({ example: '50.0000', description: 'Lifetime consumed credits' })
  consumedCredits: string;

  @ApiProperty({ example: '50.0000', description: 'Lifetime consumed amount' })
  consumedAmount: string;

  @ApiProperty({ example: 'ACTIVE', enum: ['ACTIVE', 'TERMINATED'] })
  status: string;

  @ApiPropertyOptional()
  expirationAt?: string;

  @ApiPropertyOptional()
  terminatedAt?: string;

  @ApiPropertyOptional({ type: WalletCustomerResponse })
  customer?: WalletCustomerResponse;

  @ApiPropertyOptional({ additionalProperties: true })
  metadata?: Record<string, any>;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class WalletTransactionResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty({ example: 'clxwallet123' })
  walletId: string;

  @ApiProperty({ example: 'INBOUND', enum: ['INBOUND', 'OUTBOUND'] })
  transactionType: string;

  @ApiProperty({ example: 'SETTLED', enum: ['PENDING', 'SETTLED', 'FAILED'] })
  status: string;

  @ApiProperty({ example: 'PURCHASED', enum: ['PURCHASED', 'GRANTED', 'VOIDED', 'INVOICED'] })
  transactionStatus: string;

  @ApiProperty({ example: '50.0000', description: 'Credits added or deducted' })
  creditAmount: string;

  @ApiProperty({ example: '50.0000', description: 'Monetary equivalent' })
  amount: string;

  @ApiPropertyOptional()
  invoiceId?: string;

  @ApiPropertyOptional()
  settledAt?: string;

  @ApiPropertyOptional({ additionalProperties: true })
  metadata?: Record<string, any>;

  @ApiProperty()
  createdAt: string;
}

export class PaginatedWalletResponse {
  @ApiProperty({ type: [WalletResponse] })
  data: WalletResponse[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}

export class PaginatedWalletTransactionResponse {
  @ApiProperty({ type: [WalletTransactionResponse] })
  data: WalletTransactionResponse[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}

export class TopUpResponse {
  @ApiProperty({ type: [WalletTransactionResponse] })
  transactions: WalletTransactionResponse[];

  @ApiProperty({ type: WalletResponse })
  wallet: WalletResponse;
}
