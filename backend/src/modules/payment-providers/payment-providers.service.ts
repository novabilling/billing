import { Injectable, Logger, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { EncryptionService } from '../../services/encryption.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProviderFactory } from '../../providers/provider.factory';
import { PesapalProvider } from '../../providers/pesapal.provider';

@Injectable()
export class PaymentProvidersService {
  private readonly logger = new Logger(PaymentProvidersService.name);

  constructor(private readonly encryptionService: EncryptionService) {}

  private get pesapalIpnUrl(): string {
    return `${process.env.API_BASE_URL || 'http://localhost:4000'}/webhooks/pesapal`;
  }

  async findAll(db: PrismaClient) {
    const providers = await db.paymentProvider.findMany({
      orderBy: { priority: 'asc' },
    });

    return providers.map((p: any) => ({
      id: p.id,
      providerName: p.providerName,
      isActive: p.isActive,
      priority: p.priority,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }

  async findOne(db: PrismaClient, id: string) {
    const provider = await db.paymentProvider.findUnique({ where: { id } });

    if (!provider) {
      throw new NotFoundException('Payment provider not found');
    }

    return {
      id: provider.id,
      providerName: provider.providerName,
      isActive: provider.isActive,
      priority: provider.priority,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
    };
  }

  async create(db: PrismaClient, dto: CreateProviderDto) {
    const existing = await db.paymentProvider.findUnique({
      where: { providerName: dto.providerName },
    });

    if (existing) {
      throw new ConflictException('Provider already configured');
    }

    // For Pesapal: auto-register an IPN URL so every checkout order gets a
    // valid notification_id without requiring manual credential configuration.
    if (dto.providerName.toLowerCase() === 'pesapal') {
      const creds = dto.credentials as {
        consumerKey: string;
        consumerSecret: string;
        environment: 'sandbox' | 'live';
        ipnId?: string;
      };

      if (!creds.ipnId) {
        try {
          const pesapalProvider = new PesapalProvider(creds);
          const ipnId = await pesapalProvider.registerIpn(this.pesapalIpnUrl);
          dto.credentials = { ...creds, ipnId };
          this.logger.log(`Pesapal IPN URL registered — ipn_id: ${ipnId}`);
        } catch (error) {
          throw new BadRequestException(
            `Failed to register Pesapal IPN URL: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }
      }
    }

    const encryptedCredentials = this.encryptionService.encrypt(JSON.stringify(dto.credentials));

    const provider = await db.paymentProvider.create({
      data: {
        providerName: dto.providerName,
        credentials: encryptedCredentials,
        isActive: dto.isActive ?? true,
        priority: dto.priority ?? 1,
      },
    });

    return {
      id: provider.id,
      providerName: provider.providerName,
      isActive: provider.isActive,
      priority: provider.priority,
      createdAt: provider.createdAt,
    };
  }

  async update(db: PrismaClient, id: string, dto: UpdateProviderDto) {
    const provider = await db.paymentProvider.findUnique({ where: { id } });
    if (!provider) {
      throw new NotFoundException('Payment provider not found');
    }

    const data: Record<string, unknown> = {};
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.priority !== undefined) data.priority = dto.priority;
    if (dto.credentials) {
      let newCredentials = { ...dto.credentials };

      // For Pesapal: preserve an existing ipnId or re-register if new
      // credentials don't include one.
      if (provider.providerName.toLowerCase() === 'pesapal') {
        const newCreds = newCredentials as {
          consumerKey?: string;
          consumerSecret?: string;
          environment?: 'sandbox' | 'live';
          ipnId?: string;
        };

        if (!newCreds.ipnId) {
          // Check if existing credentials already have an ipnId
          const existingCreds = JSON.parse(
            this.encryptionService.decrypt(provider.credentials),
          ) as { ipnId?: string };

          if (existingCreds.ipnId) {
            // Carry forward the existing ipnId
            newCredentials = { ...newCreds, ipnId: existingCreds.ipnId };
          } else {
            // New credentials with no ipnId — re-register using merged fields
            const merged = { ...existingCreds, ...newCreds };
            if (!merged.consumerKey || !merged.consumerSecret || !merged.environment) {
              throw new BadRequestException(
                'Pesapal credentials must include consumerKey, consumerSecret, and environment',
              );
            }
            try {
              const pesapalProvider = new PesapalProvider(
                merged as { consumerKey: string; consumerSecret: string; environment: 'sandbox' | 'live' },
              );
              const ipnId = await pesapalProvider.registerIpn(this.pesapalIpnUrl);
              newCredentials = { ...newCreds, ipnId };
              this.logger.log(`Pesapal IPN URL re-registered — ipn_id: ${ipnId}`);
            } catch (error) {
              throw new BadRequestException(
                `Failed to register Pesapal IPN URL: ${error instanceof Error ? error.message : 'Unknown error'}`,
              );
            }
          }
        }
      }

      data.credentials = this.encryptionService.encrypt(JSON.stringify(newCredentials));
    }

    const updated = await db.paymentProvider.update({
      where: { id },
      data,
    });

    return {
      id: updated.id,
      providerName: updated.providerName,
      isActive: updated.isActive,
      priority: updated.priority,
      updatedAt: updated.updatedAt,
    };
  }

  async delete(db: PrismaClient, id: string) {
    const provider = await db.paymentProvider.findUnique({ where: { id } });
    if (!provider) {
      throw new NotFoundException('Payment provider not found');
    }

    await db.paymentProvider.delete({ where: { id } });
    return { message: 'Payment provider deleted successfully' };
  }

  async testConnection(db: PrismaClient, id: string) {
    const provider = await db.paymentProvider.findUnique({ where: { id } });
    if (!provider) {
      throw new NotFoundException('Payment provider not found');
    }

    try {
      const credentials = JSON.parse(this.encryptionService.decrypt(provider.credentials));
      const instance = ProviderFactory.create(provider.providerName, credentials);
      const success = await instance.testConnection();

      return { success, message: success ? 'Connection successful' : 'Connection failed' };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Connection test failed',
      };
    }
  }
}
