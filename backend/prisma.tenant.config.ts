import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// One tenant database, chosen by DATABASE_URL. Used with --config for every tenant migrate command.
export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema-tenant.prisma',
  migrations: { path: './prisma/migrations/tenant' },
  datasource: {
    url: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/tenant',
  },
});
