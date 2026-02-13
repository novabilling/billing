import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { CreateTaxDto, UpdateTaxDto } from './dto/create-tax.dto';

@Injectable()
export class TaxesService {
  private readonly logger = new Logger(TaxesService.name);

  // ─── CRUD ──────────────────────────────────────────────────

  async create(db: PrismaClient, dto: CreateTaxDto) {
    const existing = await (db as any).tax.findUnique({ where: { code: dto.code } });
    if (existing) {
      throw new ConflictException(`Tax with code "${dto.code}" already exists`);
    }

    return (db as any).tax.create({
      data: {
        name: dto.name,
        code: dto.code,
        rate: dto.rate,
        description: dto.description,
        appliedByDefault: dto.appliedByDefault ?? false,
      },
    });
  }

  async findAll(db: PrismaClient, query: { appliedByDefault?: boolean; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (query.appliedByDefault !== undefined) {
      where.appliedByDefault = query.appliedByDefault;
    }

    const [data, total] = await Promise.all([
      (db as any).tax.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      (db as any).tax.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(db: PrismaClient, id: string) {
    const tax = await (db as any).tax.findUnique({ where: { id } });
    if (!tax) throw new NotFoundException('Tax not found');
    return tax;
  }

  async update(db: PrismaClient, id: string, dto: UpdateTaxDto) {
    const tax = await (db as any).tax.findUnique({ where: { id } });
    if (!tax) throw new NotFoundException('Tax not found');

    return (db as any).tax.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.rate !== undefined && { rate: dto.rate }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.appliedByDefault !== undefined && { appliedByDefault: dto.appliedByDefault }),
      },
    });
  }

  async delete(db: PrismaClient, id: string) {
    const tax = await (db as any).tax.findUnique({ where: { id } });
    if (!tax) throw new NotFoundException('Tax not found');

    await (db as any).tax.delete({ where: { id } });
    return { message: 'Tax deleted successfully' };
  }

  // ─── Assignments ───────────────────────────────────────────

  async assignToCustomer(db: PrismaClient, customerId: string, taxId: string) {
    await this.findOne(db, taxId);
    const customer = await db.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    return (db as any).customerTax.create({
      data: { customerId, taxId },
    });
  }

  async unassignFromCustomer(db: PrismaClient, customerId: string, taxId: string) {
    await (db as any).customerTax.deleteMany({
      where: { customerId, taxId },
    });
    return { message: 'Tax unassigned from customer' };
  }

  async getCustomerTaxes(db: PrismaClient, customerId: string) {
    const records = await (db as any).customerTax.findMany({
      where: { customerId },
      include: { tax: true },
    });
    return records.map((r: any) => r.tax);
  }

  async assignToPlan(db: PrismaClient, planId: string, taxId: string) {
    await this.findOne(db, taxId);
    const plan = await db.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException('Plan not found');

    return (db as any).planTax.create({
      data: { planId, taxId },
    });
  }

  async unassignFromPlan(db: PrismaClient, planId: string, taxId: string) {
    await (db as any).planTax.deleteMany({
      where: { planId, taxId },
    });
    return { message: 'Tax unassigned from plan' };
  }

  async getPlanTaxes(db: PrismaClient, planId: string) {
    const records = await (db as any).planTax.findMany({
      where: { planId },
      include: { tax: true },
    });
    return records.map((r: any) => r.tax);
  }

  async assignToCharge(db: PrismaClient, chargeId: string, taxId: string) {
    await this.findOne(db, taxId);
    return (db as any).chargeTax.create({
      data: { chargeId, taxId },
    });
  }

  async unassignFromCharge(db: PrismaClient, chargeId: string, taxId: string) {
    await (db as any).chargeTax.deleteMany({
      where: { chargeId, taxId },
    });
    return { message: 'Tax unassigned from charge' };
  }

  // ─── Tax Resolution (Hierarchical) ────────────────────────
  // Priority: charge-level → plan-level → customer-level → org defaults

  async resolveTaxes(
    db: PrismaClient,
    customerId: string,
    planId?: string,
    chargeId?: string,
  ): Promise<Array<{ id: string; name: string; code: string; rate: number }>> {
    // 1. Charge-level taxes (most specific)
    if (chargeId) {
      const chargeTaxes = await (db as any).chargeTax.findMany({
        where: { chargeId },
        include: { tax: true },
      });
      if (chargeTaxes.length > 0) {
        return chargeTaxes.map((ct: any) => ({
          id: ct.tax.id,
          name: ct.tax.name,
          code: ct.tax.code,
          rate: Number(ct.tax.rate),
        }));
      }
    }

    // 2. Plan-level taxes
    if (planId) {
      const planTaxes = await (db as any).planTax.findMany({
        where: { planId },
        include: { tax: true },
      });
      if (planTaxes.length > 0) {
        return planTaxes.map((pt: any) => ({
          id: pt.tax.id,
          name: pt.tax.name,
          code: pt.tax.code,
          rate: Number(pt.tax.rate),
        }));
      }
    }

    // 3. Customer-level taxes
    const customerTaxes = await (db as any).customerTax.findMany({
      where: { customerId },
      include: { tax: true },
    });
    if (customerTaxes.length > 0) {
      return customerTaxes.map((ct: any) => ({
        id: ct.tax.id,
        name: ct.tax.name,
        code: ct.tax.code,
        rate: Number(ct.tax.rate),
      }));
    }

    // 4. Org defaults (appliedByDefault = true)
    const defaultTaxes = await (db as any).tax.findMany({
      where: { appliedByDefault: true },
    });
    return defaultTaxes.map((t: any) => ({
      id: t.id,
      name: t.name,
      code: t.code,
      rate: Number(t.rate),
    }));
  }
}
