import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),

  PORT: Joi.number().default(3000),

  CENTRAL_DATABASE_URL: Joi.string().required(),

  INTERNAL_POSTGRES_URL: Joi.string().required(),

  REDIS_URL: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),

  JWT_EXPIRATION: Joi.string().default('1h'),

  JWT_REFRESH_SECRET: Joi.string().required(),

  JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),

  ENCRYPTION_KEY: Joi.string().length(64).required(),

  EMAIL_HOST: Joi.string().optional().allow(''),

  EMAIL_PORT: Joi.number().optional().allow(''),

  EMAIL_USER: Joi.string().optional().allow(''),

  EMAIL_PASSWORD: Joi.string().optional().allow(''),

  EMAIL_FROM: Joi.string().optional().allow(''),

  EMAIL_FROM_NAME: Joi.string().optional().allow(''),

  PDF_STORAGE_PATH: Joi.string().optional().default('./uploads/invoices'),

  CORS_ORIGINS: Joi.string().optional(),

  API_BASE_URL: Joi.string().optional().default('http://localhost:4000'),

  // 'shadow' projects billing activity into the double-entry ledger alongside
  // the existing tables (nothing reads from it yet); 'off' disables it.
  // Comma-separated tenant ids whose dashboard sessions may open the platform console.
  PLATFORM_ADMIN_TENANT_IDS: Joi.string().optional().allow(''),

  // Product branding (see src/config/brand.ts).
  BRAND_NAME: Joi.string().optional().allow(''),
  BRAND_SLUG: Joi.string().optional().allow(''),
  BRAND_SUPPORT_EMAIL: Joi.string().optional().allow(''),
  BRAND_WEBSITE: Joi.string().optional().allow(''),

  LEDGER_MODE: Joi.string().valid('off', 'shadow').optional().default('shadow'),
});
