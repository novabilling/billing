import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { CreatePlanOverrideDto, UpdatePlanOverrideDto } from './dto/create-plan-override.dto';

@Injectable()
export class PlanOverridesService {
  private readonly logger = new Logger(PlanOverridesService.name);

  // ─── CRUD ──────────────────────────────────────────────────

  async create(db: PrismaClient, dto: CreatePlanOverrideDto) {
    // Verify customer and plan exist
    const customer = await db.customer.findUnique({ where: { id: dto.customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    const plan = await db.plan.findUnique({ where: { id: dto.planId } });
    if (!plan) throw new NotFoundException('Plan not found');

    // Check for existing override
    const existing = await (db as any).planOverride.findUnique({
      where: { customerId_planId: { customerId: dto.customerId, planId: dto.planId } },
    });
    if (existing) {
      throw new ConflictException('A plan override already exists for this customer and plan');
    }

    return (db as any).planOverride.create({
      data: {
        customerId: dto.customerId,
        planId: dto.planId,
        overriddenPrices: dto.overriddenPrices ?? undefined,
        overriddenMinimumCommitment: dto.overriddenMinimumCommitment ?? undefined,
        overriddenCharges: dto.overriddenCharges ?? undefined,
        metadata: dto.metadata ?? undefined,
      },
    });
  }

  async findAll(db: PrismaClient, query: { customerId?: string; planId?: string; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (query.customerId) where.customerId = query.customerId;
    if (query.planId) where.planId = query.planId;

    const [data, total] = await Promise.all([
      (db as any).planOverride.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { customer: { select: { id: true, name: true, email: true } }, plan: { select: { id: true, name: true, code: true } } },
      }),
      (db as any).planOverride.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(db: PrismaClient, id: string) {
    const override = await (db as any).planOverride.findUnique({
      where: { id },
      include: { customer: { select: { id: true, name: true, email: true } }, plan: { select: { id: true, name: true, code: true } } },
    });
    if (!override) throw new NotFoundException('Plan override not found');
    return override;
  }

  async update(db: PrismaClient, id: string, dto: UpdatePlanOverrideDto) {
    const override = await (db as any).planOverride.findUnique({ where: { id } });
    if (!override) throw new NotFoundException('Plan override not found');

    return (db as any).planOverride.update({
      where: { id },
      data: {
        ...(dto.overriddenPrices !== undefined && { overriddenPrices: dto.overriddenPrices }),
        ...(dto.overriddenMinimumCommitment !== undefined && { overriddenMinimumCommitment: dto.overriddenMinimumCommitment }),
        ...(dto.overriddenCharges !== undefined && { overriddenCharges: dto.overriddenCharges }),
        ...(dto.metadata !== undefined && { metadata: dto.metadata }),
      },
    });
  }

  async delete(db: PrismaClient, id: string) {
    const override = await (db as any).planOverride.findUnique({ where: { id } });
    if (!override) throw new NotFoundException('Plan override not found');

    await (db as any).planOverride.delete({ where: { id } });
    return { message: 'Plan override deleted successfully' };
  }

  // ─── Resolution helpers (used by billing processor) ──────

  async findByCustomerAndPlan(db: PrismaClient, customerId: string, planId: string) {
    return (db as any).planOverride.findUnique({
      where: { customerId_planId: { customerId, planId } },
    });
  }

  /**
   * Resolve price override for a customer+plan+currency.
   * Returns the overridden amount, or null if no override exists.
   */
  async resolvePrice(
    db: PrismaClient,
    customerId: string,
    planId: string,
    currency: string,
  ): Promise<number | null> {
    const override = await this.findByCustomerAndPlan(db, customerId, planId);
    if (!override?.overriddenPrices) return null;

    const prices = override.overriddenPrices as Array<{ currency: string; amount: number }>;
    const match = prices.find((p) => p.currency === currency);
    return match ? Number(match.amount) : null;
  }

  /**
   * Resolve minimum commitment override.
   * Returns the overridden amount, or null if no override exists.
   */
  async resolveMinimumCommitment(
    db: PrismaClient,
    customerId: string,
    planId: string,
  ): Promise<number | null> {
    const override = await this.findByCustomerAndPlan(db, customerId, planId);
    if (override?.overriddenMinimumCommitment == null) return null;
    return Number(override.overriddenMinimumCommitment);
  }

  /**
   * Resolve charge property override for a specific charge.
   * Returns { properties, graduatedRanges } or null if no override.
   */
  async resolveChargeProperties(
    db: PrismaClient,
    customerId: string,
    planId: string,
    chargeId: string,
  ): Promise<{ properties?: Record<string, unknown>; graduatedRanges?: any[] } | null> {
    const override = await this.findByCustomerAndPlan(db, customerId, planId);
    if (!override?.overriddenCharges) return null;

    const charges = override.overriddenCharges as Array<{
      chargeId: string;
      properties?: Record<string, unknown>;
      graduatedRanges?: any[];
    }>;
    const match = charges.find((c) => c.chargeId === chargeId);
    return match ? { properties: match.properties, graduatedRanges: match.graduatedRanges } : null;
  }
}
