-- CreateEnum
CREATE TYPE "TenantAccess" AS ENUM ('FULL', 'READ_ONLY', 'SUSPENDED');

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN "isPlatformOperator" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "accessMode" "TenantAccess" NOT NULL DEFAULT 'FULL',
ADD COLUMN "accessReason" TEXT,
ADD COLUMN "accessUrl" TEXT;
