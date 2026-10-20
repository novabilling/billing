-- CreateTable
CREATE TABLE "TenantLedgerStatus" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "lastSyncAt" TIMESTAMP(3),
    "lastCheckAt" TIMESTAMP(3),
    "balanced" BOOLEAN NOT NULL DEFAULT true,
    "warnings" INTEGER NOT NULL DEFAULT 0,
    "entriesPosted" INTEGER NOT NULL DEFAULT 0,
    "failedPostings" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "checks" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantLedgerStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiUsageHourly" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "hour" TIMESTAMP(3) NOT NULL,
    "route" TEXT NOT NULL,
    "authMethod" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "requests" INTEGER NOT NULL DEFAULT 0,
    "clientErrors" INTEGER NOT NULL DEFAULT 0,
    "serverErrors" INTEGER NOT NULL DEFAULT 0,
    "totalMs" BIGINT NOT NULL DEFAULT 0,
    "maxMs" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ApiUsageHourly_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantMetricsDaily" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "customers" INTEGER NOT NULL DEFAULT 0,
    "activeSubscriptions" INTEGER NOT NULL DEFAULT 0,
    "invoicesIssued30d" INTEGER NOT NULL DEFAULT 0,
    "paymentsSucceeded30d" INTEGER NOT NULL DEFAULT 0,
    "paymentsFailed30d" INTEGER NOT NULL DEFAULT 0,
    "paymentVolume30d" JSONB,
    "mrr" JSONB,
    "providerStats30d" JSONB,
    "providersConfigured" TEXT[],
    "featuresUsed" TEXT[],
    "firstPaymentAt" TIMESTAMP(3),
    "lastPaymentAt" TIMESTAMP(3),
    "moneyMovement30d" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TenantMetricsDaily_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TenantLedgerStatus_tenantId_key" ON "TenantLedgerStatus"("tenantId");

-- CreateIndex
CREATE INDEX "TenantLedgerStatus_balanced_idx" ON "TenantLedgerStatus"("balanced");

-- CreateIndex
CREATE INDEX "ApiUsageHourly_hour_idx" ON "ApiUsageHourly"("hour");

-- CreateIndex
CREATE INDEX "ApiUsageHourly_tenantId_hour_idx" ON "ApiUsageHourly"("tenantId", "hour");

-- CreateIndex
CREATE UNIQUE INDEX "ApiUsageHourly_tenantId_hour_route_authMethod_client_key" ON "ApiUsageHourly"("tenantId", "hour", "route", "authMethod", "client");

-- CreateIndex
CREATE INDEX "TenantMetricsDaily_date_idx" ON "TenantMetricsDaily"("date");

-- CreateIndex
CREATE UNIQUE INDEX "TenantMetricsDaily_tenantId_date_key" ON "TenantMetricsDaily"("tenantId", "date");

-- AddForeignKey
ALTER TABLE "TenantLedgerStatus" ADD CONSTRAINT "TenantLedgerStatus_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiUsageHourly" ADD CONSTRAINT "ApiUsageHourly_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantMetricsDaily" ADD CONSTRAINT "TenantMetricsDaily_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

