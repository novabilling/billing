import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { TenantDatabaseService } from '../../database/tenant-database.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';

@Injectable()
export class PaymentMethodsService {
  private readonly logger = new Logger(PaymentMethodsService.name);

  constructor(private readonly tenantDb: TenantDatabaseService) {}

  async create(tenantId: string, dto: CreatePaymentMethodDto) {
    const prisma = await this.tenantDb.getTenantClient(tenantId);

    // Verify customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: dto.customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Customer ${dto.customerId} not found`);
    }

    // Check if this token already exists
    const existing = await prisma.paymentMethod.findFirst({
      where: {
        provider: dto.provider,
        tokenId: dto.tokenId,
      },
    });

    if (existing) {
      throw new BadRequestException('Payment method already exists');
    }

    // If this is the first payment method for the customer, make it default
    const existingCount = await prisma.paymentMethod.count({
      where: { customerId: dto.customerId },
    });

    const isDefault = existingCount === 0;

    return prisma.paymentMethod.create({
      data: {
        customerId: dto.customerId,
        provider: dto.provider,
        type: dto.type || 'CARD',
        tokenId: dto.tokenId,
        isDefault,
        last4: dto.last4,
        brand: dto.brand,
        expMonth: dto.expMonth,
        expYear: dto.expYear,
        cardholderName: dto.cardholderName,
        country: dto.country,
      },
    });
  }

  async findAll(tenantId: string, customerId: string) {
    const prisma = await this.tenantDb.getTenantClient(tenantId);

    return prisma.paymentMethod.findMany({
      where: { customerId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(tenantId: string, id: string) {
    const prisma = await this.tenantDb.getTenantClient(tenantId);

    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id },
    });

    if (!paymentMethod) {
      throw new NotFoundException(`Payment method ${id} not found`);
    }

    return paymentMethod;
  }

  async findDefault(tenantId: string, customerId: string) {
    const prisma = await this.tenantDb.getTenantClient(tenantId);

    return prisma.paymentMethod.findFirst({
      where: {
        customerId,
        isDefault: true,
      },
    });
  }

  async setDefault(tenantId: string, id: string) {
    const prisma = await this.tenantDb.getTenantClient(tenantId);

    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id },
    });

    if (!paymentMethod) {
      throw new NotFoundException(`Payment method ${id} not found`);
    }

    // Use transaction to ensure atomicity
    return prisma.$transaction(async (tx: typeof prisma) => {
      // Unset current default
      await tx.paymentMethod.updateMany({
        where: {
          customerId: paymentMethod.customerId,
          isDefault: true,
        },
        data: { isDefault: false },
      });

      // Set new default
      return tx.paymentMethod.update({
        where: { id },
        data: { isDefault: true },
      });
    });
  }

  async remove(tenantId: string, id: string) {
    const prisma = await this.tenantDb.getTenantClient(tenantId);

    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id },
    });

    if (!paymentMethod) {
      throw new NotFoundException(`Payment method ${id} not found`);
    }

    // Check if payment method is used by any active subscriptions
    const subscriptions = await prisma.subscription.findMany({
      where: {
        paymentMethodId: id,
        status: { in: ['ACTIVE', 'TRIALING', 'PAST_DUE'] },
      },
    });

    if (subscriptions.length > 0) {
      throw new BadRequestException(
        `Cannot delete payment method: ${subscriptions.length} active subscription(s) are using it`,
      );
    }

    // Delete the payment method
    await prisma.paymentMethod.delete({
      where: { id },
    });

    // If this was the default, set another one as default
    if (paymentMethod.isDefault) {
      const newDefault = await prisma.paymentMethod.findFirst({
        where: { customerId: paymentMethod.customerId },
        orderBy: { createdAt: 'desc' },
      });

      if (newDefault) {
        await prisma.paymentMethod.update({
          where: { id: newDefault.id },
          data: { isDefault: true },
        });
      }
    }

    return { message: 'Payment method deleted successfully' };
  }
}
