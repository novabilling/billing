import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
