import { NextRequest } from 'next/server';
import { pool } from '@/lib/db';
import { safe, ok, fail, readBody } from '@/lib/api';
import { getStaff } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/rooms
export const GET = safe(async (req: NextRequest) => {
  if (!(await getStaff(req))) return fail(401, 'Please login first');
  const result = await pool.query('SELECT * FROM rooms ORDER BY floor NULLS LAST, room_number');
  return ok({ rooms: result.rows });
});

// POST /api/rooms   body: { room_number, floor, status }
export const POST = safe(async (req: NextRequest) => {
  if (!(await getStaff(req))) return fail(401, 'Please login first');

  const { body } = await readBody(req);
  const { room_number, floor, status } = body;
  if (!room_number || !String(room_number).trim()) return fail(400, 'room_number is required');
  if (status && status !== 'ACTIVE' && status !== 'INACTIVE') return fail(400, 'status must be ACTIVE or INACTIVE');

  const exists = await pool.query('SELECT id FROM rooms WHERE room_number = $1', [String(room_number).trim()]);
  if (exists.rows[0]) return fail(409, `Room ${room_number} already exists`);

  const result = await pool.query('INSERT INTO rooms (room_number, floor, status) VALUES ($1, $2, $3) RETURNING *', [
    String(room_number).trim(), floor ?? null, status || 'ACTIVE',
  ]);
  return ok({ room: result.rows[0] }, 201);
});
