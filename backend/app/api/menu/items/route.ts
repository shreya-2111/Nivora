import { NextRequest } from 'next/server';
import { pool } from '@/lib/db';
import { safe, ok, fail, readBody, toBool } from '@/lib/api';
import { getStaff } from '@/lib/auth';
import { saveImage } from '@/lib/storage';
import { getOneItem, readOptions, saveOptions } from '@/lib/menu';

export const dynamic = 'force-dynamic';

// POST /api/menu/items   (JSON or form-data with image file "image")
export const POST = safe(async (req: NextRequest) => {
  if (!(await getStaff(req))) return fail(401, 'Please login first');

  const { body, files } = await readBody(req);
  if (!body.category_id) return fail(400, 'category_id is required');
  if (!body.name || !String(body.name).trim()) return fail(400, 'name is required');
  if (body.price === undefined || isNaN(body.price) || Number(body.price) < 0) return fail(400, 'price must be a number (0 or more)');

  const category = await pool.query('SELECT id FROM menu_categories WHERE id = $1', [body.category_id]);
  if (!category.rows[0]) return fail(400, 'Category does not exist');

  const options = readOptions(body);
  const image = files.image ? await saveImage(files.image) : body.image_url; // uploaded to Supabase Storage

  const result = await pool.query(
    `INSERT INTO menu_items (category_id, name, description, price, image_url, is_vegetarian, is_available, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM menu_items)))
     RETURNING id`,
    [body.category_id, String(body.name).trim(), body.description ?? null, body.price, image ?? null,
     toBool(body.is_vegetarian) ?? true, toBool(body.is_available) ?? true, body.sort_order ?? null]
  );
  if (options) await saveOptions(result.rows[0].id, options);

  return ok({ item: await getOneItem(result.rows[0].id) }, 201);
});
