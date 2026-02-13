import { PrismaClient } from '@prisma/client';
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

async function healthCheckDatabases(): Promise<void> {
  console.log('Running health check on all databases...\n');

  // Check central DB
  try {
    await centralDb.$queryRaw`SELECT 1`;
    console.log('Central DB: HEALTHY');
  } catch (error) {
    console.error('Central DB: UNHEALTHY');
    console.error(
      `  Error: ${error instanceof Error ? error.message : 'Unknown'}`,
    );
  }

  console.log();

  // Check tenant DBs
  const connections = await centralDb.databaseConnection.findMany({
    include: { tenant: { select: { name: true } } },
  });

  let healthy = 0;
  let unhealthy = 0;

  for (const conn of connections) {
    let tenantClient: PrismaClient | null = null;
    try {
      const connectionUrl = decrypt(conn.connectionUrl);
      tenantClient = new PrismaClient({
        datasources: { db: { url: connectionUrl } },
      });
      await tenantClient.$connect();
      await tenantClient.$queryRaw`SELECT 1`;

      await centralDb.databaseConnection.update({
        where: { id: conn.id },
        data: { isHealthy: true, lastHealthCheck: new Date() },
      });

      console.log(`Tenant "${conn.tenant.name}": HEALTHY`);
      healthy++;
    } catch (error) {
      await centralDb.databaseConnection.update({
        where: { id: conn.id },
        data: { isHealthy: false, lastHealthCheck: new Date() },
      });

      console.error(`Tenant "${conn.tenant.name}": UNHEALTHY`);
      console.error(
        `  Error: ${error instanceof Error ? error.message : 'Unknown'}`,
      );
      unhealthy++;
    } finally {
      if (tenantClient) await tenantClient.$disconnect();
    }
  }

  console.log(`\nResults: ${healthy} healthy, ${unhealthy} unhealthy out of ${connections.length} total`);

  await centralDb.$disconnect();
}

healthCheckDatabases().catch((err) => {
  console.error('Health check failed:', err);
  process.exit(1);
});
