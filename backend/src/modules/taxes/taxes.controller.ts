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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantDb } from '../../common/decorators/tenant-db.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { TaxesService } from './taxes.service';
import { CreateTaxDto, UpdateTaxDto, AssignTaxDto } from './dto/create-tax.dto';
import { TaxResponse, PaginatedTaxResponse } from './dto/tax-response.dto';

@ApiTags('Taxes')
@ApiBearerAuth('api-key')
@Public()
@UseGuards(TenantGuard)
@Controller('taxes')
export class TaxesController {
  constructor(private readonly taxesService: TaxesService) {}

  // ─── CRUD ──────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'List all taxes' })
  @ApiQuery({ name: 'appliedByDefault', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated list of taxes', type: PaginatedTaxResponse })
  async findAll(
    @TenantDb() db: PrismaClient,
    @Query('appliedByDefault') appliedByDefault?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.taxesService.findAll(db, {
      appliedByDefault: appliedByDefault !== undefined ? appliedByDefault === 'true' : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tax by ID' })
  @ApiParam({ name: 'id', description: 'Tax ID' })
  @ApiResponse({ status: 200, description: 'Tax details', type: TaxResponse })
  @ApiResponse({ status: 404, description: 'Tax not found' })
  async findOne(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.taxesService.findOne(db, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a tax', description: 'Create a new tax rate. Set appliedByDefault to automatically apply to all invoices.' })
  @ApiResponse({ status: 201, description: 'Tax created', type: TaxResponse })
  @ApiResponse({ status: 409, description: 'Tax with this code already exists' })
  async create(@TenantDb() db: PrismaClient, @Body() dto: CreateTaxDto) {
    return this.taxesService.create(db, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tax' })
  @ApiParam({ name: 'id', description: 'Tax ID' })
  @ApiResponse({ status: 200, description: 'Tax updated', type: TaxResponse })
  @ApiResponse({ status: 404, description: 'Tax not found' })
  async update(@TenantDb() db: PrismaClient, @Param('id') id: string, @Body() dto: UpdateTaxDto) {
    return this.taxesService.update(db, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tax' })
  @ApiParam({ name: 'id', description: 'Tax ID' })
  @ApiResponse({ status: 200, description: 'Tax deleted' })
  @ApiResponse({ status: 404, description: 'Tax not found' })
  async delete(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.taxesService.delete(db, id);
  }

  // ─── Customer Tax Assignments ──────────────────────────────

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get taxes assigned to a customer' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'List of taxes', type: [TaxResponse] })
  async getCustomerTaxes(@TenantDb() db: PrismaClient, @Param('customerId') customerId: string) {
    return this.taxesService.getCustomerTaxes(db, customerId);
  }

  @Post('customer/:customerId')
  @ApiOperation({ summary: 'Assign a tax to a customer' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiResponse({ status: 201, description: 'Tax assigned to customer' })
  @ApiResponse({ status: 404, description: 'Customer or tax not found' })
  async assignToCustomer(
    @TenantDb() db: PrismaClient,
    @Param('customerId') customerId: string,
    @Body() dto: AssignTaxDto,
  ) {
    return this.taxesService.assignToCustomer(db, customerId, dto.taxId);
  }

  @Delete('customer/:customerId/:taxId')
  @ApiOperation({ summary: 'Unassign a tax from a customer' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiParam({ name: 'taxId', description: 'Tax ID' })
  @ApiResponse({ status: 200, description: 'Tax unassigned' })
  async unassignFromCustomer(
    @TenantDb() db: PrismaClient,
    @Param('customerId') customerId: string,
    @Param('taxId') taxId: string,
  ) {
    return this.taxesService.unassignFromCustomer(db, customerId, taxId);
  }

  // ─── Plan Tax Assignments ─────────────────────────────────

  @Get('plan/:planId')
  @ApiOperation({ summary: 'Get taxes assigned to a plan' })
  @ApiParam({ name: 'planId', description: 'Plan ID' })
  @ApiResponse({ status: 200, description: 'List of taxes', type: [TaxResponse] })
  async getPlanTaxes(@TenantDb() db: PrismaClient, @Param('planId') planId: string) {
    return this.taxesService.getPlanTaxes(db, planId);
  }

  @Post('plan/:planId')
  @ApiOperation({ summary: 'Assign a tax to a plan' })
  @ApiParam({ name: 'planId', description: 'Plan ID' })
  @ApiResponse({ status: 201, description: 'Tax assigned to plan' })
  @ApiResponse({ status: 404, description: 'Plan or tax not found' })
  async assignToPlan(
    @TenantDb() db: PrismaClient,
    @Param('planId') planId: string,
    @Body() dto: AssignTaxDto,
  ) {
    return this.taxesService.assignToPlan(db, planId, dto.taxId);
  }

  @Delete('plan/:planId/:taxId')
  @ApiOperation({ summary: 'Unassign a tax from a plan' })
  @ApiParam({ name: 'planId', description: 'Plan ID' })
  @ApiParam({ name: 'taxId', description: 'Tax ID' })
  @ApiResponse({ status: 200, description: 'Tax unassigned' })
  async unassignFromPlan(
    @TenantDb() db: PrismaClient,
    @Param('planId') planId: string,
    @Param('taxId') taxId: string,
  ) {
    return this.taxesService.unassignFromPlan(db, planId, taxId);
  }

  // ─── Charge Tax Assignments ───────────────────────────────

  @Post('charge/:chargeId')
  @ApiOperation({ summary: 'Assign a tax to a charge' })
  @ApiParam({ name: 'chargeId', description: 'Charge ID' })
  @ApiResponse({ status: 201, description: 'Tax assigned to charge' })
  async assignToCharge(
    @TenantDb() db: PrismaClient,
    @Param('chargeId') chargeId: string,
    @Body() dto: AssignTaxDto,
  ) {
    return this.taxesService.assignToCharge(db, chargeId, dto.taxId);
  }

  @Delete('charge/:chargeId/:taxId')
  @ApiOperation({ summary: 'Unassign a tax from a charge' })
  @ApiParam({ name: 'chargeId', description: 'Charge ID' })
  @ApiParam({ name: 'taxId', description: 'Tax ID' })
  @ApiResponse({ status: 200, description: 'Tax unassigned' })
  async unassignFromCharge(
    @TenantDb() db: PrismaClient,
    @Param('chargeId') chargeId: string,
    @Param('taxId') taxId: string,
  ) {
    return this.taxesService.unassignFromCharge(db, chargeId, taxId);
  }
}
