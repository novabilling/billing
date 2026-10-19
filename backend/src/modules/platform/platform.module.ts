import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LedgerModule } from '../ledger/ledger.module';
import { PlatformController } from './platform.controller';
import { PlatformService } from './platform.service';
import { TenantMetricsService } from './tenant-metrics.service';
import { UsageInterceptor } from './usage.interceptor';
import { UsageService } from './usage.service';

@Module({
  imports: [LedgerModule],
  controllers: [PlatformController],
  providers: [
    PlatformService,
    TenantMetricsService,
    UsageService,
    { provide: APP_INTERCEPTOR, useClass: UsageInterceptor },
  ],
})
export class PlatformModule {}
