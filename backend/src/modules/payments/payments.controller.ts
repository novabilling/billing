import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantDb } from '../../common/decorators/tenant-db.decorator';
import { Tenant } from '../../common/decorators/tenant.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { PaymentsService } from './payments.service';
import { PaymentQueryDto } from './dto/payment-query.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { PaymentResponse, PaginatedPaymentResponse } from './dto/payment-response.dto';

@ApiTags('Payments')
@ApiBearerAuth('api-key')
@Public()
@UseGuards(TenantGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @ApiOperation({
    summary: 'List payments',
    description:
      'Retrieve a paginated list of payments. Supports filtering by status, provider, invoice, and date range.',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of payments with invoice and customer details',
    type: PaginatedPaymentResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@TenantDb() db: PrismaClient, @Query() query: PaymentQueryDto) {
    return this.paymentsService.findAll(db, query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get payment by ID',
    description:
      'Retrieve detailed payment information including the associated invoice and customer.',
  })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiResponse({ status: 200, description: 'Payment details', type: PaymentResponse })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async findOne(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.paymentsService.findOne(db, id);
  }

  @Post(':id/refund')
  @ApiOperation({
    summary: 'Refund a payment',
    description:
      'Issue a full or partial refund for a succeeded payment. ' +
      'If amount is omitted, the full payment amount is refunded.',
  })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiResponse({ status: 200, description: 'Payment refunded successfully', type: PaymentResponse })
  @ApiResponse({
    status: 400,
    description: 'Payment not eligible for refund or refund amount exceeds payment',
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async refund(
    @TenantDb() db: PrismaClient,
    @Tenant() tenant: { id: string },
    @Param('id') id: string,
    @Body() dto: RefundPaymentDto,
  ) {
    return this.paymentsService.refund(db, tenant.id, id, dto);
  }
}
