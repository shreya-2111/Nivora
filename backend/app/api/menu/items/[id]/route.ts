import { NextRequest } from 'next/server';
import { pool } from '@/lib/db';
import { safe, ok, fail, readBody, toBool } from '@/lib/api';
import { getStaff } from '@/lib/auth';
import { saveImage, deleteImage } from '@/lib/storage';
import { getOneItem, readOptions, saveOptions } from '@/lib/menu';

export const dynamic = 'force-dynamic';

// PATCH /api/menu/items/:id   (change price, availability, add-ons, image, sort_order ...)
export const PATCH = safe(async (req: NextRequest, { params }) => {
  if (!(await getStaff(req))) return fail(401, 'Please login first');
  const { id } = await params;

  const { body, files } = await readBody(req);
  if (body.price !== undefined && (isNaN(body.price) || Number(body.price) < 0)) return fail(400, 'price must be a number (0 or more)');
  if (body.name !== undefined && !String(body.name).trim()) return fail(400, 'name cannot be empty');

  const old = await pool.query('SELECT * FROM menu_items WHERE id = $1', [id]);
  if (!old.rows[0]) return fail(404, 'Menu item not found');

  if (body.category_id) {
    const category = await pool.query('SELECT id FROM menu_categories WHERE id = $1', [body.category_id]);
    if (!category.rows[0]) return fail(400, 'Category does not exist');
  }

  const options = readOptions(body);
  const image = files.image ? await saveImage(files.image) : body.image_url;

  await pool.query(
    `UPDATE menu_items SET category_id = COALESCE($1, category_id), name = COALESCE($2, name),
       description = COALESCE($3, description), price = COALESCE($4, price), image_url = COALESCE($5, image_url),
       is_vegetarian = COALESCE($6, is_vegetarian), is_available = COALESCE($7, is_available),
       sort_order = COALESCE($8, sort_order), updated_at = NOW()
     WHERE id = $9`,
    [body.category_id ?? null, body.name ?? null, body.description ?? null, body.price ?? null, image ?? null,
     toBool(body.is_vegetarian) ?? null, toBool(body.is_available) ?? null, body.sort_order ?? null, id]
  );
  if (options) await saveOptions(id, options);
  if (image && old.rows[0].image_url !== image) await deleteImage(old.rows[0].image_url);

  return ok({ item: await getOneItem(id) });
});

// DELETE /api/menu/items/:id
export const DELETE = safe(async (req: NextRequest, { params }) => {
  if (!(await getStaff(req))) return fail(401, 'Please login first');
  const { id } = await params;

  const result = await pool.query('DELETE FROM menu_items WHERE id = $1 RETURNING image_url', [id]);
  if (!result.rows[0]) return fail(404, 'Menu item not found');
  await deleteImage(result.rows[0].image_url);
  return ok({ message: 'Menu item deleted' });
});
