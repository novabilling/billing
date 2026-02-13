import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ChargesService } from '../../../src/modules/charges/charges.service';
import { createMockPrisma, MockPrisma } from '../../helpers/mock-prisma';
import { makeCharge, makeChargeGraduatedRange } from '../../helpers/fixtures';

describe('ChargesService', () => {
  let service: ChargesService;
  let db: MockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChargesService],
    }).compile();

    service = module.get<ChargesService>(ChargesService);
    db = createMockPrisma();
  });

  describe('findAll', () => {
    it('should return all charges', async () => {
      db.charge.findMany.mockResolvedValue([makeCharge()]);
      const result = await service.findAll(db as never);
      expect(result).toHaveLength(1);
    });

    it('should filter by planId', async () => {
      db.charge.findMany.mockResolvedValue([]);
      await service.findAll(db as never, 'plan_1');
      expect(db.charge.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ planId: 'plan_1' }) }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a charge with graduated ranges', async () => {
      db.charge.findUnique.mockResolvedValue({
        ...makeCharge(),
        graduatedRanges: [makeChargeGraduatedRange()],
        billableMetric: { id: 'metric_1', name: 'API Calls' },
      });

      const result = await service.findOne(db as never, 'charge_1');
      expect(result.id).toBe('charge_1');
    });

    it('should throw NotFoundException when not found', async () => {
      db.charge.findUnique.mockResolvedValue(null);
      await expect(service.findOne(db as never, 'missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByPlan', () => {
    it('should return charges for a plan', async () => {
      db.charge.findMany.mockResolvedValue([makeCharge()]);
      const result = await service.findByPlan(db as never, 'plan_1');
      expect(result).toHaveLength(1);
    });
  });

  describe('create', () => {
    it('should create a standard charge', async () => {
      db.plan.findUnique.mockResolvedValue({ id: 'plan_1' });
      db.billableMetric.findUnique.mockResolvedValue({ id: 'metric_1' });
      db.charge.create.mockResolvedValue(makeCharge());

      const result = await service.create(db as never, {
        planId: 'plan_1',
        billableMetricId: 'metric_1',
        chargeModel: 'STANDARD' as any,
        properties: { unitAmount: '0.01' },
      });

      expect(result.id).toBe('charge_1');
    });

    it('should create a graduated charge with ranges', async () => {
      db.plan.findUnique.mockResolvedValue({ id: 'plan_1' });
      db.billableMetric.findUnique.mockResolvedValue({ id: 'metric_1' });
      db.charge.create.mockResolvedValue({
        ...makeCharge({ chargeModel: 'GRADUATED' }),
        graduatedRanges: [makeChargeGraduatedRange()],
      });

      const result = await service.create(db as never, {
        planId: 'plan_1',
        billableMetricId: 'metric_1',
        chargeModel: 'GRADUATED' as any,
        graduatedRanges: [{ fromValue: 0, toValue: 1000, perUnitAmount: 0.01, flatAmount: 0 }],
      });

      expect(result.chargeModel).toBe('GRADUATED');
    });
  });

  describe('update', () => {
    it('should update a charge', async () => {
      db.charge.findUnique.mockResolvedValue(makeCharge());
      db.charge.update.mockResolvedValue(makeCharge({ invoiceDisplayName: 'Updated' }));

      const result = await service.update(db as never, 'charge_1', {
        invoiceDisplayName: 'Updated',
      });

      expect(result.invoiceDisplayName).toBe('Updated');
    });

    it('should throw NotFoundException when not found', async () => {
      db.charge.findUnique.mockResolvedValue(null);
      await expect(service.update(db as never, 'missing', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a charge', async () => {
      db.charge.findUnique.mockResolvedValue(makeCharge());
      db.charge.delete.mockResolvedValue(undefined);

      const result = await service.delete(db as never, 'charge_1');
      expect(result.message).toContain('deleted');
    });

    it('should throw NotFoundException when not found', async () => {
      db.charge.findUnique.mockResolvedValue(null);
      await expect(service.delete(db as never, 'missing')).rejects.toThrow(NotFoundException);
    });
  });
});
