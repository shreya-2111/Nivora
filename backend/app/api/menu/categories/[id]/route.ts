import { NextRequest } from 'next/server';
import { pool } from '@/lib/db';
import { safe, ok, fail, readBody, toBool } from '@/lib/api';
import { getStaff } from '@/lib/auth';
import { deleteImage } from '@/lib/storage';

export const dynamic = 'force-dynamic';

// PATCH /api/menu/categories/:id   (also used for changing sort_order)
export const PATCH = safe(async (req: NextRequest, { params }) => {
  if (!(await getStaff(req))) return fail(401, 'Please login first');
  const { id } = await params;

  const { body } = await readBody(req);
  const { name, description, sort_order, is_active } = body;
  if (name !== undefined && !String(name).trim()) return fail(400, 'name cannot be empty');

  const result = await pool.query(
    `UPDATE menu_categories SET name = COALESCE($1, name), description = COALESCE($2, description),
       sort_order = COALESCE($3, sort_order), is_active = COALESCE($4, is_active), updated_at = NOW()
     WHERE id = $5 RETURNING *`,
    [name ?? null, description ?? null, sort_order ?? null, toBool(is_active) ?? null, id]
  );
  if (!result.rows[0]) return fail(404, 'Category not found');
  return ok({ category: result.rows[0] });
});

// DELETE /api/menu/categories/:id   (its items are deleted too; old orders keep their copied names/prices)
export const DELETE = safe(async (req: NextRequest, { params }) => {
  if (!(await getStaff(req))) return fail(401, 'Please login first');
  const { id } = await params;

  const images = await pool.query('SELECT image_url FROM menu_items WHERE category_id = $1', [id]);
  const result = await pool.query('DELETE FROM menu_categories WHERE id = $1', [id]);
  if (result.rowCount === 0) return fail(404, 'Category not found');
  for (const i of images.rows) await deleteImage(i.image_url);
  return ok({ message: 'Category deleted' });
});
