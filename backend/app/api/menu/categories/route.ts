import { NextRequest } from 'next/server';
import { pool } from '@/lib/db';
import { safe, ok, fail, readBody, toBool } from '@/lib/api';
import { getStaff } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/menu/categories   body: { name, description, sort_order, is_active }
export const POST = safe(async (req: NextRequest) => {
  if (!(await getStaff(req))) return fail(401, 'Please login first');

  const { body } = await readBody(req);
  const { name, description, sort_order, is_active } = body;
  if (!name || !String(name).trim()) return fail(400, 'name is required');

  const result = await pool.query(
    `INSERT INTO menu_categories (name, description, sort_order, is_active)
     VALUES ($1, $2, COALESCE($3, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM menu_categories)), $4) RETURNING *`,
    [String(name).trim(), description ?? null, sort_order ?? null, toBool(is_active) ?? true]
  );
  return ok({ category: result.rows[0] }, 201);
});
