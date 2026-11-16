// POST /api/auth/refresh   body: { refresh_token }  -> new access token (Supabase tokens are short-lived)
import { NextRequest } from 'next/server';
import { safe, fail, readBody, getIp } from '@/lib/api';
import { newAnonClient } from '@/lib/supabase';
import { findStaff, sessionResponse } from '@/lib/auth';
import { hit, TOO_MANY } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export const POST = safe(async (req: NextRequest) => {
  if ((await hit('refresh:' + getIp(req), 900)) > 30) return fail(429, TOO_MANY); // 30 per 15 minutes

  const { body } = await readBody(req);
  if (!body.refresh_token) return fail(400, 'refresh_token is required');

  const { data, error } = await newAnonClient().auth.refreshSession({ refresh_token: body.refresh_token });
  if (error || !data.session) return fail(401, 'Session expired. Please login again.');

  const staff = await findStaff(data.user.id);
  if (!staff) return fail(403, 'This account is not hotel staff');

  return sessionResponse(staff, data.session);
});
