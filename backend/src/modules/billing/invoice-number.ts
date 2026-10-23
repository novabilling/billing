import { Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '../../generated/prisma-tenant/client';

const logger = new Logger('InvoiceNumber');

/**
 * The next free INV-<n> number, from an atomic counter: concurrent invoice
 * creation never computes the same number, and a number already taken (for
 * example by an invoice numbered by hand) is skipped.
 */
export async function nextInvoiceNumber(db: PrismaClient | Prisma.TransactionClient): Promise<string> {
  for (let attempt = 0; attempt < 50; attempt++) {
    let n: number;
    try {
      const rows = await db.$queryRaw<{ value: number }[]>`
        INSERT INTO "Sequence" ("name", "value") VALUES ('invoice', 1)
        ON CONFLICT ("name") DO UPDATE SET "value" = "Sequence"."value" + 1
        RETURNING "value"`;
      n = Number(rows[0].value);
    } catch (error) {
      // A tenant database not migrated yet has no counter: fall back to the old way.
      logger.warn(`Invoice counter unavailable, numbering from the latest invoice: ${error instanceof Error ? error.message : error}`);
      return legacyNextNumber(db);
    }
    const candidate = formatInvoiceNumber(n);
    const taken = await db.invoice.findUnique({ where: { invoiceNumber: candidate }, select: { id: true } });
    if (!taken) return candidate;
  }
  throw new Error('Could not find a free invoice number');
}

export function formatInvoiceNumber(n: number): string {
  return `INV-${String(n).padStart(5, '0')}`;
}

async function legacyNextNumber(db: PrismaClient | Prisma.TransactionClient): Promise<string> {
  const rows = await db.$queryRaw<{ n: number | null }[]>`
    SELECT MAX((substring("invoiceNumber" from '^INV-(\\d{1,9})$'))::int) AS n FROM "Invoice"`;
  return formatInvoiceNumber(Number(rows[0]?.n ?? 0) + 1);
}
