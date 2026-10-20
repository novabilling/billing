import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { Public } from '../../common/decorators/public.decorator';
import { TenantDb } from '../../common/decorators/tenant-db.decorator';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { IdempotencyInterceptor } from '../../common/idempotency/idempotency.interceptor';
import { RequestWithTenant } from '../../common/interfaces/request-with-tenant.interface';
import {
  CreateCollectionDto,
  CreatePayoutDto,
  CreateTransferDto,
  UpdateMoneySettingsDto,
  VerifyPayeeDto,
  RequestOtpDto,
  AssignDepositDto,
  OpenManagedAccountDto,
} from './dto/money.dto';
import { MoneyService } from './money.service';
import { ManagedAccountsService } from './managed.service';

const IDEMPOTENCY_HEADER = {
  name: 'Idempotency-Key',
  required: false,
  description: 'Retry safely: a repeated key with the same body returns the first response',
};

const listQuery = (q: Record<string, string | undefined>) => ({
  status: q.status,
  page: q.page ? Number(q.page) : undefined,
  limit: q.limit ? Number(q.limit) : undefined,
  walletId: q.walletId,
  customerId: q.customerId,
});

@ApiTags('Collections')
@ApiBearerAuth('api-key')
@Public()
@UseGuards(TenantGuard)
@UseInterceptors(IdempotencyInterceptor)
@Controller('collections')
export class CollectionsController {
  constructor(private readonly money: MoneyService) {}

