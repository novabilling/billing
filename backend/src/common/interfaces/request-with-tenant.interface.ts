import { Request } from 'express';
import { PrismaClient } from '../../generated/prisma-tenant/client';
import type { MemberRole } from '../../generated/prisma-central/client';

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
  /** How the request authenticated: a dashboard session (JWT) or an API key. */
  authMethod?: 'session' | 'api_key';
  /** The signed-in person and their role here; absent for API keys. */
  member?: { userId: string; email: string; name: string; role: MemberRole };
}
