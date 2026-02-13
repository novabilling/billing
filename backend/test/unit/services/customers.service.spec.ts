import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { getQueueToken } from '@nestjs/bullmq';
import { CustomersService } from '../../../src/modules/customers/customers.service';
import { createMockQueue } from '../../helpers/mock-queue';
import { makeCustomer } from '../../helpers/fixtures';

const mockQueue = createMockQueue();

const mockCustomer = makeCustomer({ country: 'NG', currency: 'NGN' });

const mockDb = {
  customer: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  subscription: {
    findMany: jest.fn(),
  },
  invoice: {
    findMany: jest.fn(),
  },
};

describe('CustomersService', () => {
  let service: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: getQueueToken('webhook'), useValue: mockQueue },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated customers', async () => {
      mockDb.customer.findMany.mockResolvedValue([mockCustomer]);
      mockDb.customer.count.mockResolvedValue(1);

      const result = await service.findAll(mockDb as never, {
        page: 1,
        limit: 20,
      });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a customer', async () => {
      mockDb.customer.findUnique.mockResolvedValue({
        ...mockCustomer,
        subscriptions: [],
        invoices: [],
      });

      const result = await service.findOne(mockDb as never, 'cust_1');
      expect(result.id).toBe('cust_1');
    });

    it('should throw NotFoundException when customer not found', async () => {
      mockDb.customer.findUnique.mockResolvedValue(null);

      await expect(
        service.findOne(mockDb as never, 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a customer', async () => {
      mockDb.customer.findUnique.mockResolvedValue(null);
      mockDb.customer.create.mockResolvedValue(mockCustomer);

      const result = await service.create(mockDb as never, 'tenant_1', {
        externalId: 'ext_cust_1',
        email: 'customer@example.com',
        name: 'Test Customer',
        currency: 'NGN',
      });

      expect(result.id).toBe('cust_1');
    });

    it('should throw ConflictException for duplicate externalId', async () => {
      mockDb.customer.findUnique.mockResolvedValue(mockCustomer);

      await expect(
        service.create(mockDb as never, 'tenant_1', {
          externalId: 'ext_cust_1',
          email: 'customer@example.com',
          currency: 'NGN',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('delete', () => {
    it('should delete a customer without active subscriptions', async () => {
      mockDb.customer.findUnique.mockResolvedValue({
        ...mockCustomer,
        subscriptions: [],
      });
      mockDb.customer.delete.mockResolvedValue(mockCustomer);

      const result = await service.delete(mockDb as never, 'tenant_1', 'cust_1');
      expect(result.message).toContain('deleted');
    });

    it('should throw BadRequestException if customer has active subscriptions', async () => {
      mockDb.customer.findUnique.mockResolvedValue({
        ...mockCustomer,
        subscriptions: [{ id: 'sub_1', status: 'ACTIVE' }],
      });

      await expect(
        service.delete(mockDb as never, 'tenant_1', 'cust_1'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
