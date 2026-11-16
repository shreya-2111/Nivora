// Request types (Extra Towels, Laundry ...). Hotel can switch each one on/off.
import { NextRequest } from 'next/server';
import { pool } from '@/lib/db';
import { safe, ok } from '@/lib/api';
import { getStaff } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/service-categories   (staff sees all, others only active ones)
export const GET = safe(async (req: NextRequest) => {
  const staff = await getStaff(req);
  const result = await pool.query(`SELECT * FROM service_categories ${staff ? '' : 'WHERE is_active = TRUE'} ORDER BY sort_order`);
  return ok({ service_categories: result.rows });
});
