-- AlterEnum
ALTER TYPE "WalletTransactionKind" ADD VALUE 'REFUNDED';

-- AlterEnum
ALTER TYPE "ProviderEventStatus" ADD VALUE 'HELD';

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "billingAnchor" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "billingKey" TEXT,
ADD COLUMN     "kind" TEXT,
ADD COLUMN     "periodEnd" TIMESTAMP(3),
ADD COLUMN     "periodStart" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "MoneyIntent" ADD COLUMN     "createdBy" TEXT;

-- CreateTable
CREATE TABLE "Sequence" (
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Sequence_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_billingKey_key" ON "Invoice"("billingKey");

-- CreateIndex
CREATE INDEX "Invoice_subscriptionId_kind_periodStart_idx" ON "Invoice"("subscriptionId", "kind", "periodStart");


-- Start invoice numbers after the highest existing INV-<n>.
INSERT INTO "Sequence" ("name", "value")
SELECT 'invoice', COALESCE(MAX((substring("invoiceNumber" from '^INV-(\d{1,9})$'))::int), 0)
FROM "Invoice"
ON CONFLICT ("name") DO NOTHING;
