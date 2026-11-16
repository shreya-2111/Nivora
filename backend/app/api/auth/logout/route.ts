// POST /api/auth/logout
import { NextRequest, NextResponse } from 'next/server';
import { safe } from '@/lib/api';
import { getTokenFromRequest } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const POST = safe(async (req: NextRequest) => {
  const token = getTokenFromRequest(req);
  if (token) await supabaseAdmin().auth.admin.signOut(token).catch(() => {}); // end the Supabase session

  const res = NextResponse.json({ message: 'Logged out' });
  res.cookies.delete('staff_token');
  return res;
});
