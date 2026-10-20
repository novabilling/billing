import { execFileSync } from 'child_process';
import { Client } from 'pg';

/**
 * Prisma migrations for the central database and for each tenant database.
 *
 * Databases created before migrations existed were built with `prisma db
 * push` and have no migration history. For those, each migration whose
 * tables are already there is marked as applied (Prisma's "baselining"),
 * then the rest run normally. A database with history just gets
 * `migrate deploy`.
 */
export type MigrationTarget = 'central' | 'tenant';

const CONFIG: Record<MigrationTarget, string> = {
  central: 'prisma.config.ts',
  tenant: 'prisma.tenant.config.ts',
};

/** Each migration with a table it creates; the table's presence means the migration's changes are in place. */
const MARKERS: Record<MigrationTarget, [migration: string, table: string][]> = {
  central: [
    ['0_init', 'Tenant'],
    ['20261020000000_platform_console', 'ApiUsageHourly'],
    ['20261020010000_team_access', 'Membership'],
  ],
  tenant: [
    ['0_init', 'Customer'],
    ['20261020000000_ledger_and_money_movement', 'CryptoAddressClaim'],
  ],
};

export async function migrate(target: MigrationTarget, url: string, log: (line: string) => void = () => undefined): Promise<void> {
  for (const migration of await baselineNeeded(target, url)) {
    prisma(target, url, ['migrate', 'resolve', '--applied', migration]);
    log(`baselined ${migration}`);
  }
  const output = prisma(target, url, ['migrate', 'deploy']);
  log(output.trim().split('\n').pop() ?? 'done');
}

/** Migrations to mark as applied on a database that predates migration history. */
export async function baselineNeeded(target: MigrationTarget, url: string): Promise<string[]> {
  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    const exists = async (table: string) =>
      (await client.query<{ ok: boolean }>(`SELECT to_regclass($1) IS NOT NULL AS ok`, [`public."${table}"`])).rows[0].ok;
    if (await exists('_prisma_migrations')) return [];
    const applied: string[] = [];
    for (const [migration, table] of MARKERS[target]) {
      if (!(await exists(table))) break;
      applied.push(migration);
    }
    return applied;
  } finally {
    await client.end();
  }
}

function prisma(target: MigrationTarget, url: string, args: string[]): string {
  return execFileSync('npx', ['prisma', ...args, '--config', CONFIG[target]], {
    env: { ...process.env, DATABASE_URL: url, CENTRAL_DATABASE_URL: url },
    timeout: 120_000,
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

/**
 * Migrates one tenant database. Tenant databases on the internal server are
 * migrated as its admin (INTERNAL_POSTGRES_URL), not the tenant's own user:
 * databases from before migrations existed have tables the tenant user does
 * not own, and enum changes need the owner. Afterwards the tenant user is
 * granted everything in the schema, so tables a migration adds are usable.
 * Databases elsewhere are migrated with their own credentials.
 */
export async function migrateTenant(tenantUrl: string, log: (line: string) => void = () => undefined, adminUrl = process.env.INTERNAL_POSTGRES_URL): Promise<void> {
  const admin = adminUrlFor(tenantUrl, adminUrl);
  if (!admin) return migrate('tenant', tenantUrl, log);
  await migrate('tenant', admin.url, log);
  const client = new Client({ connectionString: admin.url });
  await client.connect();
  try {
    const role = `"${admin.tenantUser.replace(/"/g, '""')}"`;
    await client.query(`GRANT USAGE, CREATE ON SCHEMA public TO ${role}`);
    await client.query(`GRANT ALL ON ALL TABLES IN SCHEMA public TO ${role}`);
    await client.query(`GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO ${role}`);
  } finally {
    await client.end();
  }
}

/** The admin's credentials on the tenant's database, when both are on the same server. */
export function adminUrlFor(tenantUrl: string, adminUrl?: string): { url: string; tenantUser: string } | null {
  if (!adminUrl) return null;
  const tenant = new URL(tenantUrl);
  const admin = new URL(adminUrl);
  const port = (u: URL) => u.port || '5432';
  if (tenant.hostname !== admin.hostname || port(tenant) !== port(admin)) return null;
  const tenantUser = decodeURIComponent(tenant.username);
  if (!tenantUser || tenantUser === decodeURIComponent(admin.username)) return null;
  admin.pathname = tenant.pathname;
  admin.search = tenant.search;
  return { url: admin.toString(), tenantUser };
}
