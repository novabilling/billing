-- AlterTable
ALTER TABLE "TenantBilling" ADD COLUMN     "limits" JSONB,
ADD COLUMN     "manageUrl" TEXT,
ADD COLUMN     "planName" TEXT;
