/**
 * Migrations against real databases: a fresh database, and one built the old
 * way (`prisma db push` of main's schemas, before migrations existed), which
 * must be baselined, upgraded without drift, and keep its logins working as
 * owners.
 *
 * Skipped unless MIGRATION_TEST_ADMIN_URL points at a server where the test
 * may create databases, e.g. postgresql://postgres:postgres@localhost:5432/postgres
 */
import { execFileSync } from 'child_process';
import { Client } from 'pg';
import { migrate, MigrationTarget } from '../../src/database/migrations';

const adminUrl = process.env.MIGRATION_TEST_ADMIN_URL;
const describeDb = adminUrl ? describe : describe.skip;

const CONFIG: Record<MigrationTarget, string> = { central: 'prisma.config.ts', tenant: 'prisma.tenant.config.ts' };
const SCHEMA: Record<MigrationTarget, string> = { central: 'prisma/schema-central.prisma', tenant: 'prisma/schema-tenant.prisma' };

function urlFor(db: string) {
  const u = new URL(adminUrl!);
  u.pathname = `/${db}`;
  return u.toString();
}

async function recreate(db: string) {
  const admin = new Client({ connectionString: adminUrl });
  await admin.connect();
  await admin.query(`DROP DATABASE IF EXISTS "${db}"`);
  await admin.query(`CREATE DATABASE "${db}"`);
  await admin.end();
  return urlFor(db);
}

function prisma(target: MigrationTarget, url: string, args: string[]) {
  return execFileSync('npx', ['prisma', ...args, '--config', CONFIG[target]], {
    env: { ...process.env, DATABASE_URL: url, CENTRAL_DATABASE_URL: url },
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

/** Exit code 0: the database matches the schema exactly. */
function drift(target: MigrationTarget, url: string): number {
  try {
    prisma(target, url, ['migrate', 'diff', '--from-config-datasource', '--to-schema', SCHEMA[target], '--exit-code']);
    return 0;
  } catch (error) {
    return (error as { status: number }).status;
  }
}

async function query<T>(url: string, sql: string) {
  const c = new Client({ connectionString: url });
  await c.connect();
  try {
    return (await c.query(sql)).rows as T[];
  } finally {
    await c.end();
  }
}

describeDb('migrations (postgres)', () => {
  jest.setTimeout(180_000);

  it.each(['central', 'tenant'] as const)('builds a fresh %s database exactly to the schema', async (target) => {
    const url = await recreate(`mig_fresh_${target}`);
    await migrate(target, url);
    expect(drift(target, url)).toBe(0);
  });

  it('upgrades a tenant database made with db push before migrations existed', async () => {
    const url = await recreate('mig_legacy_tenant');
    prisma('tenant', url, ['db', 'push', '--schema', 'test/fixtures/schema-tenant.main.prisma']);
    const lines: string[] = [];
    await migrate('tenant', url, (l) => lines.push(l));
    expect(lines).toContain('baselined 0_init');
    expect(drift('tenant', url)).toBe(0);
    // Running again changes nothing.
    await migrate('tenant', url);
    expect(drift('tenant', url)).toBe(0);
  });

  it('upgrades a central database made with db push, turning each organisation login into its owner', async () => {
    const url = await recreate('mig_legacy_central');
    prisma('central', url, ['db', 'push', '--schema', 'test/fixtures/schema-central.main.prisma']);
    await query(
      url,
      `INSERT INTO "Tenant" (id, name, slug, email, password, "apiKey", settings, "updatedAt") VALUES
        ('t1', 'Rapcio', 'rapcio', 'Owner@Rapcio.com', 'hash-1', 'k1', '{"ownerName":"Ronald"}', now()),
        ('t2', 'Cybroid', 'cybroid', 'owner@rapcio.com', 'hash-2', 'k2', null, now() + interval '1 minute'),
        ('t3', 'Solo', 'solo', 'solo@example.com', 'hash-3', 'k3', null, now())`,
    );

    await migrate('central', url);
    expect(drift('central', url)).toBe(0);

    const users = await query<{ id: string; email: string; name: string; password: string }>(url, `SELECT id, email, name, password FROM "User" ORDER BY email`);
    expect(users).toEqual([
      // Two logins with the same address (ignoring case) become one person, keeping the oldest password.
      { id: 'usr_t1', email: 'owner@rapcio.com', name: 'Ronald', password: 'hash-1' },
      { id: 'usr_t3', email: 'solo@example.com', name: 'Solo', password: 'hash-3' },
    ]);
    const memberships = await query<{ userId: string; tenantId: string; role: string }>(
      url,
      `SELECT "userId", "tenantId", role FROM "Membership" ORDER BY "tenantId"`,
    );
    expect(memberships).toEqual([
      { userId: 'usr_t1', tenantId: 't1', role: 'OWNER' },
      { userId: 'usr_t1', tenantId: 't2', role: 'OWNER' },
      { userId: 'usr_t3', tenantId: 't3', role: 'OWNER' },
    ]);
  });
});
