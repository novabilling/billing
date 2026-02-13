import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { EncryptionService } from '../../services/encryption.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProviderFactory } from '../../providers/provider.factory';

@Injectable()
export class PaymentProvidersService {
  private readonly logger = new Logger(PaymentProvidersService.name);

  constructor(private readonly encryptionService: EncryptionService) {}

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
      data.credentials = this.encryptionService.encrypt(JSON.stringify(dto.credentials));
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
