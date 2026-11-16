import { NextRequest } from 'next/server';
import { pool } from '@/lib/db';
import { safe, ok, fail, readBody, getIp } from '@/lib/api';
import { getStaff, getGuest } from '@/lib/auth';
import { hit, TOO_MANY } from '@/lib/rateLimit';
import { getHotel } from '@/lib/hotel';
import { ORDER_FLOW, SELECT_ORDERS, addItemsToOrders, getOrder, round2 } from '@/lib/orders';

export const dynamic = 'force-dynamic';

// POST /api/orders   (guest)
// body: { items: [{ menu_item_id, quantity, option_ids: [], special_instructions }], special_instructions }
// The room comes from the guest session. Prices are read from the DB (never trusted from the client).
export const POST = safe(async (req: NextRequest) => {
  const guest = await getGuest(req);
  if (!guest) return fail(401, 'Session expired. Please scan the QR code again.');
  if ((await hit('order:' + getIp(req), 600)) > 20) return fail(429, TOO_MANY); // 20 per 10 minutes

  const { body } = await readBody(req);
  const roomId = guest.roomId;

  const hotel = await getHotel();
  if (!hotel.module_food_ordering) return fail(403, 'Food ordering is not available right now', { code: 'MODULE_DISABLED' });

  // ---- double submit protection ----
  // The frontend should send a random "Idempotency-Key" header (same key when the guest taps twice / retries).
  // If we already saved an order with this key, we just return that order again.
  const key = req.headers.get('idempotency-key') || body.idempotency_key || null;
  if (key) {
    const same = await pool.query('SELECT id FROM orders WHERE room_id = $1 AND idempotency_key = $2', [roomId, key]);
    if (same.rows[0]) return ok({ order: await getOrder(same.rows[0].id), duplicate: true });
  }

  // ---- check the cart ----
  if (!Array.isArray(body.items) || body.items.length === 0) return fail(400, 'Your cart is empty');
  if (body.items.length > 50) return fail(400, 'Too many items in one order');
  if (body.room_id && body.room_id !== roomId) return fail(400, 'Invalid room');

  for (const line of body.items) {
    if (!line.menu_item_id) return fail(400, 'menu_item_id is required for every item');
    if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 50) {
      return fail(400, 'Quantity must be a whole number between 1 and 50');
    }
  }

  // ---- load items from DB and check availability ----
  const itemIds = body.items.map((l: any) => l.menu_item_id);
  const dbItems = (
    await pool.query(
      `SELECT i.*, c.is_active AS category_active FROM menu_items i
       JOIN menu_categories c ON c.id = i.category_id WHERE i.id = ANY($1)`,
      [itemIds]
    )
  ).rows;

  const unavailable = [];
  for (const id of new Set<string>(itemIds)) {
    const item = dbItems.find((i) => i.id === id);
    if (!item || !item.is_available || !item.category_active) {
      unavailable.push({ menu_item_id: id, name: item ? item.name : null });
    }
  }
  if (unavailable.length > 0) {
    return fail(409, 'Some items are no longer available. Please check your cart.', { code: 'ITEM_UNAVAILABLE', unavailable });
  }

  // ---- work out prices ----
  const lines = [];
  let subtotal = 0;
  for (const line of body.items) {
    const item = dbItems.find((i) => i.id === line.menu_item_id);
    const optionIds = line.option_ids || [];
    const dbOptions = optionIds.length
      ? (await pool.query('SELECT * FROM menu_item_options WHERE id = ANY($1) AND menu_item_id = $2 AND is_active = TRUE', [optionIds, item.id])).rows
      : [];
    if (dbOptions.length !== new Set(optionIds).size) return fail(400, `Invalid or unavailable add-on for ${item.name}`);

    const optionsTotal = dbOptions.reduce((sum, o) => sum + o.price, 0);
    subtotal += (item.price + optionsTotal) * line.quantity;
    lines.push({ item, dbOptions, quantity: line.quantity, note: line.special_instructions || null });
  }
  subtotal = round2(subtotal);

  // ---- no key sent: fallback check - same room + same total within the last 10 seconds ----
  if (!key) {
    const dup = await pool.query(
      `SELECT id FROM orders WHERE room_id = $1 AND total = $2 AND created_at > NOW() - INTERVAL '10 seconds'`,
      [roomId, subtotal]
    );
    if (dup.rows[0]) return fail(409, 'This order was just placed. Please wait.', { code: 'DUPLICATE_ORDER', order_id: dup.rows[0].id });
  }

  // ---- save order. BEGIN/COMMIT = save everything together, or nothing if something fails ----
  const client = await pool.connect();
  let orderId: string;
  try {
    await client.query('BEGIN');
    const seq = await client.query("SELECT nextval('order_number_seq') AS n");
    const order = await client.query(
      `INSERT INTO orders (order_number, room_id, subtotal, total, special_instructions, idempotency_key)
       VALUES ($1, $2, $3, $3, $4, $5) RETURNING id`,
      ['ORD-' + seq.rows[0].n, roomId, subtotal, body.special_instructions || null, key]
    );
    orderId = order.rows[0].id;

    for (const l of lines) {
      // snapshot: copy the CURRENT name and price into the order
      const orderItem = await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, item_name_snapshot, unit_price, quantity, special_instructions)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [orderId, l.item.id, l.item.name, l.item.price, l.quantity, l.note]
      );
      for (const o of l.dbOptions) {
        await client.query(
          'INSERT INTO order_item_options (order_item_id, option_name_snapshot, option_price) VALUES ($1, $2, $3)',
          [orderItem.rows[0].id, o.name, o.price]
        );
      }
    }
    await client.query('COMMIT');
  } catch (err: any) {
    await client.query('ROLLBACK');
    // two taps at the exact same moment with the same key: the second one fails here -> return the first order
    if (err.code === '23505' && key) {
      const same = await pool.query('SELECT id FROM orders WHERE room_id = $1 AND idempotency_key = $2', [roomId, key]);
      if (same.rows[0]) return ok({ order: await getOrder(same.rows[0].id), duplicate: true });
    }
    throw err;
  } finally {
    client.release();
  }

  // (staff dashboard gets this new order live from Supabase Realtime - nothing to send from here)
  return ok({ order: await getOrder(orderId) }, 201);
});

