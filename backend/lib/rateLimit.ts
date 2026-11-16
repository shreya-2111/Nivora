// Rate limit (protection from spam / password guessing).
// Counts are kept in the database table "rate_limits", so it works even when the app runs on many servers (serverless).
import { pool } from './db';

const windowStart = (seconds: number) => Math.floor(Date.now() / 1000 / seconds) * seconds; // start of the current time slot

// add 1 hit for this key and return how many hits are in the current time slot
// usage: if ((await hit('guest:' + ip, 60)) > 60) return fail(429, ...)   -> max 60 per 60 seconds
export async function hit(key: string, seconds: number): Promise<number> {
  const slot = windowStart(seconds);
  const result = await pool.query(
    `INSERT INTO rate_limits (key, window_start, hits) VALUES ($1, $2, 1)
     ON CONFLICT (key, window_start) DO UPDATE SET hits = rate_limits.hits + 1
     RETURNING hits`,
    [key, slot]
  );
  // clean old rows now and then (1 in 50 requests)
  if (Math.random() < 0.02) await pool.query("DELETE FROM rate_limits WHERE window_start < $1", [slot - 86400]);
  return result.rows[0].hits;
}

// how many hits so far in the current time slot (does not add a hit)
export async function hits(key: string, seconds: number): Promise<number> {
  const result = await pool.query('SELECT hits FROM rate_limits WHERE key = $1 AND window_start = $2', [key, windowStart(seconds)]);
  return result.rows[0] ? result.rows[0].hits : 0;
}

export const TOO_MANY = 'Too many requests. Please try again later.';
