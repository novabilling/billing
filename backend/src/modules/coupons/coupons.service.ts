import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { CreateCouponDto, ApplyCouponDto, UpdateCouponDto } from './dto/create-coupon.dto';

@Injectable()
export class CouponsService {
  private readonly logger = new Logger(CouponsService.name);

  async findAll(db: PrismaClient, query: { isActive?: boolean; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (query.isActive !== undefined) where.isActive = query.isActive;

    const [data, total] = await Promise.all([
      db.coupon.findMany({
        where,
        skip,
        take: limit,
        include: { _count: { select: { appliedCoupons: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      db.coupon.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(db: PrismaClient, id: string) {
    const coupon = await db.coupon.findUnique({
      where: { id },
      include: {
        appliedCoupons: {
          include: { customer: { select: { id: true, name: true, email: true } } },
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { appliedCoupons: true } },
      },
    });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async create(db: PrismaClient, dto: CreateCouponDto) {
    const existing = await db.coupon.findUnique({ where: { code: dto.code.toUpperCase() } });
    if (existing) throw new BadRequestException('A coupon with this code already exists');

    if (dto.discountType === 'PERCENTAGE' && (dto.discountValue < 0 || dto.discountValue > 100)) {
      throw new BadRequestException('Percentage discount must be between 0 and 100');
    }

    if (dto.discountType === 'FIXED_AMOUNT' && !dto.currency) {
      throw new BadRequestException('Currency is required for fixed amount discounts');
    }

    return db.coupon.create({
      data: {
        code: dto.code.toUpperCase(),
        name: dto.name,
        description: dto.description,
        discountType: dto.discountType,
        discountValue: dto.discountValue,
        currency: dto.currency?.toUpperCase(),
        ...(dto.createdAt && { createdAt: new Date(dto.createdAt) }),
        maxRedemptions: dto.maxRedemptions,
        appliesToPlanIds: dto.appliesToPlanIds || [],
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });
  }

  async update(db: PrismaClient, id: string, dto: UpdateCouponDto) {
    const coupon = await db.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');

    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.expiresAt !== undefined) data.expiresAt = new Date(dto.expiresAt);

    return db.coupon.update({ where: { id }, data });
  }

  async delete(db: PrismaClient, id: string) {
    const coupon = await db.coupon.findUnique({
      where: { id },
      include: { _count: { select: { appliedCoupons: true } } },
    });
    if (!coupon) throw new NotFoundException('Coupon not found');

    if (coupon._count.appliedCoupons > 0) {
      // Soft-delete: just deactivate
      return db.coupon.update({ where: { id }, data: { isActive: false } });
    }

    await db.coupon.delete({ where: { id } });
    return { message: 'Coupon deleted' };
  }

  async apply(db: PrismaClient, dto: ApplyCouponDto) {
    const coupon = await db.coupon.findUnique({ where: { id: dto.couponId } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    if (!coupon.isActive) throw new BadRequestException('Coupon is no longer active');
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new BadRequestException('Coupon has expired');
    }
    if (coupon.maxRedemptions && coupon.redemptionCount >= coupon.maxRedemptions) {
      throw new BadRequestException('Coupon has reached maximum redemptions');
    }

    const customer = await db.customer.findUnique({ where: { id: dto.customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    // Check if already applied to this customer
    const existing = await db.appliedCoupon.findFirst({
      where: { couponId: dto.couponId, customerId: dto.customerId },
    });
    if (existing) throw new BadRequestException('Coupon already applied to this customer');

    // Check plan restriction
    if (dto.subscriptionId && coupon.appliesToPlanIds.length > 0) {
      const sub = await db.subscription.findUnique({ where: { id: dto.subscriptionId } });
      if (sub && !coupon.appliesToPlanIds.includes(sub.planId)) {
        throw new BadRequestException('Coupon does not apply to this plan');
      }
    }

    const [applied] = await Promise.all([
      db.appliedCoupon.create({
        data: {
          couponId: dto.couponId,
          customerId: dto.customerId,
          subscriptionId: dto.subscriptionId,
          usesRemaining: dto.usesRemaining,
        },
        include: { coupon: true, customer: true },
      }),
      db.coupon.update({
        where: { id: dto.couponId },
        data: { redemptionCount: { increment: 1 } },
      }),
    ]);

    return applied;
  }

  async removeApplied(db: PrismaClient, appliedCouponId: string) {
    const applied = await db.appliedCoupon.findUnique({ where: { id: appliedCouponId } });
    if (!applied) throw new NotFoundException('Applied coupon not found');

    await db.appliedCoupon.delete({ where: { id: appliedCouponId } });
    return { message: 'Coupon removed from customer' };
  }
}
