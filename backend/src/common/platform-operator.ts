import { ConfigService } from '@nestjs/config';

/**
 * Platform operators are organisations marked with `isPlatformOperator`
 * (see `npm run platform:operator`) or listed by id in
 * PLATFORM_ADMIN_TENANT_IDS. Ids rather than emails, because ids are
 * generated at registration and cannot be claimed by signing up with
 * someone's address.
 */
export function platformAdminIds(config: ConfigService): Set<string> {
  return new Set(
    (config.get<string>('PLATFORM_ADMIN_TENANT_IDS') ?? '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean),
  );
}

export function isPlatformOperator(tenant: { id: string; isPlatformOperator?: boolean }, config: ConfigService): boolean {
  return tenant.isPlatformOperator === true || platformAdminIds(config).has(tenant.id);
}
