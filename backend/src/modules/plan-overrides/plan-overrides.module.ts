import { Module } from '@nestjs/common';
import { PlanOverridesController } from './plan-overrides.controller';
import { PlanOverridesService } from './plan-overrides.service';

@Module({
  controllers: [PlanOverridesController],
  providers: [PlanOverridesService],
  exports: [PlanOverridesService],
})
export class PlanOverridesModule {}
