import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { Prisma } from '../../generated/prisma-central/client';
import { isPlatformOperator } from '../../common/platform-operator';
import { UpdateTenantAccessDto } from './dto/update-tenant-access.dto';
import { forgetPlan, parseLimits } from '../../common/guards/plan-limits';

const SELECT = {
  id: true,
  name: true,
  email: true,
  isActive: true,
  isPlatformOperator: true,
  accessMode: true,
  accessReason: true,
  accessUrl: true,
  createdAt: true,
  tenantBilling: { select: { status: true, planId: true, trialEndsAt: true, planName: true, limits: true, manageUrl: true } },
} as const;

/** Organisation access and billing state, for the platform console and the service API. */
@Injectable()
export class TenantAccessService {
  private readonly logger = new Logger(TenantAccessService.name);

  constructor(
    private readonly centralPrisma: CentralPrismaService,
    private readonly config: ConfigService,
  ) {}

  private get db() {
    return this.centralPrisma.client;
  }

  /** Organisations in creation order, a page at a time (pass the last id as `after`). */
  async list(after?: string, limit = 200) {
    const take = Math.min(Math.max(limit, 1), 500);
    const rows = await this.db.tenant.findMany({
      select: SELECT,
      orderBy: { id: 'asc' },
      take,
      ...(after && { cursor: { id: after }, skip: 1 }),
    });
    return {
      data: rows.map((t) => this.view(t)),
      next: rows.length === take ? rows[rows.length - 1].id : null,
    };
  }

  async get(id: string) {
    const tenant = await this.db.tenant.findUnique({ where: { id }, select: SELECT });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return this.view(tenant);
  }

  async update(id: string, dto: UpdateTenantAccessDto, actor: string) {
    const tenant = await this.db.tenant.findUnique({ where: { id }, select: { id: true, isPlatformOperator: true } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    if (dto.accessMode && dto.accessMode !== 'FULL' && isPlatformOperator(tenant, this.config)) {
      throw new ConflictException('The platform operator organisation cannot be limited');
    }

    const access = {
      ...(dto.accessMode !== undefined && { accessMode: dto.accessMode }),
      ...(dto.accessReason !== undefined && { accessReason: dto.accessReason }),
      ...(dto.accessUrl !== undefined && { accessUrl: dto.accessUrl }),
    };
    // Back to full access clears the reason unless a new one was given.
    if (dto.accessMode === 'FULL' && dto.accessReason === undefined) access.accessReason = null;
    if (dto.accessMode === 'FULL' && dto.accessUrl === undefined) access.accessUrl = null;

    const billing = {
      ...(dto.billingStatus !== undefined && { status: dto.billingStatus }),
      ...(dto.billingPlanId !== undefined && { planId: dto.billingPlanId }),
      ...(dto.trialEndsAt !== undefined && { trialEndsAt: dto.trialEndsAt ? new Date(dto.trialEndsAt) : null }),
      ...(dto.planName !== undefined && { planName: dto.planName }),
      ...(dto.manageUrl !== undefined && { manageUrl: dto.manageUrl }),
      ...(dto.limits !== undefined && { limits: (parseLimits(dto.limits) ?? Prisma.DbNull) as Prisma.InputJsonValue }),
    };

    await this.db.$transaction(async (tx) => {
      if (Object.keys(access).length) await tx.tenant.update({ where: { id }, data: access });
      if (Object.keys(billing).length) {
        await tx.tenantBilling.upsert({ where: { tenantId: id }, create: { tenantId: id, ...billing }, update: billing });
      }
    });
    forgetPlan(id);
    this.logger.log(`${actor} updated tenant ${id}: ${JSON.stringify({ ...access, ...billing })}`);
    return this.get(id);
  }

  private view(t: {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    isPlatformOperator: boolean;
    accessMode: string;
    accessReason: string | null;
    accessUrl: string | null;
    createdAt: Date;
    tenantBilling: { status: string; planId: string | null; trialEndsAt: Date | null; planName: string | null; limits: unknown; manageUrl: string | null } | null;
  }) {
    return {
      id: t.id,
      name: t.name,
      email: t.email,
      isActive: t.isActive,
      isPlatformOperator: isPlatformOperator(t, this.config),
      accessMode: t.accessMode,
      accessReason: t.accessReason,
      accessUrl: t.accessUrl,
      createdAt: t.createdAt,
      billing: t.tenantBilling && { ...t.tenantBilling, limits: parseLimits(t.tenantBilling.limits) },
    };
  }
}
