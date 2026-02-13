import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantDb } from '../../common/decorators/tenant-db.decorator';
import { Tenant } from '../../common/decorators/tenant.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { CancelSubscriptionDto } from './dto/cancel-subscription.dto';
import { ChangePlanDto } from './dto/change-plan.dto';
import { SubscriptionResponse, PaginatedSubscriptionResponse } from './dto/subscription-response.dto';

@ApiTags('Subscriptions')
@ApiBearerAuth('api-key')
@Public()
@UseGuards(TenantGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  @ApiOperation({
    summary: 'List subscriptions',
    description:
      'Retrieve a paginated list of subscriptions. Supports filtering by status, customer, and plan.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status (ACTIVE, TRIALING, PAUSED, CANCELED)',
  })
  @ApiQuery({ name: 'customerId', required: false, description: 'Filter by customer ID' })
  @ApiQuery({ name: 'planId', required: false, description: 'Filter by plan ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of subscriptions with customer and plan details',
    type: PaginatedSubscriptionResponse,
  })
  async findAll(
    @TenantDb() db: PrismaClient,
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('planId') planId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.subscriptionsService.findAll(db, {
      status,
      customerId,
      planId,
      page,
      limit,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get subscription by ID',
    description:
      'Retrieve detailed subscription information including customer, plan with prices, and recent invoices.',
  })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  @ApiResponse({ status: 200, description: 'Subscription details with related records', type: SubscriptionResponse })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async findOne(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.subscriptionsService.findOne(db, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new subscription',
    description:
      'Subscribe a customer to a plan. The plan must have a price matching the specified currency. ' +
      'Optionally set a trial period in days.',
  })
  @ApiResponse({ status: 201, description: 'Subscription created (status: ACTIVE or TRIALING)', type: SubscriptionResponse })
  @ApiResponse({ status: 400, description: 'Plan inactive or no price for specified currency' })
  @ApiResponse({ status: 404, description: 'Customer or plan not found' })
  async create(
    @TenantDb() db: PrismaClient,
    @Tenant() tenant: { id: string },
    @Body() dto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.create(db, tenant.id, dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update subscription metadata',
    description:
      'Update the metadata field on a subscription. Other fields cannot be changed directly.',
  })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  @ApiResponse({ status: 200, description: 'Subscription metadata updated', type: SubscriptionResponse })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async update(
    @TenantDb() db: PrismaClient,
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(db, id, dto);
  }

  @Post(':id/cancel')
  @ApiOperation({
    summary: 'Cancel a subscription',
    description:
      'Cancel a subscription either immediately or at the end of the current billing period. ' +
      'When set to "period_end", the subscription remains active until the current period expires.',
  })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  @ApiResponse({ status: 200, description: 'Subscription canceled or scheduled for cancellation', type: SubscriptionResponse })
  @ApiResponse({ status: 400, description: 'Subscription is already canceled' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async cancel(
    @TenantDb() db: PrismaClient,
    @Tenant() tenant: { id: string },
    @Param('id') id: string,
    @Body() dto: CancelSubscriptionDto,
  ) {
    return this.subscriptionsService.cancel(db, tenant.id, id, dto);
  }

  @Post(':id/pause')
  @ApiOperation({
    summary: 'Pause a subscription',
    description:
      'Temporarily pause an active subscription. Only active subscriptions can be paused.',
  })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  @ApiResponse({ status: 200, description: 'Subscription paused', type: SubscriptionResponse })
  @ApiResponse({ status: 400, description: 'Only active subscriptions can be paused' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async pause(
    @TenantDb() db: PrismaClient,
    @Tenant() tenant: { id: string },
    @Param('id') id: string,
  ) {
    return this.subscriptionsService.pause(db, tenant.id, id);
  }

  @Post(':id/resume')
  @ApiOperation({
    summary: 'Resume a paused subscription',
    description: 'Resume a previously paused subscription back to active status.',
  })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  @ApiResponse({ status: 200, description: 'Subscription resumed', type: SubscriptionResponse })
  @ApiResponse({ status: 400, description: 'Only paused subscriptions can be resumed' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async resume(
    @TenantDb() db: PrismaClient,
    @Tenant() tenant: { id: string },
    @Param('id') id: string,
  ) {
    return this.subscriptionsService.resume(db, tenant.id, id);
  }

  @Post(':id/change-plan')
  @ApiOperation({
    summary: 'Change subscription plan',
    description:
      "Switch a subscription to a different plan. The new plan must have a price for the subscription's currency. " +
      'A new billing period starts immediately with the new plan.',
  })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  @ApiResponse({ status: 200, description: 'Plan changed and billing period reset', type: SubscriptionResponse })
  @ApiResponse({ status: 400, description: 'New plan inactive or no matching price' })
  @ApiResponse({ status: 404, description: 'Subscription or new plan not found' })
  async changePlan(
    @TenantDb() db: PrismaClient,
    @Tenant() tenant: { id: string },
    @Param('id') id: string,
    @Body() dto: ChangePlanDto,
  ) {
    return this.subscriptionsService.changePlan(db, tenant.id, id, dto);
  }
}
