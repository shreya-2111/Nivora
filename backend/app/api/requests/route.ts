import { NextRequest } from 'next/server';
import { pool } from '@/lib/db';
import { safe, ok, fail, readBody, getIp } from '@/lib/api';
import { getStaff, getGuest } from '@/lib/auth';
import { hit, TOO_MANY } from '@/lib/rateLimit';
import { getHotel } from '@/lib/hotel';
import { REQUEST_FLOW, SELECT_REQUESTS, formatRequest, getRequest } from '@/lib/requests';

export const dynamic = 'force-dynamic';

// POST /api/requests   (guest)   body: { service_category_id, custom_request }
export const POST = safe(async (req: NextRequest) => {
  const guest = await getGuest(req);
  if (!guest) return fail(401, 'Session expired. Please scan the QR code again.');
  if ((await hit('request:' + getIp(req), 600)) > 20) return fail(429, TOO_MANY); // 20 per 10 minutes

  const { body } = await readBody(req);
  const { service_category_id, custom_request, room_id } = body;
  const roomId = guest.roomId;

  const hotel = await getHotel();
  if (!hotel.module_room_service) return fail(403, 'Room service is not available right now', { code: 'MODULE_DISABLED' });

  // double submit protection (see /api/orders): same Idempotency-Key = same request
  const key = req.headers.get('idempotency-key') || body.idempotency_key || null;
  if (key) {
    const same = await pool.query('SELECT id FROM service_requests WHERE room_id = $1 AND idempotency_key = $2', [roomId, key]);
    if (same.rows[0]) return ok({ request: await getRequest(same.rows[0].id), duplicate: true });
  }

  if (!service_category_id) return fail(400, 'service_category_id is required');
  if (room_id && room_id !== roomId) return fail(400, 'Invalid room');
  if (custom_request && String(custom_request).length > 500) return fail(400, 'custom_request is too long (max 500 characters)');

  const category = await pool.query('SELECT * FROM service_categories WHERE id = $1', [service_category_id]);
  if (!category.rows[0]) return fail(400, 'Invalid request type');
  if (!category.rows[0].is_active) return fail(400, 'This request type is not available right now');

  // "Other Request" needs a description
  if (category.rows[0].name.toLowerCase().startsWith('other') && !(custom_request && String(custom_request).trim())) {
    return fail(400, 'Please describe your request');
  }

  // no key sent: fallback check - same room + same request type within the last 10 seconds
  if (!key) {
    const dup = await pool.query(
      `SELECT id FROM service_requests WHERE room_id = $1 AND service_category_id = $2
       AND status = 'NEW' AND created_at > NOW() - INTERVAL '10 seconds'`,
      [roomId, service_category_id]
    );
    if (dup.rows[0]) return fail(409, 'This request was just submitted. Please wait.', { code: 'DUPLICATE_REQUEST', request_id: dup.rows[0].id });
  }

  const seq = await pool.query("SELECT nextval('request_number_seq') AS n");
  let created;
  try {
    created = await pool.query(
      `INSERT INTO service_requests (request_number, room_id, service_category_id, custom_request, idempotency_key)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      ['REQ-' + seq.rows[0].n, roomId, service_category_id, custom_request ? String(custom_request).trim() : null, key]
    );
  } catch (err: any) {
    // two taps at the exact same moment with the same key -> return the first request
    if (err.code === '23505' && key) {
      const same = await pool.query('SELECT id FROM service_requests WHERE room_id = $1 AND idempotency_key = $2', [roomId, key]);
      if (same.rows[0]) return ok({ request: await getRequest(same.rows[0].id), duplicate: true });
    }
    throw err;
  }

  // (staff dashboard gets this live from Supabase Realtime)
  return ok({ request: await getRequest(created.rows[0].id) }, 201);
});

// GET /api/requests   (staff)   filters: ?status=NEW,ACCEPTED  ?room_id=  ?page=1  ?limit=20
export const GET = safe(async (req: NextRequest) => {
  if (!(await getStaff(req))) return fail(401, 'Please login first');
  const q = req.nextUrl.searchParams;

  const page = Math.max(parseInt(q.get('page') || '') || 1, 1);
  const limit = Math.min(Math.max(parseInt(q.get('limit') || '') || 20, 1), 100);

  const where: string[] = [];
  const values: any[] = [];
  if (q.get('status')) {
    const statuses = q.get('status')!.toUpperCase().split(',');
    if (statuses.some((s) => !REQUEST_FLOW[s])) return fail(400, 'Invalid status filter');
    values.push(statuses);
    where.push(`s.status = ANY($${values.length})`);
  }
  if (q.get('room_id')) {
    values.push(q.get('room_id'));
    where.push(`s.room_id = $${values.length}`);
  }
  const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';

  const total = await pool.query(`SELECT COUNT(*) FROM service_requests s ${whereSql}`, values);
  const rows = await pool.query(
    `${SELECT_REQUESTS} ${whereSql} ORDER BY s.created_at DESC LIMIT ${limit} OFFSET ${(page - 1) * limit}`,
    values
  );
  return ok({
    requests: rows.rows.map(formatRequest),
    pagination: { page, limit, total: Number(total.rows[0].count) },
  });
});
