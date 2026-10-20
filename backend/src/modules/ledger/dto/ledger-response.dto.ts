import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMeta } from '../../../common/dto/pagination.dto';

const ACCOUNT_TYPES = ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'];
const ENTRY_TYPES = [
  'INVOICE_ISSUED',
  'INVOICE_VOIDED',
  'PAYMENT_CAPTURED',
  'PAYMENT_REFUNDED',
  'WALLET_CREDITED',
  'WALLET_DEBITED',
  'CREDIT_NOTE_ISSUED',
  'CREDIT_NOTE_VOIDED',
  'COLLECTION',
  'PAYOUT',
  'TRANSFER',
  'FEE',
  'ADJUSTMENT',
];

export class LedgerAccountResponse {
  @ApiProperty()
  id: string;

  @ApiProperty({
    example: 'customer_wallet:wal_123',
    description: 'Stable chart-of-accounts code, unique per currency',
  })
  code: string;

  @ApiProperty({ example: 'Customer wallet' })
  name: string;

  @ApiProperty({ enum: ACCOUNT_TYPES })
  type: string;

  @ApiProperty({ example: 'UGX' })
  currency: string;

  @ApiProperty({
    example: '150000.0000',
    description: 'Running balance in major units (debits positive)',
  })
  balance: string;

  @ApiProperty({ type: String, nullable: true })
  customerId: string | null;

  @ApiProperty({ type: String, nullable: true })
  walletId: string | null;

  @ApiProperty({ type: String, nullable: true })
  provider: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: string;
}

export class LedgerLineAccountResponse {
  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: ACCOUNT_TYPES })
  type: string;
}

export class LedgerLineResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  entryId: string;

  @ApiProperty()
  accountId: string;

  @ApiProperty({
    example: '-150000.0000',
    description: 'Major units; debits positive, credits negative',
  })
  amount: string;

  @ApiProperty({ example: 'UGX' })
  currency: string;

  @ApiProperty({ type: String, nullable: true })
  description: string | null;

  @ApiProperty({ type: LedgerLineAccountResponse })
  account: LedgerLineAccountResponse;
}

export class LedgerEntryResponse {
  @ApiProperty()
  id: string;

  @ApiProperty({
    example: 'payment:pay_123:captured',
    description: 'Idempotency key of the posting',
  })
  reference: string;

  @ApiProperty({ enum: ENTRY_TYPES })
  type: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ example: 'payment' })
  sourceType: string;

  @ApiProperty()
  sourceId: string;

  @ApiProperty({ type: String, format: 'date-time' })
  effectiveAt: string;

  @ApiProperty({ type: 'object', additionalProperties: true, nullable: true })
  metadata: Record<string, unknown> | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: string;

  @ApiProperty({ type: [LedgerLineResponse] })
  lines: LedgerLineResponse[];
}

export class PaginatedLedgerEntryResponse {
  @ApiProperty({ type: [LedgerEntryResponse] })
  data: LedgerEntryResponse[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}

export class LedgerCheckResponse {
  @ApiProperty({ example: 'zero_sum_per_currency' })
  name: string;

  @ApiProperty()
  ok: boolean;

  @ApiPropertyOptional({ description: 'Reports differences without making the ledger unbalanced' })
  informational?: boolean;

  @ApiProperty({ type: 'array', items: { type: 'object', additionalProperties: true } })
  details: Record<string, unknown>[];
}

export class LedgerHealthResponse {
  @ApiProperty()
  balanced: boolean;

  @ApiProperty({ type: String, format: 'date-time' })
  checkedAt: string;

  @ApiProperty({ type: [LedgerCheckResponse] })
  checks: LedgerCheckResponse[];
}

export class LedgerProjectionErrorResponse {
  @ApiProperty()
  reference: string;

  @ApiProperty()
  error: string;
}

export class LedgerProjectionResponse {
  @ApiProperty()
  posted: number;

  @ApiProperty()
  duplicates: number;

  @ApiProperty()
  skipped: number;

  @ApiProperty()
  failed: number;

  @ApiProperty({ type: [LedgerProjectionErrorResponse] })
  errors: LedgerProjectionErrorResponse[];
}

export class LedgerSyncResponse {
  @ApiProperty()
  tenantId: string;

  @ApiProperty({ enum: ['off', 'shadow'] })
  mode: string;

  @ApiPropertyOptional({ type: LedgerProjectionResponse })
  projection?: LedgerProjectionResponse;

  @ApiPropertyOptional({ type: LedgerHealthResponse })
  health?: LedgerHealthResponse;

  @ApiPropertyOptional()
  error?: string;
}
