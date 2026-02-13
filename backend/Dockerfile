# Multi-stage build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm ci

COPY . .

# Generate Prisma clients (Prisma 7 requires explicit generate)
RUN npx prisma generate --schema=./prisma/schema-central.prisma
RUN npx prisma generate --schema=./prisma/schema-tenant.prisma

RUN npm run build

# Production dependencies only
FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm ci --omit=dev

# Re-generate Prisma clients in prod node_modules
RUN npx prisma generate --schema=./prisma/schema-central.prisma
RUN npx prisma generate --schema=./prisma/schema-tenant.prisma

# Production image
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/src/generated ./dist/generated

# Create uploads directory for invoice PDFs
RUN mkdir -p /app/uploads/invoices

EXPOSE 4000

CMD ["sh", "-c", "npx prisma db push --schema=./prisma/schema-central.prisma --accept-data-loss && node dist/main"]
