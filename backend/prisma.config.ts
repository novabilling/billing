import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema-central.prisma',
  datasource: {
    url:
      process.env.CENTRAL_DATABASE_URL ?? 'postgresql://central:centralpass@localhost:5432/central',
  },
});
