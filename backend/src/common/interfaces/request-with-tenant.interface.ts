import { Request } from 'express';
import { PrismaClient } from '../../generated/prisma-tenant/client';

export interface TenantInfo {
  id: string;
  name: string;
  slug: string;
  email: string;
  apiKey: string;
  isActive: boolean;
  webhookUrl: string | null;
  webhookSecret: string | null;
  settings: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RequestWithTenant extends Request {
  tenant: TenantInfo;
  tenantDb: PrismaClient;
}
