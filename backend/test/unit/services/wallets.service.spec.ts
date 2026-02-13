import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { getQueueToken } from '@nestjs/bullmq';
import { WalletsService } from '../../../src/modules/wallets/wallets.service';
import { createMockPrisma, MockPrisma } from '../../helpers/mock-prisma';
import { createMockQueue } from '../../helpers/mock-queue';
import { makeWallet, makeWalletTransaction, makeCustomer } from '../../helpers/fixtures';

describe('WalletsService', () => {
  let service: WalletsService;
  let db: MockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletsService,
        { provide: getQueueToken('webhook'), useValue: createMockQueue() },
      ],
    }).compile();

    service = module.get<WalletsService>(WalletsService);
    db = createMockPrisma();
  });

  describe('create', () => {
    it('should create a wallet for a customer', async () => {
      const wallet = makeWallet();
      db.customer.findUnique.mockResolvedValue(makeCustomer());
      db.wallet.create.mockResolvedValue(wallet);
      // create() calls findOne() at the end, which does findUnique
      db.wallet.findUnique.mockResolvedValue(wallet);

      const result = await service.create(db as never, 'tenant_1', {
        customerId: 'cust_1',
        name: 'Main Wallet',
        currency: 'USD',
        rateAmount: 1,
      });

      expect(result.id).toBe('wallet_1');
      expect(db.wallet.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException for invalid customer', async () => {
      db.customer.findUnique.mockResolvedValue(null);

      await expect(
        service.create(db as never, 'tenant_1', {
          customerId: 'bad',
          name: 'Wallet',
          currency: 'USD',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated wallets', async () => {
      db.wallet.findMany.mockResolvedValue([makeWallet()]);
      db.wallet.count.mockResolvedValue(1);

      const result = await service.findAll(db as never, { page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by customerId', async () => {
      db.wallet.findMany.mockResolvedValue([]);
      db.wallet.count.mockResolvedValue(0);

      await service.findAll(db as never, { customerId: 'cust_1' });

      expect(db.wallet.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ customerId: 'cust_1' }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a wallet', async () => {
      db.wallet.findUnique.mockResolvedValue(makeWallet());
      const result = await service.findOne(db as never, 'wallet_1');
      expect(result.id).toBe('wallet_1');
    });

    it('should throw NotFoundException when not found', async () => {
      db.wallet.findUnique.mockResolvedValue(null);
      await expect(service.findOne(db as never, 'missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('terminate', () => {
    it('should terminate an active wallet', async () => {
      const wallet = makeWallet({ status: 'ACTIVE', creditsBalance: '50.00' });
      db.wallet.findUnique.mockResolvedValue(wallet);
      db.wallet.update.mockResolvedValue({ ...wallet, status: 'TERMINATED' });
      db.walletTransaction.create.mockResolvedValue(makeWalletTransaction());

      const result = await service.terminate(db as never, 'tenant_1', 'wallet_1');
      expect(result.status).toBe('TERMINATED');
    });

    it('should throw BadRequestException for already terminated wallet', async () => {
      db.wallet.findUnique.mockResolvedValue(makeWallet({ status: 'TERMINATED' }));

      await expect(
        service.terminate(db as never, 'tenant_1', 'wallet_1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('topUp', () => {
    it('should top up a wallet with purchased credits', async () => {
      const wallet = makeWallet({ creditsBalance: '100.00', balance: '100.00' });
      // topUp: 1st findUnique (initial check), addCredits: 2nd findUnique, then findOne: 3rd findUnique
      db.wallet.findUnique
        .mockResolvedValueOnce(wallet)   // topUp initial
        .mockResolvedValueOnce(wallet)   // addCredits internal
        .mockResolvedValueOnce({ ...wallet, balanceCredits: '200.00' }); // findOne at end
      db.walletTransaction.create.mockResolvedValue(makeWalletTransaction());
      db.wallet.update.mockResolvedValue({});

      const result = await service.topUp(db as never, 'tenant_1', {
        walletId: 'wallet_1',
        paidCredits: 100,
        grantedCredits: 0,
      });

      expect(result.wallet).toBeDefined();
    });

    it('should throw NotFoundException for invalid wallet', async () => {
      db.wallet.findUnique.mockResolvedValue(null);

      await expect(
        service.topUp(db as never, 'tenant_1', {
          walletId: 'missing',
          paidCredits: 100,
          grantedCredits: 0,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when no credits specified', async () => {
      const wallet = makeWallet();
      db.wallet.findUnique.mockResolvedValue(wallet);

      await expect(
        service.topUp(db as never, 'tenant_1', {
          walletId: 'wallet_1',
          paidCredits: 0,
          grantedCredits: 0,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('listTransactions', () => {
    it('should return paginated transactions', async () => {
      db.wallet.findUnique.mockResolvedValue(makeWallet());
      db.walletTransaction.findMany.mockResolvedValue([makeWalletTransaction()]);
      db.walletTransaction.count.mockResolvedValue(1);

      const result = await service.listTransactions(db as never, 'wallet_1', {});

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should throw NotFoundException for invalid wallet', async () => {
      db.wallet.findUnique.mockResolvedValue(null);

      await expect(
        service.listTransactions(db as never, 'missing', {}),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('applyToInvoice', () => {
    it('should deduct from oldest wallet first', async () => {
      const wallet1 = makeWallet({ id: 'w1', balance: '50.00', creditsBalance: '50.00', rateAmount: '1.00' });
      const wallet2 = makeWallet({ id: 'w2', balance: '100.00', creditsBalance: '100.00', rateAmount: '1.00' });
      db.wallet.findMany.mockResolvedValue([wallet1, wallet2]);
      // removeCredits calls findUnique for each wallet
      db.wallet.findUnique
        .mockResolvedValueOnce(wallet1)   // removeCredits for w1
        .mockResolvedValueOnce(wallet2);  // removeCredits for w2
      db.walletTransaction.create.mockResolvedValue(makeWalletTransaction());
      db.wallet.update.mockResolvedValue({});

      const deducted = await service.applyToInvoice(
        db as never, 'tenant_1', 'cust_1', 'inv_1', 75, 'USD',
      );

      expect(deducted).toBe(75);
      expect(db.walletTransaction.create).toHaveBeenCalledTimes(2);
    });

    it('should return 0 when no wallets available', async () => {
      db.wallet.findMany.mockResolvedValue([]);

      const deducted = await service.applyToInvoice(
        db as never, 'tenant_1', 'cust_1', 'inv_1', 100, 'USD',
      );

      expect(deducted).toBe(0);
    });

    it('should return 0 for zero invoice amount', async () => {
      const deducted = await service.applyToInvoice(
        db as never, 'tenant_1', 'cust_1', 'inv_1', 0, 'USD',
      );

      expect(deducted).toBe(0);
    });
  });

  describe('processExpirations', () => {
    it('should expire wallets past expirationAt', async () => {
      const expiredWallet = makeWallet({
        id: 'w_exp',
        expirationAt: new Date('2025-01-01'),
        status: 'ACTIVE',
        creditsBalance: '50.00',
        rateAmount: '1.00',
      });
      db.wallet.findMany.mockResolvedValue([expiredWallet]);
      // removeCredits calls findUnique
      db.wallet.findUnique.mockResolvedValue(expiredWallet);
      db.walletTransaction.create.mockResolvedValue(makeWalletTransaction());
      db.wallet.update.mockResolvedValue({});

      const count = await service.processExpirations(db as never, 'tenant_1');
      expect(count).toBe(1);
      // removeCredits update + TERMINATED update
      expect(db.wallet.update).toHaveBeenCalledTimes(2);
    });

    it('should return 0 when no wallets to expire', async () => {
      db.wallet.findMany.mockResolvedValue([]);
      const count = await service.processExpirations(db as never, 'tenant_1');
      expect(count).toBe(0);
    });
  });
});
