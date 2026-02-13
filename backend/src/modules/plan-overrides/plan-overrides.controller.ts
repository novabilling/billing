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
import { PlanOverridesService } from './plan-overrides.service';
import { CreatePlanOverrideDto, UpdatePlanOverrideDto } from './dto/create-plan-override.dto';
import { PlanOverrideResponse, PaginatedPlanOverrideResponse } from './dto/plan-override-response.dto';

@ApiTags('Plan Overrides')
@ApiBearerAuth('api-key')
@Public()
@UseGuards(TenantGuard)
@Controller('plan-overrides')
export class PlanOverridesController {
  constructor(private readonly planOverridesService: PlanOverridesService) {}

  @Get()
  @ApiOperation({ summary: 'List plan overrides', description: 'List all plan overrides, optionally filtered by customerId or planId' })
  @ApiQuery({ name: 'customerId', required: false, type: String })
  @ApiQuery({ name: 'planId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated list of plan overrides', type: PaginatedPlanOverrideResponse })
  async findAll(
    @TenantDb() db: PrismaClient,
    @Query('customerId') customerId?: string,
    @Query('planId') planId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.planOverridesService.findAll(db, {
      customerId,
      planId,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a plan override by ID' })
  @ApiParam({ name: 'id', description: 'Plan override ID' })
  @ApiResponse({ status: 200, description: 'Plan override details', type: PlanOverrideResponse })
  @ApiResponse({ status: 404, description: 'Plan override not found' })
  async findOne(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.planOverridesService.findOne(db, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a plan override', description: 'Create a customer-specific override for a plan (custom pricing, minimum commitment, or charge properties)' })
  @ApiResponse({ status: 201, description: 'Plan override created', type: PlanOverrideResponse })
  @ApiResponse({ status: 404, description: 'Customer or plan not found' })
  @ApiResponse({ status: 409, description: 'Override already exists for this customer + plan' })
  async create(@TenantDb() db: PrismaClient, @Body() dto: CreatePlanOverrideDto) {
    return this.planOverridesService.create(db, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a plan override' })
  @ApiParam({ name: 'id', description: 'Plan override ID' })
  @ApiResponse({ status: 200, description: 'Plan override updated', type: PlanOverrideResponse })
  @ApiResponse({ status: 404, description: 'Plan override not found' })
  async update(@TenantDb() db: PrismaClient, @Param('id') id: string, @Body() dto: UpdatePlanOverrideDto) {
    return this.planOverridesService.update(db, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a plan override' })
  @ApiParam({ name: 'id', description: 'Plan override ID' })
  @ApiResponse({ status: 200, description: 'Plan override deleted' })
  @ApiResponse({ status: 404, description: 'Plan override not found' })
  async delete(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.planOverridesService.delete(db, id);
  }
}
