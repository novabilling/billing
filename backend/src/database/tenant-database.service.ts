import {
  Injectable,
  Logger,
  OnModuleDestroy,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma-tenant/client';
import { execSync } from 'child_process';
import { randomBytes } from 'crypto';
import { CentralPrismaService } from './central-prisma.service';
import { EncryptionService } from '../services/encryption.service';

export interface HealthCheckResult {
  tenantId: string;
  isHealthy: boolean;
  lastCheck: Date;
  error?: string;
}

@Injectable()
export class TenantDatabaseService implements OnModuleDestroy {
  private readonly logger = new Logger(TenantDatabaseService.name);
  private readonly tenantClients: Map<string, PrismaClient> = new Map();

  constructor(
    private readonly centralPrisma: CentralPrismaService,
    private readonly encryptionService: EncryptionService,
    private readonly configService: ConfigService,
  ) {}

  async getTenantClient(tenantId: string): Promise<PrismaClient> {
    const cached = this.tenantClients.get(tenantId);
    if (cached) {
      return cached;
    }

    const connection = await this.centralPrisma.client.databaseConnection.findUnique({
      where: { tenantId },
    });

    if (!connection) {
      throw new NotFoundException(`Database connection not found for tenant ${tenantId}`);
    }

    if (!connection.isHealthy) {
      this.logger.warn(
        `Tenant ${tenantId} database marked as unhealthy, attempting connection anyway`,
      );
    }

    const connectionUrl = this.encryptionService.decrypt(connection.connectionUrl);

    const adapter = new PrismaPg({ connectionString: connectionUrl });
    const client = new PrismaClient({ adapter });

    try {
      await client.$queryRaw`SELECT 1`;
    } catch (error) {
      await client.$disconnect().catch(() => {});
      this.logger.error(`Failed to connect to tenant ${tenantId} database`, error);
      throw new InternalServerErrorException(`Cannot connect to tenant database`);
    }

    this.tenantClients.set(tenantId, client);
    return client;
  }

  async createTenantDatabase(tenantId: string): Promise<void> {
    const sanitizedId = tenantId.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const dbName = `tenant_${sanitizedId}`;
    const dbUser = `tenant_user_${sanitizedId}`;
    const dbPassword = randomBytes(24).toString('hex');

    const internalUrl = this.configService.get<string>('INTERNAL_POSTGRES_URL');
    if (!internalUrl) {
      throw new InternalServerErrorException('INTERNAL_POSTGRES_URL not configured');
    }

    const adapter = new PrismaPg({ connectionString: internalUrl });
    const adminClient = new PrismaClient({ adapter });

    try {
      await adminClient.$executeRawUnsafe(`CREATE DATABASE "${dbName}"`);
      this.logger.log(`Created database: ${dbName}`);

      await adminClient.$executeRawUnsafe(
        `CREATE USER "${dbUser}" WITH ENCRYPTED PASSWORD '${dbPassword}'`,
      );
      await adminClient.$executeRawUnsafe(
        `GRANT ALL PRIVILEGES ON DATABASE "${dbName}" TO "${dbUser}"`,
      );

      // PostgreSQL 15+ no longer grants CREATE on public schema by default.
      // Connect to the new database as admin to grant schema permissions.
      const urlObj = new URL(internalUrl);
      const adminTenantUrl = `postgresql://${urlObj.username}:${urlObj.password}@${urlObj.hostname}:${urlObj.port || '5432'}/${dbName}`;
      const adminTenantAdapter = new PrismaPg({ connectionString: adminTenantUrl });
      const adminTenantClient = new PrismaClient({ adapter: adminTenantAdapter });
      try {
        await adminTenantClient.$executeRawUnsafe(`GRANT ALL ON SCHEMA public TO "${dbUser}"`);
        await adminTenantClient.$executeRawUnsafe(
          `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "${dbUser}"`,
        );
        await adminTenantClient.$executeRawUnsafe(
          `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "${dbUser}"`,
        );
      } finally {
        await adminTenantClient.$disconnect();
      }

      this.logger.log(`Created user and granted privileges: ${dbUser}`);

      const connectionUrl = `postgresql://${dbUser}:${dbPassword}@${urlObj.hostname}:${urlObj.port || '5432'}/${dbName}?schema=public`;

      const encryptedUrl = this.encryptionService.encrypt(connectionUrl);

      await this.centralPrisma.client.databaseConnection.create({
        data: {
          tenantId,
          provider: 'INTERNAL',
          connectionUrl: encryptedUrl,
          isHealthy: true,
          lastHealthCheck: new Date(),
        },
      });

      await this.runTenantMigrations(connectionUrl);
      this.logger.log(`Tenant database setup complete for: ${tenantId}`);
    } catch (error) {
      this.logger.error(`Failed to create tenant database for ${tenantId}`, error);
      throw new InternalServerErrorException('Failed to provision tenant database');
    } finally {
      await adminClient.$disconnect();
    }
  }

  async runTenantMigrations(connectionUrl: string): Promise<void> {
    try {
      const output = execSync(
        `npx prisma db push --schema=./prisma/schema-tenant.prisma --accept-data-loss`,
        {
          env: {
            ...process.env,
            DATABASE_URL: connectionUrl,
            CENTRAL_DATABASE_URL: connectionUrl,
          },
          timeout: 60000,
          encoding: 'utf-8',
        },
      );
      this.logger.log(`Tenant schema push completed: ${output}`);
    } catch (error) {
      this.logger.error('Tenant schema push failed', error);
      throw new InternalServerErrorException('Failed to push tenant schema');
    }
  }

  async healthCheckAllTenants(): Promise<HealthCheckResult[]> {
    const connections = await this.centralPrisma.client.databaseConnection.findMany({
      select: { tenantId: true, connectionUrl: true },
    });

    const results: HealthCheckResult[] = [];

    for (const conn of connections) {
      const result: HealthCheckResult = {
        tenantId: conn.tenantId,
        isHealthy: false,
        lastCheck: new Date(),
      };

      try {
        const client = await this.getTenantClient(conn.tenantId);
        await client.$queryRaw`SELECT 1`;
        result.isHealthy = true;

        await this.centralPrisma.client.databaseConnection.update({
          where: { tenantId: conn.tenantId },
          data: { isHealthy: true, lastHealthCheck: new Date() },
        });
      } catch (error) {
        result.isHealthy = false;
        result.error = error instanceof Error ? error.message : 'Unknown error';

        await this.centralPrisma.client.databaseConnection.update({
          where: { tenantId: conn.tenantId },
          data: { isHealthy: false, lastHealthCheck: new Date() },
        });
      }

      results.push(result);
    }

    return results;
  }

  async disconnectTenant(tenantId: string): Promise<void> {
    const client = this.tenantClients.get(tenantId);
    if (client) {
      await client.$disconnect();
      this.tenantClients.delete(tenantId);
      this.logger.log(`Disconnected tenant: ${tenantId}`);
    }
  }

  async disconnectAll(): Promise<void> {
    const disconnectPromises: Promise<void>[] = [];
    for (const [tenantId, client] of this.tenantClients) {
      disconnectPromises.push(
        client.$disconnect().then(() => {
          this.logger.debug(`Disconnected tenant: ${tenantId}`);
        }),
      );
    }
    await Promise.allSettled(disconnectPromises);
    this.tenantClients.clear();
    this.logger.log('All tenant connections disconnected');
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnectAll();
  }
}
