// GET /api/auth/me
import { NextRequest } from 'next/server';
import { safe, ok, fail } from '@/lib/api';
import { getStaff } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export const GET = safe(async (req: NextRequest) => {
  const staff = await getStaff(req);
  if (!staff) return fail(401, 'Please login first');
  return ok({ user: staff });
});
