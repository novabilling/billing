import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma-central/client';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { TenantDatabaseService } from '../../database/tenant-database.service';
import { EncryptionService } from '../../services/encryption.service';
import { EmailService } from '../../services/email.service';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(TenantsService.name);

  constructor(
    private readonly centralPrisma: CentralPrismaService,
    private readonly tenantDb: TenantDatabaseService,
    private readonly encryptionService: EncryptionService,
    private readonly emailService: EmailService,
  ) {}

  async getTenant(tenantId: string) {
    const tenant = await this.centralPrisma.client.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        apiKey: true,
        webhookUrl: true,
        webhookSecret: true,
        isActive: true,
        settings: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async updateTenant(tenantId: string, dto: UpdateTenantDto) {
    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.webhookUrl !== undefined) data.webhookUrl = dto.webhookUrl;

    // Merge settings instead of overwriting to preserve sibling keys (smtp, webhookEvents, etc.)
    if (dto.settings !== undefined) {
      const existing = await this.centralPrisma.client.tenant.findUnique({
        where: { id: tenantId },
        select: { settings: true },
      });
      const currentSettings = (existing?.settings || {}) as Record<string, unknown>;
      data.settings = { ...currentSettings, ...dto.settings } as any;
    }

    const tenant = await this.centralPrisma.client.tenant.update({
      where: { id: tenantId },
      data,
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        webhookUrl: true,
        isActive: true,
        settings: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return tenant;
  }

  async getUsage(tenantId: string) {
    const tenantClient = await this.tenantDb.getTenantClient(tenantId);

    const [customerCount, subscriptionCount, invoiceCount, revenueResult] = await Promise.all([
      tenantClient.customer.count(),
      tenantClient.subscription.count({
        where: { status: 'ACTIVE' },
      }),
      tenantClient.invoice.count(),
      tenantClient.invoice.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true },
      }),
    ]);

    return {
      customers: customerCount,
      activeSubscriptions: subscriptionCount,
      totalInvoices: invoiceCount,
      totalRevenue: revenueResult._sum.amount?.toString() || '0',
    };
  }

  async createApiKey(tenantId: string, name: string, scopes: string[], expiresAt?: Date) {
    const key = this.encryptionService.generateApiKey();

    const apiKey = await this.centralPrisma.client.apiKey.create({
      data: {
        tenantId,
        key,
        name,
        scopes,
        expiresAt,
      },
    });

    return {
      id: apiKey.id,
      key, // Only shown once
      name: apiKey.name,
      scopes: apiKey.scopes,
      expiresAt: apiKey.expiresAt,
      createdAt: apiKey.createdAt,
    };
  }

  async listApiKeys(tenantId: string) {
    const keys = await this.centralPrisma.client.apiKey.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return keys.map((key: any) => ({
      id: key.id,
      key: `****${key.key.slice(-4)}`,
      name: key.name,
      scopes: key.scopes,
      lastUsed: key.lastUsed,
      expiresAt: key.expiresAt,
      createdAt: key.createdAt,
    }));
  }

  async deleteApiKey(tenantId: string, keyId: string) {
    const apiKey = await this.centralPrisma.client.apiKey.findFirst({
      where: { id: keyId, tenantId },
    });

    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }

    await this.centralPrisma.client.apiKey.delete({
      where: { id: keyId },
    });

    return { message: 'API key deleted successfully' };
  }

  async testSmtp(tenantId: string, to: string) {
    try {
      await this.emailService.sendMail(
        to,
        'NovaBilling SMTP Test',
        'smtp-test',
        {
          heading: 'SMTP Configuration Test',
          message: 'If you received this email, your SMTP settings are configured correctly.',
          footer: 'Sent from NovaBilling',
        },
        tenantId,
      );

      return { message: `Test email sent successfully to ${to}` };
    } catch (error: any) {
      this.logger.error(`SMTP test failed for tenant ${tenantId}:`, error);
      throw new BadRequestException(`SMTP test failed: ${error.message || 'Unknown error'}`);
    }
  }
}
