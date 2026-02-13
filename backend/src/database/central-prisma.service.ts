import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma-central/client';

@Injectable()
export class CentralPrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CentralPrismaService.name);
  public readonly client: PrismaClient;
  private readonly adapter: PrismaPg;

  constructor(private readonly configService: ConfigService) {
    const connectionString = this.configService.get<string>('CENTRAL_DATABASE_URL');
    this.adapter = new PrismaPg({ connectionString });
    this.client = new PrismaClient({ adapter: this.adapter });
  }

  async onModuleInit(): Promise<void> {
    try {
      // Verify connection by running a simple query
      await this.client.$queryRaw`SELECT 1`;
      this.logger.log('Central database connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to central database', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.$disconnect();
    this.logger.log('Central database disconnected');
  }
}
