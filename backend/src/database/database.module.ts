import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CentralPrismaService } from './central-prisma.service';
import { TenantDatabaseService } from './tenant-database.service';
import { EncryptionService } from '../services/encryption.service';
import { CronLockService } from '../common/scheduling/cron-lock.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [CentralPrismaService, TenantDatabaseService, EncryptionService, CronLockService],
  exports: [CentralPrismaService, TenantDatabaseService, EncryptionService, CronLockService],
})
export class DatabaseModule {}
