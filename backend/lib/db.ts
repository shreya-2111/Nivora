// Connection to the PostgreSQL database (Supabase Postgres).
// "pg" is the Postgres library for Node. A Pool keeps a few connections ready:
//   pool.query('SQL', [values])   - $1, $2 ... in the SQL are replaced by the values (safe from SQL injection)
import { Pool, types } from 'pg';

// Postgres sends NUMERIC (our prices) as text like "420.00" - convert it to a normal number.
types.setTypeParser(1700, parseFloat);

// Next.js reloads files while developing; keep ONE pool on globalThis so we don't open too many connections.
const globalForPool = globalThis as unknown as { pool?: Pool };

export const pool =
  globalForPool.pool ||
  (globalForPool.pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: 5, // serverless friendly
  }));
