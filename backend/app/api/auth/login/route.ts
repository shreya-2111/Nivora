// POST /api/auth/login   body: { email, password }   (checked by Supabase Auth)
import { NextRequest } from 'next/server';
import { safe, fail, readBody, getIp } from '@/lib/api';
import { newAnonClient } from '@/lib/supabase';
import { findStaff, sessionResponse } from '@/lib/auth';
import { hit, hits, TOO_MANY } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export const POST = safe(async (req: NextRequest) => {
  // only FAILED logins count: max 10 per 15 minutes per IP
  const key = 'login:' + getIp(req);
  if ((await hits(key, 900)) >= 10) return fail(429, TOO_MANY);

  const { body } = await readBody(req);
  const { email, password } = body;
  if (!email || !password) return fail(400, 'Email and password are required');

  const { data, error } = await newAnonClient().auth.signInWithPassword({ email: String(email).trim(), password });
  if (error || !data.session) {
    await hit(key, 900);
    return fail(401, 'Invalid email or password');
  }

  const staff = await findStaff(data.user.id);
  if (!staff) return fail(403, 'This account is not hotel staff');

  return sessionResponse(staff, data.session);
});
