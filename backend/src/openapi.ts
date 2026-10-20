import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { getBrand } from './config/brand';
import { PARTY_SCHEMA, PARTY_SCHEMA_NAME } from './modules/money/dto/party.dto';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { version } = require('../package.json') as { version: string };

/** Routes outside the /api prefix: provider webhooks, health and the reference itself. */
export const GLOBAL_PREFIX_EXCLUDE = ['health', 'webhooks/{*splat}', 'api/reference', 'api/openapi.json'];

/**
 * The API's OpenAPI document. Built the same way by the running server and
 * by `npm run openapi:export`, which writes the committed spec that SDKs and
 * docs are generated from.
 */
export function buildOpenApiDocument(app: INestApplication, serverUrl = process.env.API_BASE_URL || 'http://localhost:4000'): OpenAPIObject {
  const brand = getBrand();
  const config = new DocumentBuilder()
    .setTitle(`${brand.name} API`)
    .setDescription(
      `${brand.name} is a multi-tenant billing and subscription management API. ` +
        'It supports African and global payment providers including Stripe, Paystack, Flutterwave, Pesapal, MTN MoMo and Airtel Money.\n\n' +
        '## Authentication\n' +
        '- **JWT (Bearer)**: Used for tenant management endpoints (`/api/tenants/me/*`, `/api/auth/*`). Obtain tokens via `/api/auth/login`.\n' +
        '- **API Key**: Used for all billing resource endpoints (customers, plans, subscriptions, invoices, payments, analytics). ' +
        'Pass your API key in the `Authorization` header as `Bearer sk_live_...`.\n\n' +
        '## Webhooks\n' +
        'Payment provider webhooks are received at `/webhooks/{provider}` (no `/api` prefix). ' +
        'Configure your provider dashboard to point to these URLs.\n' +
        `${brand.name} also forwards billing events to your application via the webhook URL configured in your tenant settings.`,
    )
    .setVersion(version)
    .addServer(serverUrl, 'API Server')
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
  document.components = { ...document.components, schemas: { ...document.components?.schemas, [PARTY_SCHEMA_NAME]: PARTY_SCHEMA } };
  return document;
}
