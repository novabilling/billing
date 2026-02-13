import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantDb } from '../../common/decorators/tenant-db.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { RequestWithTenant } from '../../common/interfaces/request-with-tenant.interface';
import { WalletsService } from './wallets.service';
import { CreateWalletDto, UpdateWalletDto, TopUpWalletDto } from './dto/create-wallet.dto';
import { WalletResponse, PaginatedWalletResponse, PaginatedWalletTransactionResponse, TopUpResponse } from './dto/wallet-response.dto';

@ApiTags('Wallets')
@ApiBearerAuth('api-key')
@Public()
@UseGuards(TenantGuard)
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a wallet', description: 'Create a prepaid credit wallet for a customer. Optionally seed it with paid or granted credits.' })
  @ApiResponse({ status: 201, description: 'Wallet created', type: WalletResponse })
  async create(
    @TenantDb() db: PrismaClient,
    @Req() req: RequestWithTenant,
    @Body() dto: CreateWalletDto,
  ) {
    return this.walletsService.create(db, req.tenant.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List wallets', description: 'List wallets, optionally filtered by customer or status.' })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['ACTIVE', 'TERMINATED'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated list of wallets', type: PaginatedWalletResponse })
  async findAll(
    @TenantDb() db: PrismaClient,
    @Query('customerId') customerId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.walletsService.findAll(db, {
      customerId,
      status,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get wallet by ID' })
  @ApiParam({ name: 'id', description: 'Wallet ID' })
  @ApiResponse({ status: 200, description: 'Wallet details', type: WalletResponse })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  async findOne(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.walletsService.findOne(db, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a wallet', description: 'Update wallet name, expiration, or metadata.' })
  @ApiParam({ name: 'id', description: 'Wallet ID' })
  @ApiResponse({ status: 200, description: 'Wallet updated', type: WalletResponse })
  async update(
    @TenantDb() db: PrismaClient,
    @Req() req: RequestWithTenant,
    @Param('id') id: string,
    @Body() dto: UpdateWalletDto,
  ) {
    return this.walletsService.update(db, req.tenant.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Terminate a wallet', description: 'Terminate a wallet. Remaining credits are voided.' })
  @ApiParam({ name: 'id', description: 'Wallet ID' })
  @ApiResponse({ status: 200, description: 'Wallet terminated', type: WalletResponse })
  async terminate(
    @TenantDb() db: PrismaClient,
    @Req() req: RequestWithTenant,
    @Param('id') id: string,
  ) {
    return this.walletsService.terminate(db, req.tenant.id, id);
  }

  // --- Transactions ---

  @Post('transactions')
  @ApiOperation({ summary: 'Top up or void credits', description: 'Add paid/granted credits or void existing credits from a wallet.' })
  @ApiResponse({ status: 201, description: 'Transaction(s) created', type: TopUpResponse })
  async topUp(
    @TenantDb() db: PrismaClient,
    @Req() req: RequestWithTenant,
    @Body() dto: TopUpWalletDto,
  ) {
    return this.walletsService.topUp(db, req.tenant.id, dto);
  }

  @Get(':id/transactions')
  @ApiOperation({ summary: 'List wallet transactions' })
  @ApiParam({ name: 'id', description: 'Wallet ID' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'SETTLED', 'FAILED'] })
  @ApiQuery({ name: 'transactionStatus', required: false, enum: ['PURCHASED', 'GRANTED', 'VOIDED', 'INVOICED'] })
  @ApiQuery({ name: 'transactionType', required: false, enum: ['INBOUND', 'OUTBOUND'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated list of transactions', type: PaginatedWalletTransactionResponse })
  async listTransactions(
    @TenantDb() db: PrismaClient,
    @Param('id') id: string,
    @Query('status') status?: string,
    @Query('transactionStatus') transactionStatus?: string,
    @Query('transactionType') transactionType?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.walletsService.listTransactions(db, id, {
      status,
      transactionStatus,
      transactionType,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }
}
