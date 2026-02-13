import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  centralUrl: process.env.CENTRAL_DATABASE_URL,
  internalPostgresUrl: process.env.INTERNAL_POSTGRES_URL,
}));
