import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { validationPipe } from './common/pipes/validation.pipe';

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
  app.setGlobalPrefix('api', {
    exclude: ['health', 'webhooks/{*splat}', 'api/reference', 'api/openapi.json'],
  });

  // OpenAPI document
  const config = new DocumentBuilder()
    .setTitle('NovaBilling API')
    .setDescription(
      'NovaBilling is a multi-tenant billing and subscription management API. ' +
        'It supports African and global payment providers including Stripe, Paystack, Flutterwave, and M-Pesa.\n\n' +
        '## Authentication\n' +
        '- **JWT (Bearer)**: Used for tenant management endpoints (`/api/tenants/me/*`, `/api/auth/*`). Obtain tokens via `/api/auth/login`.\n' +
        '- **API Key**: Used for all billing resource endpoints (customers, plans, subscriptions, invoices, payments, analytics). ' +
        'Pass your API key in the `Authorization` header as `Bearer sk_live_...`.\n\n' +
        '## Webhooks\n' +
        'Payment provider webhooks are received at `/webhooks/{provider}` (no `/api` prefix). ' +
        'Configure your provider dashboard to point to these URLs.\n' +
        'NovaBilling also forwards billing events to your application via the webhook URL configured in your tenant settings.',
    )
    .setVersion('1.0')
    .addServer(process.env.API_BASE_URL || 'http://localhost:4000', 'API Server')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .addApiKey({ type: 'apiKey', name: 'Authorization', in: 'header' }, 'api-key')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Tenants', 'Tenant management')
    .addTag('Customers', 'Customer management')
    .addTag('Plans', 'Plan management')
    .addTag('Subscriptions', 'Subscription management')
    .addTag('Invoices', 'Invoice management')
    .addTag('Payments', 'Payment management')
    .addTag('Payment Providers', 'Payment provider configuration')
    .addTag('Webhooks', 'Webhook endpoints')
    .addTag('Analytics', 'Analytics and reporting')
    .build();

  const document = SwaggerModule.createDocument(app, config);

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
        title: 'NovaBilling API Reference',
        description: 'Interactive API documentation for NovaBilling',
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
  logger.log(`NovaBilling API running on port ${port}`);
  logger.log(`API Reference available at http://localhost:${port}/api/reference`);
  logger.log(`OpenAPI spec available at http://localhost:${port}/api/openapi.json`);
}

bootstrap();
