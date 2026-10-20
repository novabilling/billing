import { SetMetadata } from '@nestjs/common';
import { MemberRole } from '../../generated/prisma-central/client';

/**
 * What each role may do. Every dashboard request through TenantGuard is
 * checked: a route's own permission wins; otherwise reads need `read` and
 * writes need the controller's permission, or `billing.write`.
 * API keys are not people and keep full access to their organisation.
 */
export const PERMISSIONS = {
  read: ['OWNER', 'ADMIN', 'FINANCE', 'DEVELOPER', 'VIEWER'],
  'billing.write': ['OWNER', 'ADMIN', 'FINANCE'],
  'money.move': ['OWNER', 'ADMIN', 'FINANCE'],
  'money.approve': ['OWNER', 'ADMIN', 'FINANCE'],
  'settings.developer': ['OWNER', 'ADMIN', 'DEVELOPER'],
  'settings.providers': ['OWNER', 'ADMIN'],
  'org.manage': ['OWNER', 'ADMIN'],
  'team.manage': ['OWNER', 'ADMIN'],
} as const satisfies Record<string, MemberRole[]>;

export type Permission = keyof typeof PERMISSIONS;

export const ROLES: MemberRole[] = ['OWNER', 'ADMIN', 'FINANCE', 'DEVELOPER', 'VIEWER'];

export function can(role: MemberRole, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly MemberRole[]).includes(role);
}

export function permissionsOf(role: MemberRole): Permission[] {
  return (Object.keys(PERMISSIONS) as Permission[]).filter((p) => can(role, p));
}

export const PERMISSION_KEY = 'permission';

/**
 * On a route: the permission it needs, read or write. On a controller: the
 * permission its writes need (its reads still need only `read`).
 */
export const RequirePermission = (permission: Permission) => SetMetadata(PERMISSION_KEY, permission);
