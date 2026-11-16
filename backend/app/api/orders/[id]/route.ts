import { NextRequest } from 'next/server';
import { safe, ok, fail } from '@/lib/api';
import { getStaff, getGuest } from '@/lib/auth';
import { getOrder } from '@/lib/orders';

export const dynamic = 'force-dynamic';

// GET /api/orders/:id   (staff: any order. guest: only orders of their own room placed during their own session)
export const GET = safe(async (req: NextRequest, { params }) => {
  const { id } = await params;
  const staff = await getStaff(req);
  const guest = staff ? null : await getGuest(req);
  if (!staff && !guest) return fail(401, 'Not allowed');

  const order = await getOrder(id);
  if (!order || (guest && (order.room.id !== guest.roomId || new Date(order.created_at).getTime() < guest.issuedAt))) {
    return fail(404, 'Order not found');
  }
  return ok({ order });
});
