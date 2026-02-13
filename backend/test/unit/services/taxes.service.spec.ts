import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { TaxesService } from '../../../src/modules/taxes/taxes.service';
import { createMockPrisma, MockPrisma } from '../../helpers/mock-prisma';
import { makeTax, makeCustomer } from '../../helpers/fixtures';

describe('TaxesService', () => {
  let service: TaxesService;
  let db: MockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxesService],
    }).compile();

    service = module.get<TaxesService>(TaxesService);
    db = createMockPrisma();
  });

  // ─── CRUD ─────────────────────────────────────────────────────

  describe('create', () => {
    it('should create a tax', async () => {
      const tax = makeTax();
      db.tax.findUnique.mockResolvedValue(null);
      db.tax.create.mockResolvedValue(tax);

      const result = await service.create(db as never, {
        name: 'VAT',
        code: 'vat',
        rate: 18,
      });

      expect(result.id).toBe('tax_1');
      expect(db.tax.create).toHaveBeenCalled();
    });

    it('should throw ConflictException for duplicate code', async () => {
      db.tax.findUnique.mockResolvedValue(makeTax());

      await expect(
        service.create(db as never, { name: 'VAT', code: 'vat', rate: 18 }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated taxes', async () => {
      db.tax.findMany.mockResolvedValue([makeTax()]);
      db.tax.count.mockResolvedValue(1);

      const result = await service.findAll(db as never, { page: 1, limit: 50 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
    });

    it('should filter by appliedByDefault', async () => {
      db.tax.findMany.mockResolvedValue([]);
      db.tax.count.mockResolvedValue(0);

      await service.findAll(db as never, { appliedByDefault: true });

      expect(db.tax.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { appliedByDefault: true } }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a tax', async () => {
      db.tax.findUnique.mockResolvedValue(makeTax());
      const result = await service.findOne(db as never, 'tax_1');
      expect(result.id).toBe('tax_1');
    });

    it('should throw NotFoundException when not found', async () => {
      db.tax.findUnique.mockResolvedValue(null);
      await expect(service.findOne(db as never, 'missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a tax', async () => {
      const tax = makeTax();
      db.tax.findUnique.mockResolvedValue(tax);
      db.tax.update.mockResolvedValue({ ...tax, rate: '20.00' });

      const result = await service.update(db as never, 'tax_1', { rate: 20 });
      expect(result.rate).toBe('20.00');
    });

    it('should throw NotFoundException when not found', async () => {
      db.tax.findUnique.mockResolvedValue(null);
      await expect(service.update(db as never, 'missing', { rate: 5 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a tax', async () => {
      db.tax.findUnique.mockResolvedValue(makeTax());
      db.tax.delete.mockResolvedValue(undefined);

      const result = await service.delete(db as never, 'tax_1');
      expect(result.message).toContain('deleted');
    });

    it('should throw NotFoundException when not found', async () => {
      db.tax.findUnique.mockResolvedValue(null);
      await expect(service.delete(db as never, 'missing')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── Assignments ──────────────────────────────────────────────

  describe('assignToCustomer', () => {
    it('should assign a tax to a customer', async () => {
      db.tax.findUnique.mockResolvedValue(makeTax());
      db.customer.findUnique.mockResolvedValue(makeCustomer());
      db.customerTax.create.mockResolvedValue({ customerId: 'cust_1', taxId: 'tax_1' });

      const result = await service.assignToCustomer(db as never, 'cust_1', 'tax_1');
      expect(result.customerId).toBe('cust_1');
    });

    it('should throw NotFoundException for invalid tax', async () => {
      db.tax.findUnique.mockResolvedValue(null);

      await expect(
        service.assignToCustomer(db as never, 'cust_1', 'bad_tax'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for invalid customer', async () => {
      db.tax.findUnique.mockResolvedValue(makeTax());
      db.customer.findUnique.mockResolvedValue(null);

      await expect(
        service.assignToCustomer(db as never, 'bad_cust', 'tax_1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('unassignFromCustomer', () => {
    it('should unassign a tax', async () => {
      db.customerTax.deleteMany.mockResolvedValue({ count: 1 });
      const result = await service.unassignFromCustomer(db as never, 'cust_1', 'tax_1');
      expect(result.message).toContain('unassigned');
    });
  });

  describe('getCustomerTaxes', () => {
    it('should return customer taxes', async () => {
      db.customerTax.findMany.mockResolvedValue([
        { tax: makeTax() },
      ]);
      const result = await service.getCustomerTaxes(db as never, 'cust_1');
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe('vat');
    });
  });

  describe('assignToPlan', () => {
    it('should assign a tax to a plan', async () => {
      db.tax.findUnique.mockResolvedValue(makeTax());
      db.plan.findUnique.mockResolvedValue({ id: 'plan_1' });
      db.planTax.create.mockResolvedValue({ planId: 'plan_1', taxId: 'tax_1' });

      const result = await service.assignToPlan(db as never, 'plan_1', 'tax_1');
      expect(result.planId).toBe('plan_1');
    });

    it('should throw NotFoundException for invalid plan', async () => {
      db.tax.findUnique.mockResolvedValue(makeTax());
      db.plan.findUnique.mockResolvedValue(null);

      await expect(
        service.assignToPlan(db as never, 'bad_plan', 'tax_1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('assignToCharge', () => {
    it('should assign a tax to a charge', async () => {
      db.tax.findUnique.mockResolvedValue(makeTax());
      db.chargeTax.create.mockResolvedValue({ chargeId: 'charge_1', taxId: 'tax_1' });

      const result = await service.assignToCharge(db as never, 'charge_1', 'tax_1');
      expect(result.chargeId).toBe('charge_1');
    });
  });

  // ─── Tax Resolution ───────────────────────────────────────────

  describe('resolveTaxes', () => {
    const vat = makeTax({ id: 'tax_vat', name: 'VAT', code: 'vat', rate: '18.00' });
    const gst = makeTax({ id: 'tax_gst', name: 'GST', code: 'gst', rate: '5.00' });

    it('should return charge-level taxes first (highest priority)', async () => {
      db.chargeTax.findMany.mockResolvedValue([{ tax: vat }]);

      const result = await service.resolveTaxes(db as never, 'cust_1', 'plan_1', 'charge_1');

      expect(result).toHaveLength(1);
      expect(result[0].code).toBe('vat');
      expect(result[0].rate).toBe(18);
      // Should not query plan or customer taxes
      expect(db.planTax.findMany).not.toHaveBeenCalled();
      expect(db.customerTax.findMany).not.toHaveBeenCalled();
    });

    it('should fall back to plan-level taxes when no charge taxes', async () => {
      db.chargeTax.findMany.mockResolvedValue([]);
      db.planTax.findMany.mockResolvedValue([{ tax: gst }]);

      const result = await service.resolveTaxes(db as never, 'cust_1', 'plan_1', 'charge_1');

      expect(result).toHaveLength(1);
      expect(result[0].code).toBe('gst');
      expect(db.customerTax.findMany).not.toHaveBeenCalled();
    });

    it('should fall back to customer-level taxes', async () => {
      db.chargeTax.findMany.mockResolvedValue([]);
      db.planTax.findMany.mockResolvedValue([]);
      db.customerTax.findMany.mockResolvedValue([{ tax: vat }]);

      const result = await service.resolveTaxes(db as never, 'cust_1', 'plan_1', 'charge_1');

      expect(result).toHaveLength(1);
      expect(result[0].code).toBe('vat');
    });

    it('should fall back to org defaults (appliedByDefault)', async () => {
      db.chargeTax.findMany.mockResolvedValue([]);
      db.planTax.findMany.mockResolvedValue([]);
      db.customerTax.findMany.mockResolvedValue([]);
      db.tax.findMany.mockResolvedValue([
        { ...vat, appliedByDefault: true },
      ]);

      const result = await service.resolveTaxes(db as never, 'cust_1', 'plan_1', 'charge_1');

      expect(result).toHaveLength(1);
      expect(db.tax.findMany).toHaveBeenCalledWith({ where: { appliedByDefault: true } });
    });

    it('should return empty array when no taxes at any level', async () => {
      db.customerTax.findMany.mockResolvedValue([]);
      db.tax.findMany.mockResolvedValue([]);

      const result = await service.resolveTaxes(db as never, 'cust_1');

      expect(result).toHaveLength(0);
    });

    it('should return multiple taxes', async () => {
      db.planTax.findMany.mockResolvedValue([{ tax: vat }, { tax: gst }]);
      db.chargeTax.findMany.mockResolvedValue([]);

      const result = await service.resolveTaxes(db as never, 'cust_1', 'plan_1');

      expect(result).toHaveLength(2);
    });
  });
});
