import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getQueueToken } from '@nestjs/bullmq';
import { EventsService } from '../../../src/modules/events/events.service';
import { createMockPrisma, MockPrisma } from '../../helpers/mock-prisma';
import { createMockQueue, MockQueue } from '../../helpers/mock-queue';
import { makeUsageEvent, makeSubscription, makeBillableMetric } from '../../helpers/fixtures';

describe('EventsService', () => {
  let service: EventsService;
  let db: MockPrisma;
  let billingQueue: MockQueue;

  beforeEach(async () => {
    billingQueue = createMockQueue();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: getQueueToken('billing'), useValue: billingQueue },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    db = createMockPrisma();
  });

  describe('findOne', () => {
    it('should return an event by ID', async () => {
      db.usageEvent.findUnique.mockResolvedValue(makeUsageEvent());

      const result = await service.findOne(db as never, 'evt_1');
      expect(result.id).toBe('evt_1');
    });

    it('should throw NotFoundException when not found', async () => {
      db.usageEvent.findUnique.mockResolvedValue(null);
      await expect(service.findOne(db as never, 'missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySubscription', () => {
    it('should return paginated events', async () => {
      db.usageEvent.findMany.mockResolvedValue([makeUsageEvent()]);
      db.usageEvent.count.mockResolvedValue(1);

      const result = await service.findBySubscription(db as never, 'sub_1');

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by code and date range', async () => {
      db.usageEvent.findMany.mockResolvedValue([]);
      db.usageEvent.count.mockResolvedValue(0);

      await service.findBySubscription(db as never, 'sub_1', {
        code: 'api_calls',
        from: '2026-01-01',
        to: '2026-01-31',
      });

      expect(db.usageEvent.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            subscriptionId: 'sub_1',
            code: 'api_calls',
            timestamp: expect.objectContaining({
              gte: expect.any(Date),
              lte: expect.any(Date),
            }),
          }),
        }),
      );
    });
  });

  describe('create', () => {
    it('should create an event and return it', async () => {
      const event = makeUsageEvent();
      db.usageEvent.findUnique.mockResolvedValue(null); // no duplicate
      db.subscription.findUnique.mockResolvedValue(makeSubscription());
      db.billableMetric.findUnique.mockResolvedValue(makeBillableMetric());
      db.usageEvent.create.mockResolvedValue(event);

      const result = await service.create(db as never, {
        transactionId: 'txn_unique_1',
        subscriptionId: 'sub_1',
        code: 'api_calls',
        properties: {},
      });

      expect(result.id).toBe('evt_1');
      expect(db.usageEvent.create).toHaveBeenCalled();
    });

    it('should return existing event for duplicate transactionId (idempotency)', async () => {
      const existing = makeUsageEvent();
      db.usageEvent.findUnique.mockResolvedValue(existing);

      const result = await service.create(db as never, {
        transactionId: 'txn_unique_1',
        subscriptionId: 'sub_1',
        code: 'api_calls',
      });

      expect(result.id).toBe('evt_1');
      expect(db.usageEvent.create).not.toHaveBeenCalled();
    });

    it('should resolve subscription by externalId fallback', async () => {
      db.usageEvent.findUnique.mockResolvedValue(null);
      db.subscription.findUnique
        .mockResolvedValueOnce(null) // ID lookup fails
        .mockResolvedValueOnce(makeSubscription()); // externalId lookup succeeds
      db.billableMetric.findUnique.mockResolvedValue(makeBillableMetric());
      db.usageEvent.create.mockResolvedValue(makeUsageEvent());

      await service.create(db as never, {
        transactionId: 'txn_2',
        subscriptionId: 'ext_sub_1',
        code: 'api_calls',
      });

      expect(db.subscription.findUnique).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException for invalid subscription', async () => {
      db.usageEvent.findUnique.mockResolvedValue(null);
      db.subscription.findUnique.mockResolvedValue(null);

      await expect(
        service.create(db as never, {
          transactionId: 'txn_3',
          subscriptionId: 'bad_sub',
          code: 'api_calls',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for invalid metric code', async () => {
      db.usageEvent.findUnique.mockResolvedValue(null);
      db.subscription.findUnique.mockResolvedValue(makeSubscription());
      db.billableMetric.findUnique.mockResolvedValue(null);

      await expect(
        service.create(db as never, {
          transactionId: 'txn_4',
          subscriptionId: 'sub_1',
          code: 'bad_metric',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should queue progressive billing check for active subscriptions', async () => {
      db.usageEvent.findUnique.mockResolvedValue(null);
      db.subscription.findUnique.mockResolvedValue(makeSubscription({ status: 'ACTIVE' }));
      db.billableMetric.findUnique.mockResolvedValue(makeBillableMetric());
      db.usageEvent.create.mockResolvedValue(makeUsageEvent());

      await service.create(db as never, {
        transactionId: 'txn_5',
        subscriptionId: 'sub_1',
        code: 'api_calls',
      }, 'tenant_1');

      expect(billingQueue.add).toHaveBeenCalledWith(
        'check-progressive-billing',
        { tenantId: 'tenant_1', subscriptionId: 'sub_1' },
        expect.objectContaining({
          delay: 60000,
          jobId: 'progressive-sub_1',
        }),
      );
    });

    it('should NOT queue progressive billing when no tenantId', async () => {
      db.usageEvent.findUnique.mockResolvedValue(null);
      db.subscription.findUnique.mockResolvedValue(makeSubscription());
      db.billableMetric.findUnique.mockResolvedValue(makeBillableMetric());
      db.usageEvent.create.mockResolvedValue(makeUsageEvent());

      await service.create(db as never, {
        transactionId: 'txn_6',
        subscriptionId: 'sub_1',
        code: 'api_calls',
      });

      expect(billingQueue.add).not.toHaveBeenCalled();
    });
  });

  describe('createBatch', () => {
    it('should process batch events and return summary', async () => {
      db.usageEvent.findUnique.mockResolvedValue(null);
      db.subscription.findUnique.mockResolvedValue(makeSubscription());
      db.usageEvent.create.mockResolvedValue(makeUsageEvent());

      const result = await service.createBatch(db as never, {
        events: [
          { transactionId: 'txn_b1', subscriptionId: 'sub_1', code: 'api_calls' },
          { transactionId: 'txn_b2', subscriptionId: 'sub_1', code: 'api_calls' },
        ],
      });

      expect(result.total).toBe(2);
      expect(result.created).toBe(2);
      expect(result.duplicates).toBe(0);
      expect(result.errors).toBe(0);
    });

    it('should handle duplicates in batch', async () => {
      db.usageEvent.findUnique
        .mockResolvedValueOnce(makeUsageEvent()) // first event is duplicate
        .mockResolvedValueOnce(null); // second is new
      db.subscription.findUnique.mockResolvedValue(makeSubscription());
      db.usageEvent.create.mockResolvedValue(makeUsageEvent());

      const result = await service.createBatch(db as never, {
        events: [
          { transactionId: 'txn_dup', subscriptionId: 'sub_1', code: 'api_calls' },
          { transactionId: 'txn_new', subscriptionId: 'sub_1', code: 'api_calls' },
        ],
      });

      expect(result.duplicates).toBe(1);
      expect(result.created).toBe(1);
    });

    it('should handle errors in batch without failing other events', async () => {
      db.usageEvent.findUnique.mockResolvedValue(null);
      db.subscription.findUnique
        .mockResolvedValueOnce(null) // first event: bad sub
        .mockResolvedValueOnce(null) // first event: externalId also fails
        .mockResolvedValueOnce(makeSubscription()); // second event: ok
      db.usageEvent.create.mockResolvedValue(makeUsageEvent());

      const result = await service.createBatch(db as never, {
        events: [
          { transactionId: 'txn_err', subscriptionId: 'bad_sub', code: 'api_calls' },
          { transactionId: 'txn_ok', subscriptionId: 'sub_1', code: 'api_calls' },
        ],
      });

      expect(result.errors).toBe(1);
      expect(result.created).toBe(1);
    });

    it('should queue progressive billing for affected subscriptions', async () => {
      db.usageEvent.findUnique.mockResolvedValue(null);
      db.subscription.findUnique.mockResolvedValue(makeSubscription({ status: 'ACTIVE' }));
      db.usageEvent.create.mockResolvedValue(makeUsageEvent());

      await service.createBatch(
        db as never,
        {
          events: [
            { transactionId: 'txn_p1', subscriptionId: 'sub_1', code: 'api_calls' },
            { transactionId: 'txn_p2', subscriptionId: 'sub_1', code: 'api_calls' },
          ],
        },
        'tenant_1',
      );

      // Should only queue once per subscription (deduped by Set)
      expect(billingQueue.add).toHaveBeenCalledTimes(1);
      expect(billingQueue.add).toHaveBeenCalledWith(
        'check-progressive-billing',
        { tenantId: 'tenant_1', subscriptionId: 'sub_1' },
        expect.objectContaining({ jobId: 'progressive-sub_1' }),
      );
    });
  });
});
