import { NextRequest } from 'next/server';
import { pool } from '@/lib/db';
import { safe, ok, fail, readBody } from '@/lib/api';
import { getStaff } from '@/lib/auth';
import { REQUEST_FLOW, getRequest } from '@/lib/requests';

export const dynamic = 'force-dynamic';

// PATCH /api/requests/:id/status   body: { status }
export const PATCH = safe(async (req: NextRequest, { params }) => {
  if (!(await getStaff(req))) return fail(401, 'Please login first');
  const { id } = await params;

  const { body } = await readBody(req);
  const status = body.status;
  if (!REQUEST_FLOW[status]) return fail(400, 'Invalid status');

  const current = await pool.query('SELECT status FROM service_requests WHERE id = $1', [id]);
  if (!current.rows[0]) return fail(404, 'Request not found');

  const from = current.rows[0].status;
  if (!REQUEST_FLOW[from].includes(status)) {
    return fail(409, `Cannot change request from ${from} to ${status}`, { code: 'INVALID_STATUS_CHANGE', allowed: REQUEST_FLOW[from] });
  }

  // "AND status = from" makes sure nobody else changed the status in the meantime
  const changed = await pool.query('UPDATE service_requests SET status = $1, updated_at = NOW() WHERE id = $2 AND status = $3', [status, id, from]);
  if (changed.rowCount === 0) {
    return fail(409, 'This request was just updated by someone else. Please refresh.', { code: 'INVALID_STATUS_CHANGE' });
  }

  return ok({ request: await getRequest(id) });
});
