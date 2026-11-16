// GET /api/guest/:token
// QR token -> check it -> find the room -> give a temporary guest session -> send hotel info, menu, request types
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';
import { safe, ok, fail, getIp } from '@/lib/api';
import { hit, TOO_MANY } from '@/lib/rateLimit';
import { getHotel, formatHotel } from '@/lib/hotel';
import { buildMenu } from '@/lib/menu';

export const dynamic = 'force-dynamic';

export const GET = safe(async (req: NextRequest, { params }) => {
  if ((await hit('guest:' + getIp(req), 60)) > 60) return fail(429, TOO_MANY); // 60 QR scans per minute per IP

  const { token } = await params;
  const result = await pool.query(
    `SELECT q.id AS qr_id, q.room_id, r.room_number, r.floor
     FROM qr_codes q JOIN rooms r ON r.id = q.room_id
     WHERE q.token = $1 AND q.is_active = TRUE AND r.status = 'ACTIVE'`,
    [token]
  );
  const found = result.rows[0];
  if (!found) return fail(404, 'This QR code is invalid or expired. Please contact reception.', { code: 'INVALID_QR' });

  const hotel = formatHotel(await getHotel());

  // the session token remembers which room this guest is in
  const sessionToken = jwt.sign({ roomId: found.room_id, qrId: found.qr_id }, process.env.GUEST_JWT_SECRET!, { expiresIn: '12h' });

  const menu = hotel.modules.food_ordering ? await buildMenu(false) : [];
  const services = hotel.modules.room_service
    ? (await pool.query('SELECT id, name, description FROM service_categories WHERE is_active = TRUE ORDER BY sort_order')).rows
    : [];

  return ok({
    session: { token: sessionToken },
    room: { id: found.room_id, room_number: found.room_number, floor: found.floor },
    hotel,
    modules: hotel.modules,
    menu,
    service_categories: services,
  });
});
