// Runs before every /api request. It only handles CORS (needed if the frontend runs on a different domain).
// (In Next.js 16 this file is called "proxy.ts"; in older versions it was "middleware.ts".)
import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const configured = (process.env.CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const allowed = configured.length > 0 ? configured : (process.env.NODE_ENV !== 'production' ? ['http://localhost:3000'] : []);
  const origin = req.headers.get('origin');
  const headers: Record<string, string> = {};

  if (origin && allowed.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
    headers['Access-Control-Allow-Methods'] = 'GET,POST,PATCH,DELETE,OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Guest-Session, Idempotency-Key';
    headers['Vary'] = 'Origin';
  }

  // browser "preflight" check
  if (req.method === 'OPTIONS') return new NextResponse(null, { status: 204, headers });

  const res = NextResponse.next();
  for (const [key, value] of Object.entries(headers)) res.headers.set(key, value);
  return res;
}

export const config = { matcher: '/api/:path*' };
