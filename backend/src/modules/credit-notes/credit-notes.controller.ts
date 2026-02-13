import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantDb } from '../../common/decorators/tenant-db.decorator';
import { Tenant } from '../../common/decorators/tenant.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CreditNotesService } from './credit-notes.service';
import { CreateCreditNoteDto, UpdateCreditNoteDto } from './dto/create-credit-note.dto';
import { CreditNoteResponse, PaginatedCreditNoteResponse } from './dto/credit-note-response.dto';

@ApiTags('Credit Notes')
@ApiBearerAuth('api-key')
@Public()
@UseGuards(TenantGuard)
@Controller('credit-notes')
export class CreditNotesController {
  constructor(private readonly creditNotesService: CreditNotesService) {}

  @Get()
  @ApiOperation({ summary: 'List credit notes', description: 'Retrieve a paginated list of credit notes.' })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'invoiceId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['DRAFT', 'FINALIZED', 'VOIDED'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated list of credit notes', type: PaginatedCreditNoteResponse })
  async findAll(
    @TenantDb() db: PrismaClient,
    @Query('customerId') customerId?: string,
    @Query('invoiceId') invoiceId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.creditNotesService.findAll(db, {
      customerId,
      invoiceId,
      status,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get credit note by ID' })
  @ApiParam({ name: 'id', description: 'Credit note ID' })
  @ApiResponse({ status: 200, description: 'Credit note details', type: CreditNoteResponse })
  @ApiResponse({ status: 404, description: 'Credit note not found' })
  async findOne(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.creditNotesService.findOne(db, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a credit note', description: 'Create a credit note against an invoice. Starts in DRAFT status.' })
  @ApiResponse({ status: 201, description: 'Credit note created', type: CreditNoteResponse })
  @ApiResponse({ status: 400, description: 'Amount exceeds invoice total or invalid data' })
  @ApiResponse({ status: 404, description: 'Invoice or customer not found' })
  async create(
    @TenantDb() db: PrismaClient,
    @Tenant() tenant: { id: string },
    @Body() dto: CreateCreditNoteDto,
  ) {
    return this.creditNotesService.create(db, tenant.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a draft credit note' })
  @ApiParam({ name: 'id', description: 'Credit note ID' })
  @ApiResponse({ status: 200, description: 'Credit note updated', type: CreditNoteResponse })
  @ApiResponse({ status: 400, description: 'Only draft credit notes can be updated' })
  @ApiResponse({ status: 404, description: 'Credit note not found' })
  async update(
    @TenantDb() db: PrismaClient,
    @Param('id') id: string,
    @Body() dto: UpdateCreditNoteDto,
  ) {
    return this.creditNotesService.update(db, id, dto);
  }

  @Post(':id/finalize')
  @ApiOperation({ summary: 'Finalize a credit note', description: 'Move a credit note from DRAFT to FINALIZED status.' })
  @ApiParam({ name: 'id', description: 'Credit note ID' })
  @ApiResponse({ status: 200, description: 'Credit note finalized', type: CreditNoteResponse })
  @ApiResponse({ status: 400, description: 'Only draft credit notes can be finalized' })
  @ApiResponse({ status: 404, description: 'Credit note not found' })
  async finalize(
    @TenantDb() db: PrismaClient,
    @Tenant() tenant: { id: string },
    @Param('id') id: string,
  ) {
    return this.creditNotesService.finalize(db, tenant.id, id);
  }

  @Post(':id/void')
  @ApiOperation({ summary: 'Void a credit note', description: 'Cancel a credit note.' })
  @ApiParam({ name: 'id', description: 'Credit note ID' })
  @ApiResponse({ status: 200, description: 'Credit note voided', type: CreditNoteResponse })
  @ApiResponse({ status: 400, description: 'Credit note is already voided' })
  @ApiResponse({ status: 404, description: 'Credit note not found' })
  async voidCreditNote(
    @TenantDb() db: PrismaClient,
    @Tenant() tenant: { id: string },
    @Param('id') id: string,
  ) {
    return this.creditNotesService.void(db, tenant.id, id);
  }
}
