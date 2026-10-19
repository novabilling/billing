/**
 * Bring every existing tenant database up to the current tenant schema.
 *
 * Tenant databases are created with `prisma db push` (there is no migration
 * history), so new tables only reach existing tenants through this script.
 * It runs `db push` WITHOUT --accept-data-loss: additive changes (new tables,
 * columns, indexes) apply, and anything that would drop or rewrite data makes
 * Prisma refuse, leaving that tenant untouched and reported as failed.
 *
 * Usage: CENTRAL_DATABASE_URL=... ENCRYPTION_KEY=... npm run schema:sync-tenants [-- --dry-run]
 */
import 'dotenv/config';
import { execSync } from 'child_process';
import { createDecipheriv } from 'crypto';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma-central/client';

const dryRun = process.argv.includes('--dry-run');

function decrypt(encrypted: string): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error('ENCRYPTION_KEY not set');
  const [ivHex, data] = encrypted.split(':');
  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(ivHex, 'hex'));
  return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
}

async function main(): Promise<void> {
  const centralUrl = process.env.CENTRAL_DATABASE_URL;
  if (!centralUrl) throw new Error('CENTRAL_DATABASE_URL not set');
  const central = new PrismaClient({ adapter: new PrismaPg({ connectionString: centralUrl }) });

  const connections = await central.databaseConnection.findMany({
    include: { tenant: { select: { name: true, slug: true } } },
  });
  console.log(`${dryRun ? '[dry run] ' : ''}Syncing ${connections.length} tenant database(s)\n`);

  const failed: string[] = [];
  for (const conn of connections) {
    const label = `${conn.tenant.name} (${conn.tenant.slug})`;
    if (dryRun) {
      console.log(`  would sync: ${label}`);
      continue;
    }
    try {
      const url = decrypt(conn.connectionUrl);
      execSync('npx prisma db push --schema=./prisma/schema-tenant.prisma', {
        env: { ...process.env, DATABASE_URL: url, CENTRAL_DATABASE_URL: url },
        timeout: 120000,
        encoding: 'utf-8',
        stdio: 'pipe',
      });
      console.log(`  ok: ${label}`);
    } catch (error) {
      const output = (error as { stdout?: string; stderr?: string }).stderr || (error as Error).message;
      console.error(`  FAILED: ${label}\n    ${String(output).trim().split('\n').slice(-3).join('\n    ')}`);
      failed.push(label);
    }
  }

  await central.$disconnect();
  console.log(`\nDone. ${connections.length - failed.length} ok, ${failed.length} failed.`);
  if (failed.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
