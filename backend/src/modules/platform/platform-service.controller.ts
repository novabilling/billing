import { Body, Controller, Get, HttpCode, NotFoundException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { CentralPrismaService } from '../../database/central-prisma.service';
import { LedgerRunnerService } from '../ledger/ledger-runner.service';
import { MoneyService } from '../money/money.service';
import { UpdateTenantAccessDto } from './dto/update-tenant-access.dto';
import { UpdateTenantMoneyDto } from './dto/update-tenant-money.dto';
import { PlatformService } from './platform.service';
import { ServiceTokenGuard } from './service-token.guard';
import { TenantAccessService } from './tenant-access.service';
import { TenantMetricsService } from './tenant-metrics.service';

/**
 * Service API for the operator's own control plane (PLATFORM_SERVICE_TOKEN):
 * organisations, their access and plan, the same usage and health figures as
 * the platform console, and their money-movement features.
 */
@ApiExcludeController()
@Public()
@UseGuards(ServiceTokenGuard)
@Controller('admin/service')
export class PlatformServiceController {
  constructor(
    private readonly access: TenantAccessService,
    private readonly platform: PlatformService,
    private readonly metrics: TenantMetricsService,
    private readonly ledgerRunner: LedgerRunnerService,
    private readonly money: MoneyService,
    private readonly centralPrisma: CentralPrismaService,
  ) {}

  @Get('tenants')
  list(@Query('after') after?: string, @Query('limit') limit?: string) {
    return this.access.list(after, limit ? Number(limit) || undefined : undefined);
  }

  @Get('tenants/:id')
  get(@Param('id') id: string) {
    return this.access.get(id);
  }

  @Patch('tenants/:id')
  update(@Param('id') id: string, @Body() dto: UpdateTenantAccessDto) {
    return this.access.update(id, dto, 'service');
  }

  /** Platform-wide figures: organisations, activation funnel, volume, API usage, ledger health. */
  @Get('overview')
  overview() {
    return this.platform.overview();
  }

  /** Every organisation with its stage, health flags, usage and plan. */
  @Get('organisations')
  organisations(@Query('search') search?: string, @Query('stage') stage?: string, @Query('flag') flag?: string, @Query('sort') sort?: string) {
    return this.platform.tenants({ search, stage, flag, sort });
  }

  /** One organisation in depth: metrics history, API usage, webhooks, ledger and money settings. */
  @Get('organisations/:id')
  organisation(@Param('id') id: string) {
    return this.platform.tenant(id);
  }

  /** Turn money-movement features on or off for an organisation; payouts and commission are set only here and in the console. */
  @Patch('organisations/:id/money')
  async updateMoney(@Param('id') id: string, @Body() dto: UpdateTenantMoneyDto) {
    const tenant = await this.centralPrisma.client.tenant.findUnique({ where: { id }, select: { id: true, settings: true } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return this.money.updateSettings({ id, settings: tenant.settings as Record<string, unknown> | null }, dto, true);
  }

  /** Rebuild every organisation's figures in the background; they appear on the next read. */
  @Post('organisations/refresh')
  @HttpCode(202)
  refreshAll() {
    void this.metrics.refreshAll();
    return { started: true };
  }

  /** Rebuild one organisation's figures now (normally every 3 hours). */
  @Post('organisations/:id/refresh')
  @HttpCode(200)
  async refresh(@Param('id') id: string) {
    await this.metrics.refreshTenant(id);
    const ledger = await this.ledgerRunner.syncTenant(id);
    return { refreshed: true, ledger: { mode: ledger.mode, error: ledger.error, balanced: ledger.health?.balanced } };
  }
}
