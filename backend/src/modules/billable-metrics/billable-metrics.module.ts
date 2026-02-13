import { Module } from '@nestjs/common';
import { BillableMetricsController } from './billable-metrics.controller';
import { BillableMetricsService } from './billable-metrics.service';

@Module({
  controllers: [BillableMetricsController],
  providers: [BillableMetricsService],
  exports: [BillableMetricsService],
})
export class BillableMetricsModule {}
