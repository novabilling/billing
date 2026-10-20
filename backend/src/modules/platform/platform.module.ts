import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LedgerModule } from '../ledger/ledger.module';
import { MoneyModule } from '../money/money.module';
import { PlatformController } from './platform.controller';
import { PlatformServiceController } from './platform-service.controller';
import { ServiceTokenGuard } from './service-token.guard';
import { TenantAccessService } from './tenant-access.service';
import { PlatformService } from './platform.service';
import { TenantMetricsService } from './tenant-metrics.service';
import { UsageInterceptor } from './usage.interceptor';
import { UsageService } from './usage.service';

@Module({
  imports: [LedgerModule, MoneyModule],
  controllers: [PlatformController, PlatformServiceController],
  providers: [
    PlatformService,
    TenantAccessService,
    ServiceTokenGuard,
    TenantMetricsService,
    UsageService,
    { provide: APP_INTERCEPTOR, useClass: UsageInterceptor },
  ],
})
export class PlatformModule {}
