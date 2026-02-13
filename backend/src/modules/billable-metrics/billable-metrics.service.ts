import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { CreateBillableMetricDto } from './dto/create-billable-metric.dto';
import { UpdateBillableMetricDto } from './dto/update-billable-metric.dto';

@Injectable()
export class BillableMetricsService {
  private readonly logger = new Logger(BillableMetricsService.name);

  async findAll(db: PrismaClient) {
    return db.billableMetric.findMany({
      include: { filters: true, _count: { select: { charges: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(db: PrismaClient, id: string) {
    const metric = await db.billableMetric.findUnique({
      where: { id },
      include: { filters: true, charges: true },
    });

    if (!metric) {
      throw new NotFoundException('Billable metric not found');
    }

    return metric;
  }

  async findByCode(db: PrismaClient, code: string) {
    const metric = await db.billableMetric.findUnique({
      where: { code },
      include: { filters: true },
    });

    if (!metric) {
      throw new NotFoundException(`Billable metric with code '${code}' not found`);
    }

    return metric;
  }

  async create(db: PrismaClient, dto: CreateBillableMetricDto) {
    const needsField = ['SUM', 'MAX', 'LATEST', 'WEIGHTED_SUM'];
    if (needsField.includes(dto.aggregationType) && !dto.fieldName) {
      throw new BadRequestException(
        `fieldName is required for ${dto.aggregationType} aggregation type`,
      );
    }

    const existing = await db.billableMetric.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException('Billable metric with this code already exists');
    }

    return db.billableMetric.create({
      data: {
        name: dto.name,
        code: dto.code,
        description: dto.description,
        aggregationType: dto.aggregationType,
        fieldName: dto.fieldName,
        recurring: dto.recurring ?? false,
        filters: dto.filters
          ? {
              create: dto.filters.map((f) => ({
                key: f.key,
                values: f.values,
              })),
            }
          : undefined,
      },
      include: { filters: true },
    });
  }

  async update(db: PrismaClient, id: string, dto: UpdateBillableMetricDto) {
    const metric = await db.billableMetric.findUnique({ where: { id } });
    if (!metric) {
      throw new NotFoundException('Billable metric not found');
    }

    if (dto.filters !== undefined) {
      await db.billableMetricFilter.deleteMany({
        where: { billableMetricId: id },
      });
    }

    return db.billableMetric.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.fieldName !== undefined && { fieldName: dto.fieldName }),
        ...(dto.recurring !== undefined && { recurring: dto.recurring }),
        ...(dto.filters !== undefined && {
          filters: {
            create: dto.filters.map((f) => ({
              key: f.key,
              values: f.values,
            })),
          },
        }),
      },
      include: { filters: true },
    });
  }

  async delete(db: PrismaClient, id: string) {
    const metric = await db.billableMetric.findUnique({
      where: { id },
      include: { _count: { select: { charges: true } } },
    });

    if (!metric) {
      throw new NotFoundException('Billable metric not found');
    }

    if (metric._count.charges > 0) {
      throw new BadRequestException(
        'Cannot delete billable metric that is used in charges',
      );
    }

    await db.billableMetric.delete({ where: { id } });
    return { message: 'Billable metric deleted successfully' };
  }
}
