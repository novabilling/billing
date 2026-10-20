/**
 * Write the committed OpenAPI spec (openapi/openapi.json) without starting
 * the server or touching a database: `npm run openapi:export`. CI fails when
 * the committed spec differs from what the code describes.
 */
import 'reflect-metadata';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';

// Config validation needs these to be present; preview mode never connects to anything, so placeholders do.
const PLACEHOLDERS: Record<string, string> = {
  NODE_ENV: 'test',
  CENTRAL_DATABASE_URL: 'postgresql://unused@localhost/unused',
  INTERNAL_POSTGRES_URL: 'postgresql://unused@localhost/unused',
  REDIS_URL: 'redis://localhost:6379',
  JWT_SECRET: 'unused',
  JWT_REFRESH_SECRET: 'unused',
  ENCRYPTION_KEY: '0'.repeat(64),
};
for (const [key, value] of Object.entries(PLACEHOLDERS)) process.env[key] ??= value;

/** Same document whatever the machine: fixed server URL and key order. */
function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value as Record<string, unknown>)
        .sort()
        .map((k) => [k, sortKeys((value as Record<string, unknown>)[k])]),
    );
  }
  return value;
}

async function main() {
  // Loaded after the placeholders above, since loading validates the configuration.
  const { AppModule } = await import('../app.module');
  const { buildOpenApiDocument, GLOBAL_PREFIX_EXCLUDE } = await import('../openapi');
  // Preview mode builds the module graph without instantiating providers, so no database, Redis or queues are needed.
  const app = await NestFactory.create(AppModule, { preview: true, logger: false, abortOnError: false });
  app.setGlobalPrefix('api', { exclude: GLOBAL_PREFIX_EXCLUDE });
  const document = buildOpenApiDocument(app, 'http://localhost:4000');
  const out = join(__dirname, '..', '..', 'openapi', 'openapi.json');
  mkdirSync(join(out, '..'), { recursive: true });
  writeFileSync(out, `${JSON.stringify(sortKeys(document), null, 2)}\n`);
  console.log(`Wrote ${Object.keys(document.paths).length} paths to openapi/openapi.json`);
  await app.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
