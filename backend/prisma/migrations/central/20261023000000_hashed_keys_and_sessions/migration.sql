-- DropIndex
DROP INDEX "Tenant_apiKey_idx";

-- DropIndex
DROP INDEX "ApiKey_key_idx";

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "apiKeyHash" TEXT,
ADD COLUMN     "apiKeyLast4" TEXT,
ALTER COLUMN "apiKey" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordChangedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "keyHash" TEXT,
ADD COLUMN     "last4" TEXT,
ALTER COLUMN "key" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_apiKeyHash_key" ON "Tenant"("apiKeyHash");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_keyHash_key" ON "ApiKey"("keyHash");


-- Store API keys only as SHA-256 hashes (with the last four characters for display),
-- then clear the plaintext copies.
UPDATE "Tenant"
SET "apiKeyHash" = encode(sha256(convert_to("apiKey", 'UTF8')), 'hex'),
    "apiKeyLast4" = right("apiKey", 4),
    "apiKey" = NULL
WHERE "apiKey" IS NOT NULL;

UPDATE "ApiKey"
SET "keyHash" = encode(sha256(convert_to("key", 'UTF8')), 'hex'),
    "last4" = right("key", 4),
    "key" = NULL
WHERE "key" IS NOT NULL;
