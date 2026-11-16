import { NextRequest } from 'next/server';
import { safe, ok } from '@/lib/api';
import { getStaff } from '@/lib/auth';
import { buildMenu } from '@/lib/menu';

export const dynamic = 'force-dynamic';

// GET /api/menu   (staff sees everything, others see the guest menu)
export const GET = safe(async (req: NextRequest) => {
  const staff = await getStaff(req);
  return ok({ categories: await buildMenu(!!staff) });
});
