import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { PlanOverridesService } from '../../../src/modules/plan-overrides/plan-overrides.service';
import { createMockPrisma, MockPrisma } from '../../helpers/mock-prisma';
import { makePlanOverride, makeCustomer, makePlan } from '../../helpers/fixtures';

describe('PlanOverridesService', () => {
  let service: PlanOverridesService;
  let db: MockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanOverridesService],
    }).compile();

    service = module.get<PlanOverridesService>(PlanOverridesService);
    db = createMockPrisma();
  });

  // ─── CRUD ─────────────────────────────────────────────────────

  describe('create', () => {
    it('should create a plan override', async () => {
      db.customer.findUnique.mockResolvedValue(makeCustomer());
      db.plan.findUnique.mockResolvedValue(makePlan());
      db.planOverride.findUnique.mockResolvedValue(null);
      db.planOverride.create.mockResolvedValue(makePlanOverride());

      const result = await service.create(db as never, {
        customerId: 'cust_1',
        planId: 'plan_1',
        overriddenPrices: [{ currency: 'USD', amount: 39 }],
      });

      expect(result.id).toBe('po_1');
    });

    it('should throw NotFoundException for missing customer', async () => {
      db.customer.findUnique.mockResolvedValue(null);

      await expect(
        service.create(db as never, { customerId: 'bad', planId: 'plan_1' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for missing plan', async () => {
      db.customer.findUnique.mockResolvedValue(makeCustomer());
      db.plan.findUnique.mockResolvedValue(null);

      await expect(
        service.create(db as never, { customerId: 'cust_1', planId: 'bad' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException for duplicate customer+plan', async () => {
      db.customer.findUnique.mockResolvedValue(makeCustomer());
      db.plan.findUnique.mockResolvedValue(makePlan());
      db.planOverride.findUnique.mockResolvedValue(makePlanOverride());

      await expect(
        service.create(db as never, { customerId: 'cust_1', planId: 'plan_1' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated overrides', async () => {
      db.planOverride.findMany.mockResolvedValue([makePlanOverride()]);
      db.planOverride.count.mockResolvedValue(1);

      const result = await service.findAll(db as never, { page: 1, limit: 50 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by customerId', async () => {
      db.planOverride.findMany.mockResolvedValue([]);
      db.planOverride.count.mockResolvedValue(0);

      await service.findAll(db as never, { customerId: 'cust_1' });

      expect(db.planOverride.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ customerId: 'cust_1' }) }),
      );
    });
  });

  describe('findOne', () => {
    it('should return an override', async () => {
      db.planOverride.findUnique.mockResolvedValue(makePlanOverride());
      const result = await service.findOne(db as never, 'po_1');
      expect(result.id).toBe('po_1');
    });

    it('should throw NotFoundException when not found', async () => {
      db.planOverride.findUnique.mockResolvedValue(null);
      await expect(service.findOne(db as never, 'missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an override', async () => {
      const override = makePlanOverride();
      db.planOverride.findUnique.mockResolvedValue(override);
      db.planOverride.update.mockResolvedValue({
        ...override,
        overriddenPrices: [{ currency: 'USD', amount: 29 }],
      });

      const result = await service.update(db as never, 'po_1', {
        overriddenPrices: [{ currency: 'USD', amount: 29 }],
      });

      expect(result.overriddenPrices[0].amount).toBe(29);
    });

    it('should throw NotFoundException when not found', async () => {
      db.planOverride.findUnique.mockResolvedValue(null);
      await expect(service.update(db as never, 'missing', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an override', async () => {
      db.planOverride.findUnique.mockResolvedValue(makePlanOverride());
      db.planOverride.delete.mockResolvedValue(undefined);

      const result = await service.delete(db as never, 'po_1');
      expect(result.message).toContain('deleted');
    });

    it('should throw NotFoundException when not found', async () => {
      db.planOverride.findUnique.mockResolvedValue(null);
      await expect(service.delete(db as never, 'missing')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── Resolution Helpers ────────────────────────────────────────

  describe('resolvePrice', () => {
    it('should return overridden price when exists', async () => {
      db.planOverride.findUnique.mockResolvedValue(
        makePlanOverride({ overriddenPrices: [{ currency: 'USD', amount: 39 }] }),
      );

      const result = await service.resolvePrice(db as never, 'cust_1', 'plan_1', 'USD');
      expect(result).toBe(39);
    });

    it('should return null when no override exists', async () => {
      db.planOverride.findUnique.mockResolvedValue(null);

      const result = await service.resolvePrice(db as never, 'cust_1', 'plan_1', 'USD');
      expect(result).toBeNull();
    });

    it('should return null when currency not in override', async () => {
      db.planOverride.findUnique.mockResolvedValue(
        makePlanOverride({ overriddenPrices: [{ currency: 'EUR', amount: 45 }] }),
      );

      const result = await service.resolvePrice(db as never, 'cust_1', 'plan_1', 'USD');
      expect(result).toBeNull();
    });

    it('should return null when overriddenPrices is null', async () => {
      db.planOverride.findUnique.mockResolvedValue(
        makePlanOverride({ overriddenPrices: null }),
      );

      const result = await service.resolvePrice(db as never, 'cust_1', 'plan_1', 'USD');
      expect(result).toBeNull();
    });
  });

  describe('resolveMinimumCommitment', () => {
    it('should return overridden minimum commitment', async () => {
      db.planOverride.findUnique.mockResolvedValue(
        makePlanOverride({ overriddenMinimumCommitment: '500.00' }),
      );

      const result = await service.resolveMinimumCommitment(db as never, 'cust_1', 'plan_1');
      expect(result).toBe(500);
    });

    it('should return null when no override', async () => {
      db.planOverride.findUnique.mockResolvedValue(null);

      const result = await service.resolveMinimumCommitment(db as never, 'cust_1', 'plan_1');
      expect(result).toBeNull();
    });

    it('should return null when field is null', async () => {
      db.planOverride.findUnique.mockResolvedValue(
        makePlanOverride({ overriddenMinimumCommitment: null }),
      );

      const result = await service.resolveMinimumCommitment(db as never, 'cust_1', 'plan_1');
      expect(result).toBeNull();
    });
  });

  describe('resolveChargeProperties', () => {
    it('should return overridden charge properties', async () => {
      db.planOverride.findUnique.mockResolvedValue(
        makePlanOverride({
          overriddenCharges: [
            { chargeId: 'charge_1', properties: { unitAmount: '0.05' } },
          ],
        }),
      );

      const result = await service.resolveChargeProperties(
        db as never, 'cust_1', 'plan_1', 'charge_1',
      );

      expect(result).not.toBeNull();
      expect(result!.properties).toEqual({ unitAmount: '0.05' });
    });

    it('should return null when charge not in overrides', async () => {
      db.planOverride.findUnique.mockResolvedValue(
        makePlanOverride({
          overriddenCharges: [{ chargeId: 'charge_other', properties: {} }],
        }),
      );

      const result = await service.resolveChargeProperties(
        db as never, 'cust_1', 'plan_1', 'charge_1',
      );

      expect(result).toBeNull();
    });

    it('should return null when no override exists', async () => {
      db.planOverride.findUnique.mockResolvedValue(null);

      const result = await service.resolveChargeProperties(
        db as never, 'cust_1', 'plan_1', 'charge_1',
      );

      expect(result).toBeNull();
    });
  });
});
