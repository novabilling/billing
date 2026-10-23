import { Module } from '@nestjs/common';
import { InvoicesModule } from '../invoices/invoices.module';
import { PortalController } from './portal.controller';
import { PortalService } from './portal.service';
import { PortalGuard } from './portal.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Module({
  imports: [InvoicesModule],
  controllers: [PortalController],
  providers: [PortalService, PortalGuard, TenantGuard],
  exports: [PortalService],
})
export class PortalModule {}
