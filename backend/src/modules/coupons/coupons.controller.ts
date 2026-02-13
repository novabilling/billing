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
import { CouponsService } from './coupons.service';
import { CreateCouponDto, ApplyCouponDto, UpdateCouponDto } from './dto/create-coupon.dto';
import { CouponResponse, PaginatedCouponResponse, AppliedCouponResponse } from './dto/coupon-response.dto';

@ApiTags('Coupons')
@ApiBearerAuth('api-key')
@Public()
@UseGuards(TenantGuard)
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  @ApiOperation({ summary: 'List coupons', description: 'Retrieve a paginated list of coupons.' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated list of coupons', type: PaginatedCouponResponse })
  async findAll(
    @TenantDb() db: PrismaClient,
    @Query('isActive') isActive?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.couponsService.findAll(db, {
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get coupon by ID' })
  @ApiParam({ name: 'id', description: 'Coupon ID' })
  @ApiResponse({ status: 200, description: 'Coupon details with applied coupons', type: CouponResponse })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  async findOne(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.couponsService.findOne(db, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a coupon', description: 'Create a new discount coupon.' })
  @ApiResponse({ status: 201, description: 'Coupon created', type: CouponResponse })
  @ApiResponse({ status: 400, description: 'Invalid coupon data or duplicate code' })
  async create(@TenantDb() db: PrismaClient, @Body() dto: CreateCouponDto) {
    return this.couponsService.create(db, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a coupon' })
  @ApiParam({ name: 'id', description: 'Coupon ID' })
  @ApiResponse({ status: 200, description: 'Coupon updated', type: CouponResponse })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  async update(
    @TenantDb() db: PrismaClient,
    @Param('id') id: string,
    @Body() dto: UpdateCouponDto,
  ) {
    return this.couponsService.update(db, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a coupon', description: 'Delete or deactivate a coupon.' })
  @ApiParam({ name: 'id', description: 'Coupon ID' })
  @ApiResponse({ status: 200, description: 'Coupon deleted or deactivated', type: CouponResponse })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  async delete(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.couponsService.delete(db, id);
  }

  @Post('apply')
  @ApiOperation({ summary: 'Apply coupon to customer', description: 'Apply a coupon to a specific customer, optionally linked to a subscription.' })
  @ApiResponse({ status: 201, description: 'Coupon applied', type: AppliedCouponResponse })
  @ApiResponse({ status: 400, description: 'Coupon expired, inactive, or already applied' })
  @ApiResponse({ status: 404, description: 'Coupon or customer not found' })
  async apply(@TenantDb() db: PrismaClient, @Body() dto: ApplyCouponDto) {
    return this.couponsService.apply(db, dto);
  }

  @Delete('applied/:id')
  @ApiOperation({ summary: 'Remove applied coupon' })
  @ApiParam({ name: 'id', description: 'Applied coupon ID' })
  @ApiResponse({ status: 200, description: 'Applied coupon removed' })
  @ApiResponse({ status: 404, description: 'Applied coupon not found' })
  async removeApplied(@TenantDb() db: PrismaClient, @Param('id') id: string) {
    return this.couponsService.removeApplied(db, id);
  }
}
