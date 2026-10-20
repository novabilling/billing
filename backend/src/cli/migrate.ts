/**
 * Apply migrations: `node dist/cli/migrate.js central|tenants|all [--dry-run]`
 * (or `npm run migrate:central` / `npm run migrate:tenants` in development).
 * Tenants are found through the central database; one failing tenant is
 * reported and does not stop the others.
 */
import 'dotenv/config';
import { createDecipheriv } from 'crypto';
import { Client } from 'pg';
import { baselineNeeded, migrate } from '../database/migrations';

function decrypt(encrypted: string): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error('ENCRYPTION_KEY not set');
  const [ivHex, data] = encrypted.split(':');
  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(ivHex, 'hex'));
  return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
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
      await migrate('tenant', url, (line) => console.log(`${label}: ${line}`));
    } catch (error) {
      failed++;
      const e = error as { stderr?: string; message?: string };
      console.error(`${label}: FAILED\n  ${String(e.stderr || e.message).trim().split('\n').slice(-3).join('\n  ')}`);
    }
  }
  console.log(`\n${rows.length - failed}/${rows.length} tenant database(s) up to date`);
  return failed;
}

async function main() {
  const target = process.argv[2];
  const dryRun = process.argv.includes('--dry-run');
  if (!['central', 'tenants', 'all'].includes(target)) {
    console.error('Usage: migrate central|tenants|all [--dry-run]');
    process.exit(2);
  }
  if (target !== 'tenants') await central(dryRun);
  const failed = target !== 'central' ? await tenants(dryRun) : 0;
  process.exit(failed ? 1 : 0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
