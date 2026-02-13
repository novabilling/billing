import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TenantDb = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.tenantDb;
  },
);
