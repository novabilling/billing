import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Central database. Tenant databases use prisma.tenant.config.ts.
export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema-central.prisma',
  migrations: { path: './prisma/migrations/central' },
  datasource: {
    url:
      process.env.CENTRAL_DATABASE_URL ?? 'postgresql://central:centralpass@localhost:5432/central',
  },
});
