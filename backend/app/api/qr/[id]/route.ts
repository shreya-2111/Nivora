import { NextRequest } from 'next/server';
import { pool } from '@/lib/db';
import { safe, ok, fail, readBody } from '@/lib/api';
import { getStaff } from '@/lib/auth';
import { makeToken, formatQr, SELECT_QR } from '@/lib/qr';

export const dynamic = 'force-dynamic';

// PATCH /api/qr/:id   body: { is_active }  and/or  { regenerate: true } for a brand new token
export const PATCH = safe(async (req: NextRequest, { params }) => {
  if (!(await getStaff(req))) return fail(401, 'Please login first');
  const { id } = await params;

  const { body } = await readBody(req);
  const { is_active, regenerate } = body;
  if (is_active === undefined && !regenerate) return fail(400, 'Send is_active and/or regenerate');

  const current = await pool.query('SELECT * FROM qr_codes WHERE id = $1', [id]);
  if (!current.rows[0]) return fail(404, 'QR code not found');
  const qr = current.rows[0];

  const newActive = is_active === undefined ? qr.is_active : is_active === true || is_active === 'true';
  const newToken = regenerate ? makeToken() : qr.token;

  // only one active QR per room
  if (newActive) await pool.query('UPDATE qr_codes SET is_active = FALSE WHERE room_id = $1 AND id <> $2', [qr.room_id, qr.id]);
  await pool.query('UPDATE qr_codes SET is_active = $1, token = $2, updated_at = NOW() WHERE id = $3', [newActive, newToken, qr.id]);

  const result = await pool.query(`${SELECT_QR} WHERE q.id = $1`, [qr.id]);
  return ok({ qr_code: await formatQr(result.rows[0], true) });
});
