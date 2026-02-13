import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { BatchEventsDto } from './dto/batch-events.dto';
import {
  UsageEventResponse,
  PaginatedUsageEventResponse,
  BatchEventResponse,
} from './dto/event-response.dto';

@ApiTags('Events')
@ApiBearerAuth('api-key')
@Public()
@UseGuards(TenantGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({
    summary: 'Ingest a usage event',
    description:
      'Send a single usage event. Uses transactionId for idempotency - ' +
      'sending the same transactionId twice will return the existing event.',
  })
  @ApiResponse({ status: 201, description: 'Event ingested successfully', type: UsageEventResponse })
  @ApiResponse({ status: 404, description: 'Subscription or metric not found' })
  async create(
    @TenantDb() db: PrismaClient,
    @Tenant() tenant: { id: string },
    @Body() dto: CreateEventDto,
  ) {
    return this.eventsService.create(db, dto, tenant.id);
  }

  @Post('batch')
  @ApiOperation({
    summary: 'Ingest a batch of usage events',
    description:
      'Send up to 100 usage events in a single request. ' +
      'Each event is processed independently - failures do not affect other events.',
  })
  @ApiResponse({ status: 201, description: 'Batch processing results', type: BatchEventResponse })
  async createBatch(
    @TenantDb() db: PrismaClient,
    @Tenant() tenant: { id: string },
    @Body() dto: BatchEventsDto,
  ) {
    return this.eventsService.createBatch(db, dto, tenant.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get event by ID',
    description: 'Retrieve a single usage event by its ID.',
  })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiResponse({ status: 200, description: 'Event details', type: UsageEventResponse })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async findOne(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.eventsService.findOne(db, id);
  }

  @Get('subscription/:subscriptionId')
  @ApiOperation({
    summary: 'List events for a subscription',
    description: 'Retrieve usage events for a specific subscription with optional filtering.',
  })
  @ApiParam({ name: 'subscriptionId', description: 'Subscription ID' })
  @ApiQuery({ name: 'code', required: false, description: 'Filter by metric code' })
  @ApiQuery({ name: 'from', required: false, description: 'Start date (ISO 8601)' })
  @ApiQuery({ name: 'to', required: false, description: 'End date (ISO 8601)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of events for the subscription', type: PaginatedUsageEventResponse })
  async findBySubscription(
    @TenantDb() db: PrismaClient,
    @Param('subscriptionId') subscriptionId: string,
    @Query('code') code?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
  ) {
    return this.eventsService.findBySubscription(db, subscriptionId, {
      code,
      from,
      to,
      page: page ? Number(page) : undefined,
      perPage: perPage ? Number(perPage) : undefined,
    });
  }
}
