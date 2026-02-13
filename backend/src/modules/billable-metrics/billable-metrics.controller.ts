import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantDb } from '../../common/decorators/tenant-db.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { BillableMetricsService } from './billable-metrics.service';
import { CreateBillableMetricDto } from './dto/create-billable-metric.dto';
import { UpdateBillableMetricDto } from './dto/update-billable-metric.dto';
import { BillableMetricResponse } from './dto/billable-metric-response.dto';

@ApiTags('Billable Metrics')
@ApiBearerAuth('api-key')
@Public()
@UseGuards(TenantGuard)
@Controller('billable-metrics')
export class BillableMetricsController {
  constructor(private readonly billableMetricsService: BillableMetricsService) {}

  @Get()
  @ApiOperation({
    summary: 'List all billable metrics',
    description: 'Retrieve all billable metrics with their filters and charge counts.',
  })
  @ApiResponse({ status: 200, description: 'List of billable metrics', type: [BillableMetricResponse] })
  async findAll(@TenantDb() db: PrismaClient) {
    return this.billableMetricsService.findAll(db);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get billable metric by ID',
    description: 'Retrieve a billable metric with its filters and associated charges.',
  })
  @ApiParam({ name: 'id', description: 'Billable Metric ID' })
  @ApiResponse({ status: 200, description: 'Billable metric details', type: BillableMetricResponse })
  @ApiResponse({ status: 404, description: 'Billable metric not found' })
  async findOne(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.billableMetricsService.findOne(db, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a billable metric',
    description:
      'Create a new billable metric for usage-based billing. ' +
      'Supported aggregation types: COUNT, SUM, MAX, UNIQUE_COUNT, LATEST, WEIGHTED_SUM.',
  })
  @ApiResponse({ status: 201, description: 'Billable metric created', type: BillableMetricResponse })
  @ApiResponse({ status: 409, description: 'Metric with this code already exists' })
  async create(@TenantDb() db: PrismaClient, @Body() dto: CreateBillableMetricDto) {
    return this.billableMetricsService.create(db, dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a billable metric',
    description: 'Update billable metric details. Code and aggregation type cannot be changed.',
  })
  @ApiParam({ name: 'id', description: 'Billable Metric ID' })
  @ApiResponse({ status: 200, description: 'Billable metric updated', type: BillableMetricResponse })
  @ApiResponse({ status: 404, description: 'Billable metric not found' })
  async update(
    @TenantDb() db: PrismaClient,
    @Param('id') id: string,
    @Body() dto: UpdateBillableMetricDto,
  ) {
    return this.billableMetricsService.update(db, id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a billable metric',
    description: 'Delete a billable metric. Metrics used in charges cannot be deleted.',
  })
  @ApiParam({ name: 'id', description: 'Billable Metric ID' })
  @ApiResponse({ status: 200, description: 'Billable metric deleted', type: BillableMetricResponse })
  @ApiResponse({ status: 404, description: 'Billable metric not found' })
  async delete(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.billableMetricsService.delete(db, id);
  }
}
