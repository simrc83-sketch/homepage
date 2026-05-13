import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const rawUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const connectionString = rawUrl?.replace(/[?&]sslmode=[^&]+/gi, "");

if (!connectionString) {
  throw new Error("DATABASE_URL or POSTGRES_URL is required");
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
