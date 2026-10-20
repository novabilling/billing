import { Body, Controller, Get, HttpCode, NotFoundException, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiExcludeController } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RequestWithTenant } from '../../common/interfaces/request-with-tenant.interface';
import { getBrand } from '../../config/brand';
import { LedgerRunnerService } from '../ledger/ledger-runner.service';
import { PlatformAdminGuard } from './platform-admin.guard';
import { isPlatformOperator } from '../../common/platform-operator';
import { PlatformService } from './platform.service';
import { TenantMetricsService } from './tenant-metrics.service';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { MoneyService } from '../money/money.service';
import { UpdateTenantMoneyDto } from './dto/update-tenant-money.dto';
import { UpdateTenantAccessDto } from './dto/update-tenant-access.dto';
import { TenantAccessService } from './tenant-access.service';

/**
 * Platform console API for the operators of this deployment. Excluded from
 * the public API reference: tenants never see these routes.
 */
@ApiExcludeController()
@ApiBearerAuth('JWT')
@Public()
@Controller('admin')
export class PlatformController {
  constructor(
    private readonly platform: PlatformService,
    private readonly metrics: TenantMetricsService,
    private readonly ledgerRunner: LedgerRunnerService,
    private readonly config: ConfigService,
    private readonly money: MoneyService,
    private readonly centralPrisma: CentralPrismaService,
    private readonly access: TenantAccessService,
  ) {}

  /** Lets the dashboard decide whether to show the platform section. */
  @Get('me')
  @UseGuards(TenantGuard)
  me(@Req() req: RequestWithTenant) {
    return {
      isPlatformAdmin: req.authMethod === 'session' && isPlatformOperator(req.tenant, this.config),
      access: {
        mode: req.tenant.accessMode ?? 'FULL',
        reason: req.tenant.accessReason ?? null,
        url: req.tenant.accessUrl ?? null,
      },
      brand: getBrand(),
    };
  }

  @Get('overview')
  @UseGuards(PlatformAdminGuard)
  overview() {
    return this.platform.overview();
  }

  @Get('tenants')
  @UseGuards(PlatformAdminGuard)
  tenants(
    @Query('search') search?: string,
    @Query('stage') stage?: string,
    @Query('flag') flag?: string,
    @Query('sort') sort?: string,
  ) {
    return this.platform.tenants({ search, stage, flag, sort });
  }

  @Get('tenants/:id')
  @UseGuards(PlatformAdminGuard)
  tenant(@Param('id') id: string) {
    return this.platform.tenant(id);
  }

  @Post('tenants/:id/refresh')
  @UseGuards(PlatformAdminGuard)
  @HttpCode(200)
  async refreshTenant(@Param('id') id: string) {
    await this.metrics.refreshTenant(id);
    const ledger = await this.ledgerRunner.syncTenant(id);
    return { refreshed: true, ledger: { mode: ledger.mode, error: ledger.error, balanced: ledger.health?.balanced } };
  }

  /** Turn money-movement features on or off for a tenant; payouts can only be enabled here. */
  @Patch('tenants/:id/money')
  @UseGuards(PlatformAdminGuard)
  async updateMoney(@Param('id') id: string, @Body() dto: UpdateTenantMoneyDto) {
    const tenant = await this.centralPrisma.client.tenant.findUnique({ where: { id }, select: { id: true, settings: true } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return this.money.updateSettings({ id, settings: tenant.settings as Record<string, unknown> | null }, dto, true);
  }

  /** Make an organisation read-only or suspended (with a reason), or restore it. */
  @Patch('tenants/:id/access')
  @UseGuards(PlatformAdminGuard)
  updateAccess(@Param('id') id: string, @Body() dto: UpdateTenantAccessDto, @Req() req: { platformAdminId?: string }) {
    return this.access.update(id, dto, `operator ${req.platformAdminId}`);
  }

  /** Rebuilds every tenant's snapshot in the background; results appear on the next read. */
  @Post('metrics/refresh')
  @UseGuards(PlatformAdminGuard)
  @HttpCode(202)
  refreshAll() {
    void this.metrics.refreshAll();
    return { started: true };
  }
}
