import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CentralPrismaService } from './central-prisma.service';
import { TenantDatabaseService } from './tenant-database.service';
import { EncryptionService } from '../services/encryption.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [CentralPrismaService, TenantDatabaseService, EncryptionService],
  exports: [CentralPrismaService, TenantDatabaseService, EncryptionService],
})
export class DatabaseModule {}
