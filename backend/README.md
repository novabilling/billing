# NovaBilling Backend API

Multi-tenant billing service API built with NestJS, Prisma, and PostgreSQL. Supports subscription management, invoice generation, payment processing via multiple African payment providers, and automated billing cycles.

## Architecture

- **Multi-Database**: Central DB for tenant management + isolated PostgreSQL databases per tenant
- **Dynamic Connections**: Runtime Prisma client creation with connection pooling
- **Queue-Based Processing**: BullMQ with Redis for billing cycles, payments, webhooks, and emails
- **Payment Providers**: Flutterwave, Paystack, M-Pesa with abstract provider pattern

## Tech Stack

- NestJS + TypeScript
- Prisma ORM (dual schema: central + tenant)
- PostgreSQL 15
- Redis + BullMQ
- JWT Authentication + API Key auth
- Swagger/OpenAPI docs
- PDFKit for invoice generation
- Nodemailer for transactional emails

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma clients
npm run prisma:generate

# Run central database migrations
npm run prisma:migrate:central

# Start development server
npm run start:dev
```

## Docker Setup

```bash
docker-compose up -d
```

This starts:
- Central PostgreSQL (port 5432)
- Tenant PostgreSQL (port 5433)
- Redis (port 6379)
- NestJS API (port 3000)
- BullMQ Worker (2 replicas)

## Environment Variables

See `.env.example` for all required variables. Key ones:

| Variable | Description |
|----------|-------------|
| `CENTRAL_DATABASE_URL` | Central management database |
| `INTERNAL_POSTGRES_URL` | Admin access for creating tenant DBs |
| `REDIS_URL` | Redis for BullMQ queues |
| `JWT_SECRET` | JWT signing secret |
| `ENCRYPTION_KEY` | 32-byte hex key for AES-256 encryption |

## API Documentation

Swagger UI available at `http://localhost:3000/api/docs` when running.

### Authentication

**JWT Auth** (for tenant management):
```
POST /api/auth/register
POST /api/auth/login
```

**API Key Auth** (for tenant data operations):
```
Authorization: Bearer sk_live_xxxx
```

### Main Endpoints

| Module | Endpoints |
|--------|-----------|
| Auth | `POST /api/auth/register`, `/login`, `/refresh` |
| Tenants | `GET/PATCH /api/tenants/me`, `/me/api-keys` |
| Customers | `CRUD /api/customers` |
| Plans | `CRUD /api/plans`, `/plans/:id/prices` |
| Subscriptions | `CRUD /api/subscriptions`, `/cancel`, `/pause`, `/resume` |
| Invoices | `CRUD /api/invoices`, `/mark-paid`, `/void`, `/pdf` |
| Payments | `GET /api/payments`, `/refund` |
| Payment Providers | `CRUD /api/payment-providers`, `/test` |
| Analytics | `GET /api/analytics/revenue`, `/subscriptions`, `/customers` |
| Webhooks | `POST /webhooks/flutterwave`, `/paystack`, `/mpesa` |

## Scripts

```bash
# Migrate all tenant databases
npm run migrate:all-tenants

# Health check all databases
npm run health:check

# Seed a demo tenant with sample data
npm run seed:demo
```

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

```
backend/
├── prisma/                    # Database schemas
│   ├── schema-central.prisma  # Central DB (tenants, connections, API keys)
│   └── schema-tenant.prisma   # Tenant DB (customers, plans, subscriptions)
├── src/
│   ├── common/                # Guards, decorators, filters, middleware
│   ├── config/                # Configuration modules
│   ├── database/              # Central + tenant database services
│   ├── modules/               # Feature modules (auth, customers, plans, etc.)
│   ├── providers/             # Payment provider abstractions
│   ├── queues/                # BullMQ queue processors
│   ├── services/              # Shared services (PDF, email, webhook, encryption)
│   ├── app.module.ts          # Root module
│   └── main.ts                # Application bootstrap
├── scripts/                   # Utility scripts
└── test/                      # Unit and E2E tests
```

## Supported Currencies

NGN, KES, GHS, ZAR, UGX, TZS, RWF, EGP, XOF, XAF, MAD, ETB, DZD, ZMW, USD, EUR, GBP

## License

MIT
