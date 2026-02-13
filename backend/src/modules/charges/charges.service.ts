import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';

@Injectable()
export class ChargesService {
  private readonly logger = new Logger(ChargesService.name);

  async findAll(db: PrismaClient, planId?: string) {
    const where: Record<string, any> = {};
    if (planId) where.planId = planId;

    return db.charge.findMany({
      where,
      include: {
        billableMetric: true,
        graduatedRanges: { orderBy: { order: 'asc' } },
        filters: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(db: PrismaClient, id: string) {
    const charge = await db.charge.findUnique({
      where: { id },
      include: {
        billableMetric: { include: { filters: true } },
        graduatedRanges: { orderBy: { order: 'asc' } },
        filters: true,
        plan: true,
      },
    });

    if (!charge) {
      throw new NotFoundException('Charge not found');
    }

    return charge;
  }

  async findByPlan(db: PrismaClient, planId: string) {
    return db.charge.findMany({
      where: { planId },
      include: {
        billableMetric: true,
        graduatedRanges: { orderBy: { order: 'asc' } },
        filters: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(db: PrismaClient, dto: CreateChargeDto) {
    const plan = await db.plan.findUnique({ where: { id: dto.planId } });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    const metric = await db.billableMetric.findUnique({ where: { id: dto.billableMetricId } });
    if (!metric) {
      throw new NotFoundException('Billable metric not found');
    }

    const existing = await db.charge.findUnique({
      where: {
        planId_billableMetricId: {
          planId: dto.planId,
          billableMetricId: dto.billableMetricId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('A charge for this metric already exists on this plan');
    }

    if (['GRADUATED', 'VOLUME'].includes(dto.chargeModel) && (!dto.graduatedRanges || dto.graduatedRanges.length === 0)) {
      throw new BadRequestException(`${dto.chargeModel} charge model requires graduatedRanges`);
    }

    if (['STANDARD', 'PACKAGE', 'PERCENTAGE'].includes(dto.chargeModel) && !dto.properties) {
      throw new BadRequestException(`${dto.chargeModel} charge model requires properties`);
    }

    return db.charge.create({
      data: {
        planId: dto.planId,
        billableMetricId: dto.billableMetricId,
        chargeModel: dto.chargeModel,
        billingTiming: dto.billingTiming ?? 'IN_ARREARS',
        invoiceDisplayName: dto.invoiceDisplayName,
        minAmountCents: dto.minAmountCents,
        prorated: dto.prorated ?? false,
        properties: dto.properties ?? {},
        graduatedRanges: dto.graduatedRanges
          ? {
              create: dto.graduatedRanges.map((r, index) => ({
                fromValue: r.fromValue,
                toValue: r.toValue,
                perUnitAmount: r.perUnitAmount,
                flatAmount: r.flatAmount ?? 0,
                order: index,
              })),
            }
          : undefined,
        filters: dto.filters
          ? {
              create: dto.filters.map((f) => ({
                key: f.key,
                values: f.values,
                properties: f.properties ?? {},
              })),
            }
          : undefined,
      },
      include: {
        billableMetric: true,
        graduatedRanges: { orderBy: { order: 'asc' } },
        filters: true,
      },
    });
  }

  async update(db: PrismaClient, id: string, dto: UpdateChargeDto) {
    const charge = await db.charge.findUnique({ where: { id } });
    if (!charge) {
      throw new NotFoundException('Charge not found');
    }

    if (dto.graduatedRanges !== undefined) {
      await db.chargeGraduatedRange.deleteMany({ where: { chargeId: id } });
    }

    if (dto.filters !== undefined) {
      await db.chargeFilter.deleteMany({ where: { chargeId: id } });
    }

    return db.charge.update({
      where: { id },
      data: {
        ...(dto.billingTiming !== undefined && { billingTiming: dto.billingTiming }),
        ...(dto.invoiceDisplayName !== undefined && { invoiceDisplayName: dto.invoiceDisplayName }),
        ...(dto.minAmountCents !== undefined && { minAmountCents: dto.minAmountCents }),
        ...(dto.prorated !== undefined && { prorated: dto.prorated }),
        ...(dto.properties !== undefined && { properties: dto.properties }),
        ...(dto.graduatedRanges !== undefined && {
          graduatedRanges: {
            create: dto.graduatedRanges.map((r, index) => ({
              fromValue: r.fromValue,
              toValue: r.toValue,
              perUnitAmount: r.perUnitAmount,
              flatAmount: r.flatAmount ?? 0,
              order: index,
            })),
          },
        }),
        ...(dto.filters !== undefined && {
          filters: {
            create: dto.filters.map((f) => ({
              key: f.key,
              values: f.values,
              properties: f.properties ?? {},
            })),
          },
        }),
      },
      include: {
        billableMetric: true,
        graduatedRanges: { orderBy: { order: 'asc' } },
        filters: true,
      },
    });
  }

  async delete(db: PrismaClient, id: string) {
    const charge = await db.charge.findUnique({ where: { id } });
    if (!charge) {
      throw new NotFoundException('Charge not found');
    }

    await db.charge.delete({ where: { id } });
    return { message: 'Charge deleted successfully' };
  }
}
