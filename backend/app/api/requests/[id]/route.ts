import { NextRequest } from 'next/server';
import { safe, ok, fail } from '@/lib/api';
import { getStaff, getGuest } from '@/lib/auth';
import { getRequest } from '@/lib/requests';

export const dynamic = 'force-dynamic';

// GET /api/requests/:id   (staff: any. guest: only requests of their own room made during their own session)
export const GET = safe(async (req: NextRequest, { params }) => {
  const { id } = await params;
  const staff = await getStaff(req);
  const guest = staff ? null : await getGuest(req);
  if (!staff && !guest) return fail(401, 'Not allowed');

  const request = await getRequest(id);
  if (!request || (guest && (request.room.id !== guest.roomId || new Date(request.created_at).getTime() < guest.issuedAt))) {
    return fail(404, 'Request not found');
  }
  return ok({ request });
});
