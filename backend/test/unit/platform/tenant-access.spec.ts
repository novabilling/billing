import { ConflictException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { assertTenantAccess } from '../../../src/common/guards/tenant-access';
import { isPlatformOperator } from '../../../src/common/platform-operator';
import { ServiceTokenGuard } from '../../../src/modules/platform/service-token.guard';
import { TenantAccessService } from '../../../src/modules/platform/tenant-access.service';

const config = (values: Record<string, string> = {}) => ({ get: (key: string) => values[key] }) as unknown as ConfigService;

describe('assertTenantAccess', () => {
  it('lets full access through', () => {
    expect(() => assertTenantAccess({ accessMode: 'FULL' }, 'POST', '/api/invoices')).not.toThrow();
    expect(() => assertTenantAccess({}, 'DELETE', '/api/customers/1')).not.toThrow();
  });

  it('allows reads and refuses writes when read-only, with the reason and link', () => {
    const tenant = { accessMode: 'READ_ONLY' as const, accessReason: 'Payment overdue', accessUrl: 'https://pay.example/x' };
    expect(() => assertTenantAccess(tenant, 'GET', '/api/invoices?page=2')).not.toThrow();
    try {
      assertTenantAccess(tenant, 'POST', '/api/invoices');
      fail('expected a refusal');
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
      expect((error as ForbiddenException).getResponse()).toMatchObject({
        code: 'TENANT_READ_ONLY',
        message: 'Payment overdue',
        accessUrl: 'https://pay.example/x',
      });
    }
  });

  it('leaves a suspended organisation only what explains the suspension', () => {
    const tenant = { accessMode: 'SUSPENDED' as const };
    expect(() => assertTenantAccess(tenant, 'GET', '/api/tenants/me')).not.toThrow();
    expect(() => assertTenantAccess(tenant, 'GET', '/api/admin/me')).not.toThrow();
    expect(() => assertTenantAccess(tenant, 'GET', '/api/invoices')).toThrow(ForbiddenException);
    expect(() => assertTenantAccess(tenant, 'PATCH', '/api/tenants/me')).toThrow(ForbiddenException);
  });
});

describe('isPlatformOperator', () => {
  it('accepts the flag or a listed id', () => {
    expect(isPlatformOperator({ id: 'a', isPlatformOperator: true }, config())).toBe(true);
    expect(isPlatformOperator({ id: 'b' }, config({ PLATFORM_ADMIN_TENANT_IDS: 'x, b' }))).toBe(true);
    expect(isPlatformOperator({ id: 'c', isPlatformOperator: false }, config({ PLATFORM_ADMIN_TENANT_IDS: 'x' }))).toBe(false);
  });
});

describe('ServiceTokenGuard', () => {
  const context = (authorization?: string) =>
    ({ switchToHttp: () => ({ getRequest: () => ({ headers: { authorization } }) }) }) as never;
  const token = 's'.repeat(40);

  it('is off without a long enough token configured', () => {
    expect(() => new ServiceTokenGuard(config()).canActivate(context(`Bearer ${token}`))).toThrow(UnauthorizedException);
    expect(() => new ServiceTokenGuard(config({ PLATFORM_SERVICE_TOKEN: 'short' })).canActivate(context('Bearer short'))).toThrow(
      UnauthorizedException,
    );
  });

  it('accepts only the configured token', () => {
    const guard = new ServiceTokenGuard(config({ PLATFORM_SERVICE_TOKEN: token }));
    expect(guard.canActivate(context(`Bearer ${token}`))).toBe(true);
    expect(() => guard.canActivate(context(`Bearer ${'t'.repeat(40)}`))).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context())).toThrow(UnauthorizedException);
  });
});

describe('TenantAccessService.update', () => {
  function service(tenant: { id: string; isPlatformOperator: boolean }) {
    const updates: unknown[] = [];
    const client = {
      tenant: {
        findUnique: jest.fn(async () => ({
          ...tenant,
          name: 'Acme',
          email: 'a@acme.test',
          isActive: true,
          accessMode: 'FULL',
          accessReason: null,
          accessUrl: null,
          createdAt: new Date(),
          tenantBilling: null,
        })),
      },
      $transaction: jest.fn(async (fn: (tx: unknown) => Promise<void>) =>
        fn({
          tenant: { update: jest.fn(async (args: unknown) => updates.push(['tenant', args])) },
          tenantBilling: { upsert: jest.fn(async (args: unknown) => updates.push(['billing', args])) },
        }),
      ),
    };
    return { svc: new TenantAccessService({ client } as never, config()), updates };
  }

  it('refuses to limit the operator organisation', async () => {
    const { svc } = service({ id: 'op', isPlatformOperator: true });
    await expect(svc.update('op', { accessMode: 'READ_ONLY' }, 'test')).rejects.toBeInstanceOf(ConflictException);
  });

  it('clears the reason and link when access is restored, and records billing state', async () => {
    const { svc, updates } = service({ id: 't1', isPlatformOperator: false });
    await svc.update('t1', { accessMode: 'FULL', billingStatus: 'active', billingPlanId: 'cloud' }, 'test');
    expect(updates).toEqual([
      ['tenant', { where: { id: 't1' }, data: { accessMode: 'FULL', accessReason: null, accessUrl: null } }],
      [
        'billing',
        {
          where: { tenantId: 't1' },
          create: { tenantId: 't1', status: 'active', planId: 'cloud' },
          update: { status: 'active', planId: 'cloud' },
        },
      ],
    ]);
  });
});
