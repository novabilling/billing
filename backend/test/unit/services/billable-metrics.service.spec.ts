import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { BillableMetricsService } from '../../../src/modules/billable-metrics/billable-metrics.service';
import { createMockPrisma, MockPrisma } from '../../helpers/mock-prisma';
import { makeBillableMetric } from '../../helpers/fixtures';

describe('BillableMetricsService', () => {
  let service: BillableMetricsService;
  let db: MockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillableMetricsService],
    }).compile();

    service = module.get<BillableMetricsService>(BillableMetricsService);
    db = createMockPrisma();
  });

  describe('findAll', () => {
    it('should return all billable metrics', async () => {
      db.billableMetric.findMany.mockResolvedValue([makeBillableMetric()]);
      const result = await service.findAll(db as never);
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe('api_calls');
    });
  });

  describe('findOne', () => {
    it('should return a metric by ID', async () => {
      db.billableMetric.findUnique.mockResolvedValue(makeBillableMetric());
      const result = await service.findOne(db as never, 'metric_1');
      expect(result.id).toBe('metric_1');
    });

    it('should throw NotFoundException when not found', async () => {
      db.billableMetric.findUnique.mockResolvedValue(null);
      await expect(service.findOne(db as never, 'missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCode', () => {
    it('should return a metric by code', async () => {
      db.billableMetric.findUnique.mockResolvedValue(makeBillableMetric());
      const result = await service.findByCode(db as never, 'api_calls');
      expect(result.code).toBe('api_calls');
    });

    it('should throw NotFoundException for invalid code', async () => {
      db.billableMetric.findUnique.mockResolvedValue(null);
      await expect(service.findByCode(db as never, 'bad_code')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a COUNT metric', async () => {
      db.billableMetric.findUnique.mockResolvedValue(null);
      db.billableMetric.create.mockResolvedValue(makeBillableMetric());

      const result = await service.create(db as never, {
        name: 'API Calls',
        code: 'api_calls',
        aggregationType: 'COUNT' as any,
      });

      expect(result.aggregationType).toBe('COUNT');
    });

    it('should create a SUM metric with fieldName', async () => {
      db.billableMetric.findUnique.mockResolvedValue(null);
      db.billableMetric.create.mockResolvedValue(
        makeBillableMetric({ aggregationType: 'SUM', fieldName: 'bytes_transferred' }),
      );

      const result = await service.create(db as never, {
        name: 'Data Transfer',
        code: 'data_transfer',
        aggregationType: 'SUM' as any,
        fieldName: 'bytes_transferred',
      });

      expect(result.aggregationType).toBe('SUM');
      expect(result.fieldName).toBe('bytes_transferred');
    });

    it('should throw ConflictException for duplicate code', async () => {
      db.billableMetric.findUnique.mockResolvedValue(makeBillableMetric());

      await expect(
        service.create(db as never, {
          name: 'API Calls',
          code: 'api_calls',
          aggregationType: 'COUNT' as any,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update a metric', async () => {
      db.billableMetric.findUnique.mockResolvedValue(makeBillableMetric());
      db.billableMetric.update.mockResolvedValue(makeBillableMetric({ name: 'Updated Metric' }));

      const result = await service.update(db as never, 'metric_1', { name: 'Updated Metric' });
      expect(result.name).toBe('Updated Metric');
    });

    it('should throw NotFoundException when not found', async () => {
      db.billableMetric.findUnique.mockResolvedValue(null);
      await expect(service.update(db as never, 'missing', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a metric', async () => {
      db.billableMetric.findUnique.mockResolvedValue({
        ...makeBillableMetric(),
        _count: { charges: 0 },
      });
      db.billableMetric.delete.mockResolvedValue(undefined);

      const result = await service.delete(db as never, 'metric_1');
      expect(result.message).toContain('deleted');
    });

    it('should throw NotFoundException when not found', async () => {
      db.billableMetric.findUnique.mockResolvedValue(null);
      await expect(service.delete(db as never, 'missing')).rejects.toThrow(NotFoundException);
    });
  });
});
