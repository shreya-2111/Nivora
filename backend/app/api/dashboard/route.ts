// GET /api/dashboard   (staff) - numbers for the admin home page
import { NextRequest } from 'next/server';
import { pool } from '@/lib/db';
import { safe, ok, fail } from '@/lib/api';
import { getStaff } from '@/lib/auth';
import { SELECT_ORDERS, addItemsToOrders } from '@/lib/orders';
import { SELECT_REQUESTS, formatRequest } from '@/lib/requests';

export const dynamic = 'force-dynamic';

export const GET = safe(async (req: NextRequest) => {
  if (!(await getStaff(req))) return fail(401, 'Please login first');

  const orders = await pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE) AS orders_today,
      COUNT(*) FILTER (WHERE status = 'NEW') AS pending_orders,
      COALESCE(SUM(total) FILTER (WHERE created_at::date = CURRENT_DATE AND status NOT IN ('REJECTED', 'CANCELLED')), 0) AS order_value_today
    FROM orders`);

  const requests = await pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE) AS requests_today,
      COUNT(*) FILTER (WHERE status = 'NEW') AS pending_requests
    FROM service_requests`);

  const recentOrders = await pool.query(`${SELECT_ORDERS} ORDER BY o.created_at DESC LIMIT 10`);
  const recentRequests = await pool.query(`${SELECT_REQUESTS} ORDER BY s.created_at DESC LIMIT 10`);

  return ok({
    stats: {
      food_orders: Number(orders.rows[0].orders_today),
      pending_orders: Number(orders.rows[0].pending_orders),
      room_requests: Number(requests.rows[0].requests_today),
      pending_requests: Number(requests.rows[0].pending_requests),
      order_value_today: orders.rows[0].order_value_today,
    },
    recent_orders: await addItemsToOrders(recentOrders.rows),
    recent_requests: recentRequests.rows.map(formatRequest),
  });
});
