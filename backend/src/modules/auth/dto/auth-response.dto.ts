import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TenantInfoResponse {
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

  @ApiPropertyOptional()
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

export class TokenPairResponse {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  refreshToken: string;
}

export class RegisterResponse extends TokenPairResponse {
  @ApiProperty({ type: TenantInfoResponse })
  tenant: TenantInfoResponse;

  @ApiProperty({ example: 'sk_live_abc123...' })
  apiKey: string;
}

export class LoginResponse extends TokenPairResponse {
  @ApiProperty({ type: TenantInfoResponse })
  tenant: TenantInfoResponse;
}

export class MessageResponse {
  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;
}
