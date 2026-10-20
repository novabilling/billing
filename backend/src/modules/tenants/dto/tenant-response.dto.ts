import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMeta } from '../../../common/dto/pagination.dto';

export class TenantResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty({ example: 'Acme Corp' })
  name: string;

  @ApiProperty({ example: 'acme-corp' })
  slug: string;

  @ApiProperty({ example: 'john@company.com' })
  email: string;

  @ApiProperty({ example: 'sk_live_abc123...' })
  apiKey: string;

  @ApiPropertyOptional({ example: 'https://example.com/webhooks' })
  webhookUrl?: string;

  @ApiPropertyOptional({ example: 'whsec_abc123...' })
  webhookSecret?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiPropertyOptional({ additionalProperties: true })
  settings?: Record<string, any>;

  @ApiPropertyOptional()
  lastLoginAt?: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class ApiKeyResponse {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty({ example: 'sk_live_abc123...' })
  key: string;

  @ApiProperty({ example: 'Production API Key' })
  name: string;

  @ApiProperty({ example: ['read', 'write'], type: [String] })
  scopes: string[];

  @ApiPropertyOptional()
  lastUsed?: string;

  @ApiPropertyOptional()
  expiresAt?: string;

  @ApiProperty()
  createdAt: string;
}

export class TenantUsageResponse {
  @ApiProperty({ example: 42 })
  customers: number;

  @ApiProperty({ example: 15 })
  activeSubscriptions: number;

  @ApiProperty({ example: 120 })
  totalInvoices: number;

  @ApiProperty({ example: '125000.00' })
  totalRevenue: string;
}

export class WebhookLogResponse {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'invoice.paid' })
  event: string;

  @ApiProperty({ example: 'https://example.com/webhooks', description: 'Your endpoint, or inbound:<provider>' })
  url: string;

  @ApiProperty({ type: 'object', additionalProperties: true })
  payload: Record<string, unknown>;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true, description: "The endpoint's reply, as stored" })
  response?: Record<string, unknown>;

  @ApiPropertyOptional({ example: 200 })
  statusCode?: number;

  @ApiProperty()
  success: boolean;

  @ApiProperty({ example: 1 })
  attemptCount: number;

  @ApiProperty({ enum: ['inbound', 'outbound'] })
  direction: string;

  @ApiPropertyOptional({ example: 'stripe', description: 'Inbound only: the provider that called us' })
  provider?: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: string;
}

export class PaginatedWebhookLogResponse {
  @ApiProperty({ type: [WebhookLogResponse] })
  data: WebhookLogResponse[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}
