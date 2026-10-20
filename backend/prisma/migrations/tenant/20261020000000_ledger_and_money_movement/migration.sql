-- CreateEnum
CREATE TYPE "LedgerAccountType" AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE');

-- CreateEnum
CREATE TYPE "LedgerEntryType" AS ENUM ('INVOICE_ISSUED', 'INVOICE_VOIDED', 'PAYMENT_CAPTURED', 'PAYMENT_REFUNDED', 'WALLET_CREDITED', 'WALLET_DEBITED', 'CREDIT_NOTE_ISSUED', 'CREDIT_NOTE_VOIDED', 'COLLECTION', 'PAYOUT', 'TRANSFER', 'FEE', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "ProviderEventStatus" AS ENUM ('PROCESSED', 'DUPLICATE', 'IGNORED', 'FAILED');

-- CreateEnum
CREATE TYPE "MoneyIntentType" AS ENUM ('COLLECTION', 'PAYOUT', 'TRANSFER');

-- CreateEnum
CREATE TYPE "MoneyIntentStatus" AS ENUM ('REQUIRES_APPROVAL', 'PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'STUCK', 'CANCELED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "WalletTransactionKind" ADD VALUE 'WITHDRAWN';
ALTER TYPE "WalletTransactionKind" ADD VALUE 'PAYOUT_REVERSED';
ALTER TYPE "WalletTransactionKind" ADD VALUE 'TRANSFERRED_OUT';
ALTER TYPE "WalletTransactionKind" ADD VALUE 'TRANSFERRED_IN';

-- CreateTable
CREATE TABLE "LedgerAccount" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "LedgerAccountType" NOT NULL,
    "currency" TEXT NOT NULL,
    "balance" BIGINT NOT NULL DEFAULT 0,
    "customerId" TEXT,
    "walletId" TEXT,
    "provider" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LedgerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "type" "LedgerEntryType" NOT NULL,
    "description" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "effectiveAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerLine" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "currency" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "LedgerLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerCursor" (
    "source" TEXT NOT NULL,
    "position" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LedgerCursor_pkey" PRIMARY KEY ("source")
);

-- CreateTable
CREATE TABLE "ProviderEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "eventKey" TEXT NOT NULL,
    "eventType" TEXT,
    "status" "ProviderEventStatus" NOT NULL,
    "route" TEXT NOT NULL,
    "paymentId" TEXT,
    "intentId" TEXT,
    "amount" TEXT,
    "currency" TEXT,
    "mismatch" TEXT,
    "error" TEXT,
    "payload" JSONB NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProviderEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoneyIntent" (
    "id" TEXT NOT NULL,
    "type" "MoneyIntentType" NOT NULL,
    "status" "MoneyIntentStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(19,4) NOT NULL,
    "currency" TEXT NOT NULL,
    "provider" TEXT,
    "rail" TEXT NOT NULL,
    "party" JSONB,
    "description" TEXT,
    "clientReference" TEXT,
    "customerId" TEXT,
    "walletId" TEXT,
    "toWalletId" TEXT,
    "providerReference" TEXT,
    "providerTxnId" TEXT,
    "providerStatus" TEXT,
    "paymentUrl" TEXT,
    "paymentDetails" JSONB,
    "failureReason" TEXT,
    "fee" DECIMAL(19,4),
    "commission" DECIMAL(19,4),
    "commissionChargeTo" TEXT,
    "chargedAmount" DECIMAL(19,4),
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "lastCheckedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoneyIntent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CryptoAmountClaim" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "amount" DECIMAL(19,4) NOT NULL,
    "baseAmount" DECIMAL(19,4) NOT NULL,
    "reference" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CryptoAmountClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CryptoDeposit" (
    "id" TEXT NOT NULL,
    "chain" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "fromAddress" TEXT,
    "amount" DECIMAL(28,6) NOT NULL,
    "rawAmount" TEXT,
    "decimals" INTEGER,
    "blockTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CryptoDeposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CryptoAddressClaim" (
    "id" TEXT NOT NULL,
    "keyId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "reference" TEXT,
    "amountSats" BIGINT NOT NULL,
    "rate" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CryptoAddressClaim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LedgerAccount_type_idx" ON "LedgerAccount"("type");

-- CreateIndex
CREATE INDEX "LedgerAccount_customerId_idx" ON "LedgerAccount"("customerId");

-- CreateIndex
CREATE INDEX "LedgerAccount_walletId_idx" ON "LedgerAccount"("walletId");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerAccount_code_currency_key" ON "LedgerAccount"("code", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerEntry_reference_key" ON "LedgerEntry"("reference");

-- CreateIndex
CREATE INDEX "LedgerEntry_sourceType_sourceId_idx" ON "LedgerEntry"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "LedgerEntry_type_idx" ON "LedgerEntry"("type");

-- CreateIndex
CREATE INDEX "LedgerEntry_effectiveAt_idx" ON "LedgerEntry"("effectiveAt");

-- CreateIndex
CREATE INDEX "LedgerLine_entryId_idx" ON "LedgerLine"("entryId");

-- CreateIndex
CREATE INDEX "LedgerLine_accountId_idx" ON "LedgerLine"("accountId");

-- CreateIndex
CREATE INDEX "LedgerLine_currency_idx" ON "LedgerLine"("currency");

-- CreateIndex
CREATE INDEX "ProviderEvent_receivedAt_idx" ON "ProviderEvent"("receivedAt");

-- CreateIndex
CREATE INDEX "ProviderEvent_status_idx" ON "ProviderEvent"("status");

-- CreateIndex
CREATE INDEX "ProviderEvent_paymentId_idx" ON "ProviderEvent"("paymentId");

-- CreateIndex
CREATE INDEX "ProviderEvent_intentId_idx" ON "ProviderEvent"("intentId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderEvent_provider_eventKey_key" ON "ProviderEvent"("provider", "eventKey");

-- CreateIndex
CREATE UNIQUE INDEX "MoneyIntent_providerReference_key" ON "MoneyIntent"("providerReference");

-- CreateIndex
CREATE INDEX "MoneyIntent_type_status_idx" ON "MoneyIntent"("type", "status");

-- CreateIndex
CREATE INDEX "MoneyIntent_status_lastCheckedAt_idx" ON "MoneyIntent"("status", "lastCheckedAt");

-- CreateIndex
CREATE INDEX "MoneyIntent_customerId_idx" ON "MoneyIntent"("customerId");

-- CreateIndex
CREATE INDEX "MoneyIntent_walletId_idx" ON "MoneyIntent"("walletId");

-- CreateIndex
CREATE INDEX "MoneyIntent_createdAt_idx" ON "MoneyIntent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MoneyIntent_type_clientReference_key" ON "MoneyIntent"("type", "clientReference");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoAmountClaim_reference_key" ON "CryptoAmountClaim"("reference");

-- CreateIndex
CREATE INDEX "CryptoAmountClaim_address_expiresAt_idx" ON "CryptoAmountClaim"("address", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoAmountClaim_address_amount_key" ON "CryptoAmountClaim"("address", "amount");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoDeposit_txHash_key" ON "CryptoDeposit"("txHash");

-- CreateIndex
CREATE INDEX "CryptoDeposit_address_blockTime_idx" ON "CryptoDeposit"("address", "blockTime");

-- CreateIndex
CREATE INDEX "CryptoDeposit_status_idx" ON "CryptoDeposit"("status");

-- CreateIndex
CREATE INDEX "CryptoDeposit_reference_idx" ON "CryptoDeposit"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoAddressClaim_address_key" ON "CryptoAddressClaim"("address");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoAddressClaim_reference_key" ON "CryptoAddressClaim"("reference");

-- CreateIndex
CREATE INDEX "CryptoAddressClaim_keyId_expiresAt_idx" ON "CryptoAddressClaim"("keyId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoAddressClaim_keyId_index_key" ON "CryptoAddressClaim"("keyId", "index");

-- AddForeignKey
ALTER TABLE "LedgerLine" ADD CONSTRAINT "LedgerLine_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "LedgerEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerLine" ADD CONSTRAINT "LedgerLine_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "LedgerAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

