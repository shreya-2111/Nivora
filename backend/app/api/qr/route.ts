import { NextRequest } from 'next/server';
import { pool } from '@/lib/db';
import { safe, ok, fail, readBody } from '@/lib/api';
import { getStaff } from '@/lib/auth';
import { makeToken, formatQr, SELECT_QR } from '@/lib/qr';

export const dynamic = 'force-dynamic';

// GET /api/qr    (add ?include_image=true to also get QR pictures)
export const GET = safe(async (req: NextRequest) => {
  if (!(await getStaff(req))) return fail(401, 'Please login first');
  const withImage = req.nextUrl.searchParams.get('include_image') === 'true';

  const result = await pool.query(`${SELECT_QR} ORDER BY r.room_number, q.created_at DESC`);
  const list = [];
  for (const row of result.rows) list.push(await formatQr(row, withImage));
  return ok({ qr_codes: list });
});

// POST /api/qr   body: { room_id }  -> makes a new QR for the room (old QR of that room is turned off)
export const POST = safe(async (req: NextRequest) => {
  if (!(await getStaff(req))) return fail(401, 'Please login first');

  const { body } = await readBody(req);
  if (!body.room_id) return fail(400, 'room_id is required');

  const room = await pool.query('SELECT id FROM rooms WHERE id = $1', [body.room_id]);
  if (!room.rows[0]) return fail(404, 'Room not found');

  await pool.query('UPDATE qr_codes SET is_active = FALSE, updated_at = NOW() WHERE room_id = $1', [body.room_id]);
  const created = await pool.query('INSERT INTO qr_codes (room_id, token) VALUES ($1, $2) RETURNING id', [body.room_id, makeToken()]);

  const result = await pool.query(`${SELECT_QR} WHERE q.id = $1`, [created.rows[0].id]);
  return ok({ qr_code: await formatQr(result.rows[0], true) }, 201);
});
