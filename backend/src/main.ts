import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { apiReference } from '@scalar/nestjs-api-reference';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { validationPipe } from './common/pipes/validation.pipe';
import { getBrand } from './config/brand';
import { buildOpenApiDocument, GLOBAL_PREFIX_EXCLUDE } from './openapi';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    rawBody: true,
  });

  // Serve uploaded PDFs as static files
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Security — relax CSP for the Scalar API reference UI
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          scriptSrc: [`'self'`, `'unsafe-inline'`, 'cdn.jsdelivr.net'],
          styleSrc: [`'self'`, `'unsafe-inline'`, 'cdn.jsdelivr.net', 'fonts.googleapis.com'],
          fontSrc: [`'self'`, 'fonts.gstatic.com', 'cdn.jsdelivr.net'],
          imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net'],
          connectSrc: [`'self'`],
          workerSrc: [`'self'`, 'blob:'],
        },
      },
    }),
  );
  app.enableCors({
    origin: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
      : ['http://localhost:4001', 'http://localhost:4002'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(validationPipe);

  // API prefix
  app.setGlobalPrefix('api', { exclude: GLOBAL_PREFIX_EXCLUDE });

  // OpenAPI document
  const brand = getBrand();
  const document = buildOpenApiDocument(app);

  // Serve raw OpenAPI JSON spec
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/api/openapi.json', (_req: unknown, res: { json: (body: unknown) => void }) => {
    res.json(document);
  });

  // Scalar API Reference (replaces Swagger UI)
  app.use(
    '/api/reference',
    apiReference({
      spec: {
        content: document,
      },
      theme: 'kepler',
      layout: 'modern',
      darkMode: true,
      metaData: {
        title: `${brand.name} API Reference`,
        description: `Interactive API documentation for ${brand.name}`,
      },
    }),
  );

  // Health check endpoint
  expressApp.get('/health', (_req: unknown, res: { json: (body: unknown) => void }) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`${brand.name} API running on port ${port}`);
  logger.log(`API Reference available at http://localhost:${port}/api/reference`);
  logger.log(`OpenAPI spec available at http://localhost:${port}/api/openapi.json`);
}

bootstrap();
