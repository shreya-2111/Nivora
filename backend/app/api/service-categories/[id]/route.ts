import { NextRequest } from 'next/server';
import { pool } from '@/lib/db';
import { safe, ok, fail, readBody, toBool } from '@/lib/api';
import { getStaff } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// PATCH /api/service-categories/:id   body: { is_active, name, description, sort_order }
export const PATCH = safe(async (req: NextRequest, { params }) => {
  if (!(await getStaff(req))) return fail(401, 'Please login first');
  const { id } = await params;

  const { body } = await readBody(req);
  const { is_active, name, description, sort_order } = body;
  const result = await pool.query(
    `UPDATE service_categories SET is_active = COALESCE($1, is_active), name = COALESCE($2, name),
       description = COALESCE($3, description), sort_order = COALESCE($4, sort_order), updated_at = NOW()
     WHERE id = $5 RETURNING *`,
    [toBool(is_active) ?? null, name ?? null, description ?? null, sort_order ?? null, id]
  );
  if (!result.rows[0]) return fail(404, 'Request type not found');
  return ok({ service_category: result.rows[0] });
});