// GET /api/orders   (staff)   filters: ?status=NEW,ACCEPTED  ?room_id=  ?page=1  ?limit=20
export const GET = safe(async (req: NextRequest) => {
  if (!(await getStaff(req))) return fail(401, 'Please login first');
  const q = req.nextUrl.searchParams;

  const page = Math.max(parseInt(q.get('page') || '') || 1, 1);
  const limit = Math.min(Math.max(parseInt(q.get('limit') || '') || 20, 1), 100);

  const where: string[] = [];
  const values: any[] = [];
  if (q.get('status')) {
    const statuses = q.get('status')!.toUpperCase().split(',');
    if (statuses.some((s) => !ORDER_FLOW[s])) return fail(400, 'Invalid status filter');
    values.push(statuses);
    where.push(`o.status = ANY($${values.length})`);
  }
  if (q.get('room_id')) {
    values.push(q.get('room_id'));
    where.push(`o.room_id = $${values.length}`);
  }
  const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';

  const total = await pool.query(`SELECT COUNT(*) FROM orders o ${whereSql}`, values);
  const rows = await pool.query(
    `${SELECT_ORDERS} ${whereSql} ORDER BY o.created_at DESC LIMIT ${limit} OFFSET ${(page - 1) * limit}`,
    values
  );
  return ok({
    orders: await addItemsToOrders(rows.rows),
    pagination: { page, limit, total: Number(total.rows[0].count) },
  });
});
