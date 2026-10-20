import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { UpdateTenantAccessDto } from './dto/update-tenant-access.dto';
import { ServiceTokenGuard } from './service-token.guard';
import { TenantAccessService } from './tenant-access.service';

/** Service API for the operator's own control plane: organisations and their access. */
@ApiExcludeController()
@Public()
@UseGuards(ServiceTokenGuard)
@Controller('admin/service')
export class PlatformServiceController {
  constructor(private readonly access: TenantAccessService) {}

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
}
