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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantDb } from '../../common/decorators/tenant-db.decorator';
import { Tenant } from '../../common/decorators/tenant.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerQueryDto } from './dto/customer-query.dto';
import { CustomerResponse, PaginatedCustomerResponse } from './dto/customer-response.dto';
import { SubscriptionResponse } from '../subscriptions/dto/subscription-response.dto';
import { InvoiceResponse } from '../invoices/dto/invoice-response.dto';
import { PaymentResponse } from '../payments/dto/payment-response.dto';

@ApiTags('Customers')
@ApiBearerAuth('api-key')
@Public()
@UseGuards(TenantGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({
    summary: 'List customers',
    description:
      'Retrieve a paginated list of customers. Supports filtering by search term, country, and currency.',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of customers with metadata', type: PaginatedCustomerResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid or missing API key' })
  async findAll(@TenantDb() db: PrismaClient, @Query() query: CustomerQueryDto) {
    return this.customersService.findAll(db, query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get customer by ID',
    description:
      'Retrieve detailed information about a specific customer including their billing history summary.',
  })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer details', type: CustomerResponse })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async findOne(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.customersService.findOne(db, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new customer',
    description:
      "Create a customer record. The externalId should be unique and map to your application's user ID.",
  })
  @ApiResponse({ status: 201, description: 'Customer created successfully', type: CustomerResponse })
  @ApiResponse({ status: 409, description: 'Customer with this externalId already exists' })
  async create(
    @TenantDb() db: PrismaClient,
    @Tenant() tenant: { id: string },
    @Body() dto: CreateCustomerDto,
  ) {
    return this.customersService.create(db, tenant.id, dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a customer',
    description: 'Update customer fields. Only provided fields will be changed.',
  })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully', type: CustomerResponse })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async update(
    @TenantDb() db: PrismaClient,
    @Tenant() tenant: { id: string },
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customersService.update(db, tenant.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a customer',
    description: 'Permanently delete a customer. Fails if the customer has active subscriptions.',
  })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete - customer has active subscriptions' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async delete(
    @TenantDb() db: PrismaClient,
    @Tenant() tenant: { id: string },
    @Param('id') id: string,
  ) {
    return this.customersService.delete(db, tenant.id, id);
  }

  @Get(':id/subscriptions')
  @ApiOperation({
    summary: 'Get customer subscriptions',
    description: 'Retrieve all subscriptions for a specific customer.',
  })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'List of customer subscriptions', type: [SubscriptionResponse] })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async findSubscriptions(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.customersService.findSubscriptions(db, id);
  }

  @Get(':id/invoices')
  @ApiOperation({
    summary: 'Get customer invoices',
    description: 'Retrieve all invoices for a specific customer.',
  })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'List of customer invoices', type: [InvoiceResponse] })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async findInvoices(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.customersService.findInvoices(db, id);
  }

  @Get(':id/payments')
  @ApiOperation({
    summary: 'Get customer payments',
    description: 'Retrieve all payments made by a specific customer.',
  })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'List of customer payments', type: [PaymentResponse] })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async findPayments(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.customersService.findPayments(db, id);
  }
}
