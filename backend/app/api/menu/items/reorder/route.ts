// PATCH /api/menu/items/reorder   body: { ids: [...] } in the new order
import { NextRequest } from 'next/server';
import { safe, fail, readBody } from '@/lib/api';
import { getStaff } from '@/lib/auth';
import { reorder } from '@/lib/menu';

export const dynamic = 'force-dynamic';

export const PATCH = safe(async (req: NextRequest) => {
  if (!(await getStaff(req))) return fail(401, 'Please login first');
  const { body } = await readBody(req);
  return reorder('menu_items', body);
});
