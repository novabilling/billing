import { Prisma, PrismaClient } from '../../generated/prisma-tenant/client';
import { Dec, dec } from './pricing';

/**
 * Aggregates a subscription's usage events for one metric over [from, to) in
 * the database, so a busy subscription's events are never loaded into memory.
 * A property that is missing or not a number counts as 0, as before.
 */
export async function aggregateUsage(
  db: PrismaClient | Prisma.TransactionClient,
  params: { subscriptionId: string; code: string; aggregationType: string; fieldName?: string | null; from: Date; to: Date },
): Promise<Dec> {
  const { subscriptionId, code, aggregationType, from, to } = params;
  const field = params.fieldName ?? '';
  const where = Prisma.sql`"subscriptionId" = ${subscriptionId} AND "code" = ${code} AND "timestamp" >= ${from} AND "timestamp" < ${to}`;
  const value = numeric(field);

  let query: Prisma.Sql;
  switch (aggregationType) {
    case 'COUNT':
      query = Prisma.sql`SELECT COUNT(*)::numeric AS v FROM "UsageEvent" WHERE ${where}`;
      break;
    case 'SUM':
      query = Prisma.sql`SELECT COALESCE(SUM(${value}), 0) AS v FROM "UsageEvent" WHERE ${where}`;
      break;
    case 'MAX':
      query = Prisma.sql`SELECT COALESCE(MAX(${value}), 0) AS v FROM "UsageEvent" WHERE ${where}`;
      break;
    case 'UNIQUE_COUNT':
      query = Prisma.sql`SELECT COUNT(DISTINCT COALESCE("properties" ->> ${field}::text, ''))::numeric AS v FROM "UsageEvent" WHERE ${where}`;
      break;
    case 'LATEST':
      query = Prisma.sql`SELECT ${value} AS v FROM "UsageEvent" WHERE ${where} ORDER BY "timestamp" DESC, "createdAt" DESC LIMIT 1`;
      break;
    case 'WEIGHTED_SUM': {
      const weight = numeric('weight');
      query = Prisma.sql`SELECT COALESCE(SUM(${value} * COALESCE(NULLIF(${weight}, 0), 1)), 0) AS v FROM "UsageEvent" WHERE ${where}`;
      break;
    }
    default:
      return new Dec(0);
  }

  const rows = await db.$queryRaw<{ v: unknown }[]>(query);
  const v = rows[0]?.v;
  return dec(v === null || v === undefined ? 0 : String(v));
}

/** A JSON property as a number: numbers and numeric strings count, anything else is 0. */
function numeric(field: string): Prisma.Sql {
  return Prisma.sql`(CASE
    WHEN jsonb_typeof("properties" -> ${field}::text) = 'number' THEN ("properties" ->> ${field}::text)::numeric
    WHEN ("properties" ->> ${field}::text) ~ '^\\s*-?[0-9]+(\\.[0-9]+)?\\s*$' THEN trim("properties" ->> ${field}::text)::numeric
    ELSE 0 END)`;
}
