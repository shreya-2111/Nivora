import { NextRequest } from 'next/server';
import { pool } from '@/lib/db';
import { safe, ok, fail, readBody } from '@/lib/api';
import { getStaff } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// PATCH /api/rooms/:id
export const PATCH = safe(async (req: NextRequest, { params }) => {
  if (!(await getStaff(req))) return fail(401, 'Please login first');
  const { id } = await params;

  const { body } = await readBody(req);
  const { room_number, floor, status } = body;
  if (status && status !== 'ACTIVE' && status !== 'INACTIVE') return fail(400, 'status must be ACTIVE or INACTIVE');

  if (room_number) {
    const exists = await pool.query('SELECT id FROM rooms WHERE room_number = $1 AND id <> $2', [room_number, id]);
    if (exists.rows[0]) return fail(409, `Room ${room_number} already exists`);
  }

  const result = await pool.query(
    `UPDATE rooms SET room_number = COALESCE($1, room_number), floor = COALESCE($2, floor),
       status = COALESCE($3, status), updated_at = NOW()
     WHERE id = $4 RETURNING *`,
    [room_number ?? null, floor ?? null, status ?? null, id]
  );
  if (!result.rows[0]) return fail(404, 'Room not found');
  return ok({ room: result.rows[0] });
});

// DELETE /api/rooms/:id
export const DELETE = safe(async (req: NextRequest, { params }) => {
  if (!(await getStaff(req))) return fail(401, 'Please login first');
  const { id } = await params;

  // a room that already has orders/requests cannot be deleted (history must stay)
  const used = await pool.query(
    `SELECT (SELECT COUNT(*) FROM orders WHERE room_id = $1) + (SELECT COUNT(*) FROM service_requests WHERE room_id = $1) AS n`,
    [id]
  );
  if (Number(used.rows[0].n) > 0) return fail(409, 'This room has order/request history. Set it to INACTIVE instead of deleting.');

  const result = await pool.query('DELETE FROM rooms WHERE id = $1', [id]);
  if (result.rowCount === 0) return fail(404, 'Room not found');
  return ok({ message: 'Room deleted' });
});
