import { Module } from '@nestjs/common';
import { TenantsController } from './tenants.controller';
import { CurrenciesController } from './currencies.controller';
import { TenantsService } from './tenants.service';

@Module({
  controllers: [TenantsController, CurrenciesController],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}