  @Post()
  @ApiOperation({
    summary: 'Collect a one-time payment',
    description:
      'Starts a payment that is not tied to an invoice: a mobile money PIN prompt, or a hosted checkout link ' +
      '(card, bank or mobile money on the provider page). The result arrives as collection.succeeded or collection.failed.',
  })
  @ApiHeader(IDEMPOTENCY_HEADER)
  create(@TenantDb() db: PrismaClient, @Req() req: RequestWithTenant, @Body() dto: CreateCollectionDto) {
    return this.money.createCollection(db, req.tenant, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List collections' })
  @ApiQuery({ name: 'status', required: false })
  list(@TenantDb() db: PrismaClient, @Query() q: Record<string, string>) {
    return this.money.list(db, 'COLLECTION', listQuery(q));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a collection' })
  get(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.money.get(db, 'COLLECTION', id);
  }

  @Post(':id/refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Check the collection status with the provider now' })
  refresh(@TenantDb() db: PrismaClient, @Req() req: RequestWithTenant, @Param('id') id: string) {
    return this.money.refresh(db, req.tenant.id, id);
  }

  @Post(':id/cancel')
  @HttpCode(200)
  @ApiOperation({ summary: 'Cancel a collection that has not reached the provider' })
  cancel(@TenantDb() db: PrismaClient, @Req() req: RequestWithTenant, @Param('id') id: string) {
    return this.money.cancel(db, req.tenant, id);
  }
}

@ApiTags('Payouts')
@ApiBearerAuth('api-key')
@Public()
@UseGuards(TenantGuard)
@UseInterceptors(IdempotencyInterceptor)
@Controller('payouts')
export class PayoutsController {
  constructor(private readonly money: MoneyService) {}

  @Post()
  @ApiOperation({
    summary: 'Send a payout',
    description:
      'Pays a mobile money number, bank account, PayPal or Yo account from your provider balance, or from a customer ' +
      'wallet. Payouts above your approval threshold wait for approval in the dashboard. A payout whose outcome is ' +
      'unknown is marked stuck and never sent twice.',
  })
  @ApiHeader(IDEMPOTENCY_HEADER)
  create(@TenantDb() db: PrismaClient, @Req() req: RequestWithTenant, @Body() dto: CreatePayoutDto) {
    return this.money.createPayout(db, req.tenant, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List payouts' })
  @ApiQuery({ name: 'status', required: false })
  list(@TenantDb() db: PrismaClient, @Query() q: Record<string, string>) {
    return this.money.list(db, 'PAYOUT', listQuery(q));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a payout' })
  get(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.money.get(db, 'PAYOUT', id);
  }

  @Post(':id/approve')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Approve a payout',
    description: 'Only from a signed-in dashboard session, so an API key alone can never both create and approve a payout.',
  })
  approve(@TenantDb() db: PrismaClient, @Req() req: RequestWithTenant, @Param('id') id: string) {
    if (req.authMethod !== 'session') {
      throw new ForbiddenException('Payouts are approved from the dashboard, not with an API key');
    }
    return this.money.approvePayout(db, req.tenant, id, req.tenant.email);
  }

  @Post(':id/cancel')
  @HttpCode(200)
  @ApiOperation({ summary: 'Cancel a payout waiting for approval (any wallet hold is released)' })
  cancel(@TenantDb() db: PrismaClient, @Req() req: RequestWithTenant, @Param('id') id: string) {
    return this.money.cancel(db, req.tenant, id);
  }

  @Post(':id/refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Check the payout status with the provider now' })
  refresh(@TenantDb() db: PrismaClient, @Req() req: RequestWithTenant, @Param('id') id: string) {
    return this.money.refresh(db, req.tenant.id, id);
  }
}

@ApiTags('Transfers')
@ApiBearerAuth('api-key')
@Public()
@UseGuards(TenantGuard)
@UseInterceptors(IdempotencyInterceptor)
@Controller('transfers')
export class TransfersController {
  constructor(private readonly money: MoneyService) {}

  @Post()
  @ApiOperation({ summary: 'Move money between two wallets', description: 'Both wallets must use the same currency.' })
  @ApiHeader(IDEMPOTENCY_HEADER)
  create(@TenantDb() db: PrismaClient, @Req() req: RequestWithTenant, @Body() dto: CreateTransferDto) {
    return this.money.createTransfer(db, req.tenant, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List transfers' })
  list(@TenantDb() db: PrismaClient, @Query() q: Record<string, string>) {
    return this.money.list(db, 'TRANSFER', listQuery(q));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a transfer' })
  get(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.money.get(db, 'TRANSFER', id);
  }
}

@ApiTags('Money movement')
@ApiBearerAuth('api-key')
@Public()
@UseGuards(TenantGuard)
@Controller('money')
export class MoneySettingsController {
  constructor(
    private readonly money: MoneyService,
    private readonly managed: ManagedAccountsService,
  ) {}

  @Get('managed')
  @ApiOperation({ summary: 'Whether managed payments are offered here, and this account\'s managed account if it has one' })
  managedStatus(@TenantDb() db: PrismaClient) {
    return this.managed.status(db);
  }

  @Post('managed')
  @ApiOperation({
    summary: 'Open a managed payments account (no provider account of your own needed)',
    description: 'Payments settle to the bank account given here. The account takes payments once it has been reviewed.',
  })
  openManaged(@TenantDb() db: PrismaClient, @Req() req: RequestWithTenant, @Body() dto: OpenManagedAccountDto) {
    return this.managed.open(db, req.tenant.id, dto);
  }

  @Get('capabilities')
  @ApiOperation({ summary: 'Enabled features and what each configured provider can do' })
  capabilities(@TenantDb() db: PrismaClient, @Req() req: RequestWithTenant) {
    return this.money.capabilities(db, req.tenant);
  }

  @Patch('settings')
  @ApiOperation({
    summary: 'Turn collections and transfers on or off, and set payout approval and daily limits',
    description: 'Payouts themselves are enabled by the platform operator.',
  })
  updateSettings(@Req() req: RequestWithTenant, @Body() dto: UpdateMoneySettingsDto) {
    return this.money.updateSettings(req.tenant, dto, false);
  }

  @Get('providers/:provider/balance')
  @ApiOperation({ summary: 'Balance held at a provider (where the provider reports it)' })
  balance(@TenantDb() db: PrismaClient, @Param('provider') provider: string) {
    return this.money.balance(db, provider);
  }

  @Get('crypto-deposits')
  @ApiOperation({ summary: 'Crypto transfers seen arriving at your own wallet address, matched or not' })
  cryptoDeposits(
    @TenantDb() db: PrismaClient,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.money.listCryptoDeposits(db, { status, page: Number(page) || 1, limit: Number(limit) || 20 });
  }

  @Post('crypto-deposits/:id/assign')
  @HttpCode(200)
  @ApiOperation({ summary: 'Settle an open crypto collection with a deposit that did not match on its own' })
  assignDeposit(@TenantDb() db: PrismaClient, @Req() req: RequestWithTenant, @Param('id') id: string, @Body() dto: AssignDepositDto) {
    return this.money.assignCryptoDeposit(db, req.tenant.id, id, dto.collectionId);
  }

  @Post('providers/:provider/otp')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Text a payer the one-time code some providers need before a mobile money collection',
    description: 'Pass the returned pinId, with the code the payer reads back, as `otp` when creating the collection.',
  })
  requestOtp(@TenantDb() db: PrismaClient, @Param('provider') provider: string, @Body() dto: RequestOtpDto) {
    return this.money.requestPayerOtp(db, provider, dto.phone);
  }

    @Post('providers/:provider/verify-payee')
  @HttpCode(200)
  @ApiOperation({ summary: 'Look up the name registered to a payee account before paying it' })
  verifyPayee(@TenantDb() db: PrismaClient, @Param('provider') provider: string, @Body() dto: VerifyPayeeDto) {
    return this.money.verifyPayee(db, provider, dto.payee);
  }
}
