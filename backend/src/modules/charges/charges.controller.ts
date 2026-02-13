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
import { Public } from '../../common/decorators/public.decorator';
import { ChargesService } from './charges.service';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';
import { ChargeResponse } from './dto/charge-response.dto';

@ApiTags('Charges')
@ApiBearerAuth('api-key')
@Public()
@UseGuards(TenantGuard)
@Controller('charges')
export class ChargesController {
  constructor(private readonly chargesService: ChargesService) {}

  @Get()
  @ApiOperation({
    summary: 'List all charges',
    description: 'Retrieve all charges, optionally filtered by plan ID.',
  })
  @ApiQuery({ name: 'planId', required: false, description: 'Filter by plan ID' })
  @ApiResponse({ status: 200, description: 'List of charges', type: [ChargeResponse] })
  async findAll(@TenantDb() db: PrismaClient, @Query('planId') planId?: string) {
    return this.chargesService.findAll(db, planId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get charge by ID',
    description: 'Retrieve a charge with its billable metric, graduated ranges, and filters.',
  })
  @ApiParam({ name: 'id', description: 'Charge ID' })
  @ApiResponse({ status: 200, description: 'Charge details', type: ChargeResponse })
  @ApiResponse({ status: 404, description: 'Charge not found' })
  async findOne(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.chargesService.findOne(db, id);
  }

  @Get('plan/:planId')
  @ApiOperation({
    summary: 'List charges for a plan',
    description: 'Retrieve all charges attached to a specific plan.',
  })
  @ApiParam({ name: 'planId', description: 'Plan ID' })
  @ApiResponse({ status: 200, description: 'List of charges for the plan', type: [ChargeResponse] })
  async findByPlan(@TenantDb() db: PrismaClient, @Param('planId') planId: string) {
    return this.chargesService.findByPlan(db, planId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a charge',
    description:
      'Create a usage-based charge linking a plan to a billable metric. ' +
      'Supported models: STANDARD, GRADUATED, VOLUME, PACKAGE, PERCENTAGE.',
  })
  @ApiResponse({ status: 201, description: 'Charge created', type: ChargeResponse })
  @ApiResponse({ status: 404, description: 'Plan or metric not found' })
  @ApiResponse({ status: 409, description: 'Charge for this metric already exists on plan' })
  async create(@TenantDb() db: PrismaClient, @Body() dto: CreateChargeDto) {
    return this.chargesService.create(db, dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a charge',
    description: 'Update charge configuration including pricing, ranges, and filters.',
  })
  @ApiParam({ name: 'id', description: 'Charge ID' })
  @ApiResponse({ status: 200, description: 'Charge updated', type: ChargeResponse })
  @ApiResponse({ status: 404, description: 'Charge not found' })
  async update(
    @TenantDb() db: PrismaClient,
    @Param('id') id: string,
    @Body() dto: UpdateChargeDto,
  ) {
    return this.chargesService.update(db, id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a charge',
    description: 'Remove a charge from a plan.',
  })
  @ApiParam({ name: 'id', description: 'Charge ID' })
  @ApiResponse({ status: 200, description: 'Charge deleted', type: ChargeResponse })
  @ApiResponse({ status: 404, description: 'Charge not found' })
  async delete(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.chargesService.delete(db, id);
  }
}
