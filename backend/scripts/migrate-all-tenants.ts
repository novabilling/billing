import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { createDecipheriv } from 'crypto';

const centralDb = new PrismaClient({
  datasources: {
    db: { url: process.env.CENTRAL_DATABASE_URL },
  },
});

function decrypt(encrypted: string): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error('ENCRYPTION_KEY not set');

  const [ivHex, encryptedHex] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const keyBuffer = Buffer.from(key, 'hex');
  const decipher = createDecipheriv('aes-256-cbc', keyBuffer, iv);
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

async function migrateAllTenants(): Promise<void> {
  console.log('Starting migration of all tenant databases...\n');

  const connections = await centralDb.databaseConnection.findMany({
    include: { tenant: true },
  });

  console.log(`Found ${connections.length} tenant database(s)\n`);

  let successCount = 0;
  let failCount = 0;

  for (const conn of connections) {
    const tenantName = conn.tenant.name;
    console.log(`Migrating database for tenant "${tenantName}"...`);

    try {
      const connectionUrl = decrypt(conn.connectionUrl);

      const output = execSync(
        'npx prisma migrate deploy --schema=./prisma/schema-tenant.prisma',
        {
          env: { ...process.env, DATABASE_URL: connectionUrl },
          timeout: 60000,
          encoding: 'utf-8',
        },
      );

      console.log(`  OK: ${tenantName}`);
      console.log(`  ${output.trim().split('\n').pop()}`);
      successCount++;
    } catch (error) {
      console.error(`  FAILED: ${tenantName}`);
      console.error(
        `  Error: ${error instanceof Error ? error.message : 'Unknown'}`,
      );
      failCount++;
    }

    console.log();
  }

  console.log('Migration complete');
  console.log(`  Succeeded: ${successCount}`);
  console.log(`  Failed: ${failCount}`);

  await centralDb.$disconnect();
}

migrateAllTenants().catch((err) => {
  console.error('Migration script failed:', err);
  process.exit(1);
});
