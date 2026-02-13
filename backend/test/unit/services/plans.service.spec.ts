import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PlansService } from '../../../src/modules/plans/plans.service';
import { createMockPrisma, MockPrisma } from '../../helpers/mock-prisma';
import { makePlan, makePlanPrice } from '../../helpers/fixtures';

describe('PlansService', () => {
  let service: PlansService;
  let db: MockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlansService],
    }).compile();

    service = module.get<PlansService>(PlansService);
    db = createMockPrisma();
  });

  describe('findAll', () => {
    it('should return all plans with prices', async () => {
      db.plan.findMany.mockResolvedValue([makePlan()]);

      const result = await service.findAll(db as never);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Pro Monthly');
    });

    it('should filter by isActive', async () => {
      db.plan.findMany.mockResolvedValue([]);

      await service.findAll(db as never, true);

      expect(db.plan.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isActive: true } }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a plan with prices and subscription count', async () => {
      db.plan.findUnique.mockResolvedValue({
        ...makePlan(),
        prices: [makePlanPrice()],
        _count: { subscriptions: 5 },
      });

      const result = await service.findOne(db as never, 'plan_1');
      expect(result.id).toBe('plan_1');
      expect(result._count.subscriptions).toBe(5);
    });

    it('should throw NotFoundException when not found', async () => {
      db.plan.findUnique.mockResolvedValue(null);
      await expect(service.findOne(db as never, 'missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a plan with prices', async () => {
      db.plan.findUnique.mockResolvedValue(null);
      db.plan.create.mockResolvedValue({
        ...makePlan(),
        prices: [makePlanPrice()],
      });

      const result = await service.create(db as never, {
        name: 'Pro Monthly',
        code: 'pro_monthly',
        billingInterval: 'MONTHLY' as any,
        prices: [{ currency: 'USD', amount: 49 }],
      });

      expect(result.name).toBe('Pro Monthly');
      expect(result.prices).toHaveLength(1);
    });

    it('should throw ConflictException for duplicate code', async () => {
      db.plan.findUnique.mockResolvedValue(makePlan());

      await expect(
        service.create(db as never, {
          name: 'Pro Monthly',
          code: 'pro_monthly',
          billingInterval: 'MONTHLY' as any,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should pass through new billing fields', async () => {
      db.plan.findUnique.mockResolvedValue(null);
      db.plan.create.mockResolvedValue(makePlan({
        netPaymentTerms: 30,
        invoiceGracePeriodDays: 3,
        progressiveBillingThreshold: 1000,
      }));

      const result = await service.create(db as never, {
        name: 'Enterprise',
        code: 'enterprise',
        billingInterval: 'MONTHLY' as any,
        netPaymentTerms: 30,
        invoiceGracePeriodDays: 3,
        progressiveBillingThreshold: 1000,
      });

      expect(db.plan.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            netPaymentTerms: 30,
            invoiceGracePeriodDays: 3,
            progressiveBillingThreshold: 1000,
          }),
        }),
      );
    });
  });

  describe('update', () => {
    it('should update a plan', async () => {
      db.plan.findUnique.mockResolvedValue(makePlan());
      db.plan.update.mockResolvedValue(makePlan({ name: 'Updated Plan' }));

      const result = await service.update(db as never, 'plan_1', { name: 'Updated Plan' });
      expect(result.name).toBe('Updated Plan');
    });

    it('should throw NotFoundException when not found', async () => {
      db.plan.findUnique.mockResolvedValue(null);
      await expect(service.update(db as never, 'missing', { name: 'X' })).rejects.toThrow(NotFoundException);
    });

    it('should update billing fields', async () => {
      db.plan.findUnique.mockResolvedValue(makePlan());
      db.plan.update.mockResolvedValue(makePlan({ netPaymentTerms: 60 }));

      await service.update(db as never, 'plan_1', { netPaymentTerms: 60 });

      expect(db.plan.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ netPaymentTerms: 60 }),
        }),
      );
    });
  });

  describe('delete', () => {
    it('should delete a plan without subscriptions', async () => {
      db.plan.findUnique.mockResolvedValue({
        ...makePlan(),
        _count: { subscriptions: 0 },
      });
      db.plan.delete.mockResolvedValue(undefined);

      const result = await service.delete(db as never, 'plan_1');
      expect(result.message).toContain('deleted');
    });

    it('should throw BadRequestException if plan has subscriptions', async () => {
      db.plan.findUnique.mockResolvedValue({
        ...makePlan(),
        _count: { subscriptions: 3 },
      });

      await expect(service.delete(db as never, 'plan_1')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when not found', async () => {
      db.plan.findUnique.mockResolvedValue(null);
      await expect(service.delete(db as never, 'missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('addPrice', () => {
    it('should add a price to a plan', async () => {
      db.plan.findUnique.mockResolvedValue(makePlan());
      db.planPrice.create.mockResolvedValue(makePlanPrice({ currency: 'EUR', amount: '45.00' }));

      const result = await service.addPrice(db as never, 'plan_1', { currency: 'eur', amount: 45 });
      expect(result.currency).toBe('EUR');
    });

    it('should throw NotFoundException for invalid plan', async () => {
      db.plan.findUnique.mockResolvedValue(null);

      await expect(
        service.addPrice(db as never, 'missing', { currency: 'USD', amount: 10 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePrice', () => {
    it('should update a price', async () => {
      db.planPrice.findFirst.mockResolvedValue(makePlanPrice());
      db.planPrice.update.mockResolvedValue(makePlanPrice({ amount: '99.00' }));

      const result = await service.updatePrice(db as never, 'plan_1', 'price_1', 99);
      expect(result.amount).toBe('99.00');
    });

    it('should throw NotFoundException when price not found', async () => {
      db.planPrice.findFirst.mockResolvedValue(null);
      await expect(service.updatePrice(db as never, 'plan_1', 'bad', 10)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deletePrice', () => {
    it('should delete a price', async () => {
      db.planPrice.findFirst.mockResolvedValue(makePlanPrice());
      db.planPrice.delete.mockResolvedValue(undefined);

      const result = await service.deletePrice(db as never, 'plan_1', 'price_1');
      expect(result.message).toContain('deleted');
    });

    it('should throw NotFoundException when price not found', async () => {
      db.planPrice.findFirst.mockResolvedValue(null);
      await expect(service.deletePrice(db as never, 'plan_1', 'bad')).rejects.toThrow(NotFoundException);
    });
  });
});
