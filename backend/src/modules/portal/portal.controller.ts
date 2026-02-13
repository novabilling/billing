import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantDb } from '../../common/decorators/tenant-db.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { PortalService } from './portal.service';
import { SubscriptionResponse } from '../subscriptions/dto/subscription-response.dto';
import { InvoiceResponse, PaginatedInvoiceResponse, CheckoutResponse } from '../invoices/dto/invoice-response.dto';
import { PaginatedPaymentResponse } from '../payments/dto/payment-response.dto';

/**
 * Customer-facing billing portal API.
 *
 * Authenticated via the tenant's API key (same TenantGuard), but scoped
 * to a specific customer via their `externalId` in the URL path.
 * This is the API that tenant developers embed in their apps so their
 * end-users can view invoices, manage subscriptions, and pay.
 */
@ApiTags('Customer Portal')
@ApiBearerAuth('api-key')
@Public()
@UseGuards(TenantGuard)
@Controller('portal/customers')
export class PortalController {
  constructor(private readonly portalService: PortalService) {}

  private async resolveCustomerId(db: PrismaClient, externalId: string): Promise<string> {
    const customer = await this.portalService.getCustomerByExternalId(db, externalId);
    return customer.id;
  }

  @Get(':externalId/billing')
  @ApiOperation({
    summary: 'Get customer billing overview',
    description: 'Returns subscriptions, recent invoices, payments, and summary stats for a customer. Use this to render a billing dashboard for your end-users.',
  })
  @ApiParam({ name: 'externalId', description: 'Customer external ID (your app user ID)' })
  @ApiResponse({ status: 200, description: 'Billing overview with subscriptions, invoices, payments' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async getBillingOverview(
    @TenantDb() db: PrismaClient,
    @Param('externalId') externalId: string,
  ) {
    const customerId = await this.resolveCustomerId(db, externalId);
    return this.portalService.getBillingOverview(db, customerId);
  }

  @Get(':externalId/subscriptions')
  @ApiOperation({
    summary: 'List customer subscriptions',
    description: 'Returns all subscriptions for the customer with plan details.',
  })
  @ApiParam({ name: 'externalId', description: 'Customer external ID' })
  @ApiResponse({ status: 200, description: 'List of subscriptions with plan info', type: [SubscriptionResponse] })
  async getSubscriptions(
    @TenantDb() db: PrismaClient,
    @Param('externalId') externalId: string,
  ) {
    const customerId = await this.resolveCustomerId(db, externalId);
    return this.portalService.getSubscriptions(db, customerId);
  }

  @Get(':externalId/invoices')
  @ApiOperation({
    summary: 'List customer invoices',
    description: 'Returns a paginated list of invoices. Filter by status to show only pending invoices.',
  })
  @ApiParam({ name: 'externalId', description: 'Customer external ID' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'PAID', 'FAILED', 'CANCELED'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated invoices', type: PaginatedInvoiceResponse })
  async getInvoices(
    @TenantDb() db: PrismaClient,
    @Param('externalId') externalId: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const customerId = await this.resolveCustomerId(db, externalId);
    return this.portalService.getInvoices(db, customerId, {
      status,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Post(':externalId/invoices/:invoiceId/checkout')
  @ApiOperation({
    summary: 'Create checkout for an invoice',
    description: 'Initiates a payment session with the configured payment provider. Returns a checkout URL to redirect the customer to.',
  })
  @ApiParam({ name: 'externalId', description: 'Customer external ID' })
  @ApiParam({ name: 'invoiceId', description: 'Invoice ID' })
  @ApiResponse({ status: 200, description: 'Checkout URL and payment details', type: CheckoutResponse })
  @ApiResponse({ status: 400, description: 'Invoice already paid or no provider configured' })
  async createCheckout(
    @TenantDb() db: PrismaClient,
    @Param('externalId') externalId: string,
    @Param('invoiceId') invoiceId: string,
    @Body() body: { callbackUrl?: string },
  ) {
    const customerId = await this.resolveCustomerId(db, externalId);
    return this.portalService.getInvoiceCheckout(db, customerId, invoiceId, body.callbackUrl);
  }

  @Get(':externalId/payments')
  @ApiOperation({
    summary: 'List customer payments',
    description: 'Returns a paginated list of all payments made by the customer.',
  })
  @ApiParam({ name: 'externalId', description: 'Customer external ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated payments', type: PaginatedPaymentResponse })
  async getPayments(
    @TenantDb() db: PrismaClient,
    @Param('externalId') externalId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const customerId = await this.resolveCustomerId(db, externalId);
    return this.portalService.getPayments(db, customerId, {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }
}
