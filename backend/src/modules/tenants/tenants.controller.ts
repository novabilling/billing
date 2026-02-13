import { Controller, Get, Patch, Post, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantsService } from './tenants.service';
import { UpdateTenantDto, CreateApiKeyBodyDto } from './dto/update-tenant.dto';
import { TenantResponse, ApiKeyResponse, TenantUsageResponse } from './dto/tenant-response.dto';
import { MessageResponse } from '../auth/dto/auth-response.dto';

interface TenantRequest {
  tenant: { id: string; name: string; email: string };
}

@ApiTags('Tenants')
@ApiBearerAuth('JWT')
@UseGuards(TenantGuard)
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get current tenant info',
    description:
      "Retrieve the authenticated tenant's profile including settings and webhook configuration.",
  })
  @ApiResponse({ status: 200, description: 'Tenant profile details', type: TenantResponse })
  async getMe(@Req() req: TenantRequest) {
    return this.tenantsService.getTenant(req.tenant.id);
  }

  @Patch('me')
  @ApiOperation({
    summary: 'Update current tenant',
    description:
      'Update tenant profile fields such as company name, webhook URL, or custom settings.',
  })
  @ApiResponse({ status: 200, description: 'Tenant profile updated', type: TenantResponse })
  async updateMe(@Req() req: TenantRequest, @Body() dto: UpdateTenantDto) {
    return this.tenantsService.updateTenant(req.tenant.id, dto);
  }

  @Get('me/usage')
  @ApiOperation({
    summary: 'Get tenant usage statistics',
    description:
      'Retrieve usage metrics including customer count, active subscriptions, and total revenue.',
  })
  @ApiResponse({ status: 200, description: 'Usage metrics for the current billing period', type: TenantUsageResponse })
  async getUsage(@Req() req: TenantRequest) {
    return this.tenantsService.getUsage(req.tenant.id);
  }

  @Post('me/api-keys')
  @ApiOperation({
    summary: 'Create a new API key',
    description:
      'Generate a new API key with specified scopes. The full key is returned only once in the response — store it securely.',
  })
  @ApiResponse({
    status: 201,
    description: 'API key created. The key value is shown only once.',
    type: ApiKeyResponse,
  })
  async createApiKey(@Req() req: TenantRequest, @Body() dto: CreateApiKeyBodyDto) {
    const expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : undefined;
    return this.tenantsService.createApiKey(req.tenant.id, dto.name, dto.scopes, expiresAt);
  }

  @Get('me/api-keys')
  @ApiOperation({
    summary: 'List API keys',
    description:
      'Retrieve all API keys for the tenant. Keys are masked for security — only the last 8 characters are shown.',
  })
  @ApiResponse({ status: 200, description: 'List of API keys with masked values', type: [ApiKeyResponse] })
  async listApiKeys(@Req() req: TenantRequest) {
    return this.tenantsService.listApiKeys(req.tenant.id);
  }

  @Post('me/smtp/test')
  @ApiOperation({
    summary: 'Test SMTP settings',
    description:
      'Send a test email using the tenant\'s saved SMTP settings (or system defaults if not configured). Only requires recipient email address.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['to'],
      properties: {
        to: { type: 'string', example: 'test@example.com', description: 'Recipient email address' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Test email sent successfully', type: MessageResponse })
  @ApiResponse({ status: 400, description: 'SMTP test failed - check settings' })
  async testSmtp(@Req() req: TenantRequest, @Body() body: { to: string }) {
    return this.tenantsService.testSmtp(req.tenant.id, body.to);
  }

  @Delete('me/api-keys/:id')
  @ApiOperation({
    summary: 'Delete an API key',
    description:
      'Permanently revoke an API key. Any requests using this key will immediately fail.',
  })
  @ApiParam({ name: 'id', description: 'API key ID' })
  @ApiResponse({ status: 200, description: 'API key deleted' })
  @ApiResponse({ status: 404, description: 'API key not found' })
  async deleteApiKey(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.tenantsService.deleteApiKey(req.tenant.id, id);
  }
}
