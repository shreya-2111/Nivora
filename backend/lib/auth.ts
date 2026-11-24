// Login checks.
//  Staff  : Supabase Auth access token (header "Authorization: Bearer <token>" or cookie "staff_token")
//  Guest  : session token from GET /api/guest/:token, sent in header "X-Guest-Session"
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from './db';
import { supabaseAdmin } from './supabase';
import { Guest, Staff } from '@/types';

export function getTokenFromRequest(req: NextRequest): string | undefined {
  const header = req.headers.get('authorization');
  if (header && header.startsWith('Bearer ')) return header.slice(7);
  return req.cookies.get('staff_token')?.value;
}

// returns the logged-in staff user, or null
export async function getStaff(req: NextRequest): Promise<Staff | null> {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  try {
    // ask Supabase Auth: is this token valid? who is the user?
    const { data, error } = await supabaseAdmin().auth.getUser(token);
    if (error || !data.user) return null; // wrong or expired token

    // the person must also be in OUR admin_users table (so only hotel staff get in)
    const result = await pool.query('SELECT id, email, name, role FROM admin_users WHERE auth_provider_id = $1', [data.user.id]);
    return result.rows[0] || null;
  } catch (err) {
    return null;
  }
}

// returns { roomId, issuedAt } of the guest, or null
export async function getGuest(req: NextRequest): Promise<Guest | null> {
  const token = req.headers.get('x-guest-session');
  if (!token) return null;
  try {
    const data = jwt.verify(token, process.env.GUEST_JWT_SECRET!) as any;
    // QR must still be active and the room must still be ACTIVE
    const result = await pool.query(
      `SELECT q.id FROM qr_codes q JOIN rooms r ON r.id = q.room_id
       WHERE q.id = $1 AND q.is_active = TRUE AND UPPER(r.status) = 'ACTIVE'`,
      [data.qrId]
    );
    // issuedAt = when this guest session started (so a guest never sees orders of earlier guests)
    return result.rows[0] ? { roomId: data.roomId, issuedAt: data.iat * 1000 } : null;
  } catch (err) {
    return null;
  }
}

// send the Supabase session to the frontend + keep the access token in a cookie
export function sessionResponse(staff: Staff, session: any) {
  const res = NextResponse.json({
    user: staff,
    token: session.access_token,          // send as "Authorization: Bearer <token>"
    refresh_token: session.refresh_token,  // use with POST /api/auth/refresh when the token expires
    expires_at: session.expires_at,
  });
  res.cookies.set('staff_token', session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: session.expires_in,
  });
  return res;
}

// find the staff row (admin_users) of a Supabase Auth user
export async function findStaff(authUserId: string): Promise<Staff | undefined> {
  const result = await pool.query('SELECT id, email, name, role FROM admin_users WHERE auth_provider_id = $1', [authUserId]);
  return result.rows[0];
}
