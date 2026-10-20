import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantDb } from '../../common/decorators/tenant-db.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { RequestWithTenant } from '../../common/interfaces/request-with-tenant.interface';
import {
  LedgerAccountResponse,
  LedgerHealthResponse,
  LedgerSyncResponse,
  PaginatedLedgerEntryResponse,
} from './dto/ledger-response.dto';
import { LedgerService } from './ledger.service';
import { LedgerRunnerService } from './ledger-runner.service';

@ApiTags('Ledger')
@ApiBearerAuth('api-key')
@Public()
@UseGuards(TenantGuard)
@Controller('ledger')
export class LedgerController {
  constructor(
    private readonly ledger: LedgerService,
    private readonly runner: LedgerRunnerService,
  ) {}

  @Get('accounts')
  @ApiOperation({
    summary: 'List ledger accounts',
    description:
      'Double-entry accounts with their current balances. Balances are decimal strings; ' +
      'debit balances are positive and credit balances negative.',
  })
  @ApiQuery({ name: 'currency', required: false })
  @ApiQuery({ name: 'type', required: false, enum: ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'] })
  @ApiResponse({ status: 200, description: 'Ledger accounts', type: [LedgerAccountResponse] })
  async accounts(
    @TenantDb() db: PrismaClient,
    @Query('currency') currency?: string,
    @Query('type') type?: string,
  ) {
    return this.ledger.listAccounts(db, { currency, type });
  }

  @Get('entries')
  @ApiOperation({ summary: 'List journal entries', description: 'Journal entries with their lines, newest first.' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'sourceType', required: false, description: 'invoice, payment, wallet_transaction, credit_note' })
  @ApiQuery({ name: 'sourceId', required: false })
  @ApiQuery({ name: 'accountId', required: false })
  @ApiResponse({ status: 200, description: 'Paginated journal entries', type: PaginatedLedgerEntryResponse })
  async entries(
    @TenantDb() db: PrismaClient,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
    @Query('sourceType') sourceType?: string,
    @Query('sourceId') sourceId?: string,
    @Query('accountId') accountId?: string,
  ) {
    return this.ledger.listEntries(db, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      type,
      sourceType,
      sourceId,
      accountId,
    });
  }

  @Get('health')
  @ApiOperation({
    summary: 'Ledger integrity checks',
    description:
      'Zero-sum per currency, balanced entries, cached balances, and wallet parity with the existing wallet balances.',
  })
  @ApiResponse({ status: 200, description: 'Integrity check results', type: LedgerHealthResponse })
  async health(@TenantDb() db: PrismaClient) {
    return this.ledger.checkHealth(db);
  }

  @Post('sync')
  @ApiOperation({
    summary: 'Sync the ledger now',
    description:
      'Project recent invoices, payments, wallet transactions and credit notes into the ledger, then run the checks. ' +
      'Pass full=true to rebuild from the beginning (safe: postings are idempotent).',
  })
  @ApiQuery({ name: 'full', required: false })
  @ApiResponse({ status: 201, description: 'Sync result', type: LedgerSyncResponse })
  async sync(@Req() req: RequestWithTenant, @Query('full') full?: string) {
    return this.runner.syncTenant(req.tenant.id, { fromScratch: full === 'true' });
  }
}
