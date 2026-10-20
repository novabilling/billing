/**
 * Apply migrations: `node dist/cli/migrate.js central|tenants|all [--dry-run] [--allow-tenant-failures]`
 * (or `npm run migrate:central` / `npm run migrate:tenants` in development).
 * Tenants are found through the central database; one failing tenant is
 * reported and does not stop the others. With --allow-tenant-failures (how
 * the API container starts) only a central failure exits non-zero, so one
 * broken tenant database cannot keep the API down for everyone.
 */
import 'dotenv/config';
import { createDecipheriv } from 'crypto';
import { Client } from 'pg';
import { baselineNeeded, migrate, migrateTenant } from '../database/migrations';

function decrypt(encrypted: string): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error('ENCRYPTION_KEY not set');
  const [ivHex, data] = encrypted.split(':');
  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(ivHex, 'hex'));
  return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
}

/** Prisma ends its errors with a backtrace; show the error lines instead. */
function errorSummary(text: string): string {
  const lines = text.trim().split('\n').map((l) => l.trim()).filter(Boolean);
  const errors = lines.filter((l) => /error|denied|P\d{4}|must be owner|does not exist/i.test(l) && !/^\d+: /.test(l) && !l.startsWith('at '));
  return (errors.length ? errors : lines.slice(-3)).slice(0, 4).join('\n  ');
}

async function central(dryRun: boolean) {
  const url = process.env.CENTRAL_DATABASE_URL;
  if (!url) throw new Error('CENTRAL_DATABASE_URL not set');
  if (dryRun) {
    console.log(`central: would baseline [${(await baselineNeeded('central', url)).join(', ')}] then deploy`);
    return;
  }
  await migrate('central', url, (line) => console.log(`central: ${line}`));
}

async function tenants(dryRun: boolean): Promise<number> {
  const db = new Client({ connectionString: process.env.CENTRAL_DATABASE_URL });
  await db.connect();
  const { rows } = await db.query<{ name: string; slug: string; connectionUrl: string }>(
    `SELECT t.name, t.slug, c."connectionUrl" FROM "DatabaseConnection" c JOIN "Tenant" t ON t.id = c."tenantId" ORDER BY t."createdAt"`,
  );
  await db.end();

  let failed = 0;
  for (const row of rows) {
    const label = `${row.name} (${row.slug})`;
    try {
      const url = decrypt(row.connectionUrl);
      if (dryRun) {
        console.log(`${label}: would baseline [${(await baselineNeeded('tenant', url)).join(', ')}] then deploy`);
        continue;
      }
      await migrateTenant(url, (line) => console.log(`${label}: ${line}`));
    } catch (error) {
      failed++;
      const e = error as { stderr?: string; message?: string };
      console.error(`${label}: FAILED\n  ${errorSummary(String(e.stderr || e.message))}`);
    }
  }
  console.log(`\n${rows.length - failed}/${rows.length} tenant database(s) up to date`);
  return failed;
}

async function main() {
  const target = process.argv[2];
  const dryRun = process.argv.includes('--dry-run');
  const allowTenantFailures = process.argv.includes('--allow-tenant-failures');
  if (!['central', 'tenants', 'all'].includes(target)) {
    console.error('Usage: migrate central|tenants|all [--dry-run]');
    process.exit(2);
  }
  if (target !== 'tenants') await central(dryRun);
  const failed = target !== 'central' ? await tenants(dryRun) : 0;
  if (failed && allowTenantFailures) console.error(`${failed} tenant database(s) failed to migrate; starting anyway (see above).`);
  process.exit(failed && !allowTenantFailures ? 1 : 0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
