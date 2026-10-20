/**
 * Make an organisation the platform operator (its owners and admins get the
 * platform console): `node dist/cli/platform-operator.js <organisation id or email> [--remove]`
 * (or `npm run platform:operator -- <id or email>` in development).
 * An email matches the organisation's contact email or an owner's login.
 */
import 'dotenv/config';
import { Client } from 'pg';

interface Match {
  id: string;
  name: string;
  email: string;
  isPlatformOperator: boolean;
}

async function main() {
  const args = process.argv.slice(2);
  const remove = args.includes('--remove');
  const target = args.find((a) => !a.startsWith('--'))?.trim();
  if (!target) {
    console.error('Usage: platform-operator <organisation id or email> [--remove]');
    process.exit(2);
  }
  const url = process.env.CENTRAL_DATABASE_URL;
  if (!url) throw new Error('CENTRAL_DATABASE_URL not set');

  const db = new Client({ connectionString: url });
  await db.connect();
  try {
    const { rows } = await db.query<Match>(
      `SELECT DISTINCT t.id, t.name, t.email, t."isPlatformOperator"
         FROM "Tenant" t
         LEFT JOIN "Membership" m ON m."tenantId" = t.id AND m.role = 'OWNER'
         LEFT JOIN "User" u ON u.id = m."userId"
        WHERE t.id = $1 OR lower(t.email) = lower($1) OR lower(u.email) = lower($1)`,
      [target],
    );
    if (rows.length === 0) {
      console.error(`No organisation matches ${target}`);
      process.exit(1);
    }
    if (rows.length > 1) {
      console.error(`${target} matches several organisations; pass one id:`);
      for (const r of rows) console.error(`  ${r.id}  ${r.name} <${r.email}>`);
      process.exit(1);
    }
    const [tenant] = rows;
    await db.query(`UPDATE "Tenant" SET "isPlatformOperator" = $2, "accessMode" = 'FULL', "updatedAt" = now() WHERE id = $1`, [
      tenant.id,
      !remove,
    ]);
    console.log(
      remove
        ? `${tenant.name} (${tenant.id}) is no longer a platform operator.`
        : `${tenant.name} (${tenant.id}) is now a platform operator. Its owners and admins see Platform in the dashboard after signing in again.`,
    );
  } finally {
    await db.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
