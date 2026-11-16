import { pool } from './db';
import { fail, ok, HttpError } from './api';

// Builds the full menu: categories -> items -> add-ons.
// forStaff = true  : everything (hidden categories and hidden add-ons too)
// forStaff = false : only what guests should see (unavailable items are still listed, with is_available = false)
export async function buildMenu(forStaff: boolean) {
  const cats = await pool.query(
    `SELECT * FROM menu_categories ${forStaff ? '' : 'WHERE is_active = TRUE'} ORDER BY sort_order, created_at`
  );
  const items = await pool.query('SELECT * FROM menu_items ORDER BY sort_order, created_at');
  const options = await pool.query(
    `SELECT * FROM menu_item_options ${forStaff ? '' : 'WHERE is_active = TRUE'} ORDER BY created_at`
  );

  const categories = cats.rows.map((cat) => ({
    id: cat.id,
    name: cat.name,
    description: cat.description,
    sort_order: cat.sort_order,
    is_active: cat.is_active,
    items: items.rows
      .filter((item) => item.category_id === cat.id)
      .map((item) => ({
        ...item,
        options: options.rows.filter((o) => o.menu_item_id === item.id),
      })),
  }));

  // guests don't need to see empty categories
  return forStaff ? categories : categories.filter((c) => c.items.length > 0);
}

export async function getOneItem(id: string) {
  const item = await pool.query('SELECT * FROM menu_items WHERE id = $1', [id]);
  if (!item.rows[0]) return null;
  const options = await pool.query('SELECT * FROM menu_item_options WHERE menu_item_id = $1 ORDER BY created_at', [id]);
  return { ...item.rows[0], options: options.rows };
}

// ---- reorder: send ids in the NEW order, we save sort_order = 1, 2, 3 ... ----
// body: { ids: ["id-of-first", "id-of-second", ...] }
export async function reorder(table: 'menu_categories' | 'menu_items', body: any) {
  const ids = body.ids;
  if (!Array.isArray(ids) || ids.length === 0) return fail(400, 'ids must be a list of ids in the new order');
  if (new Set(ids).size !== ids.length) return fail(400, 'ids has duplicates');

  const found = await pool.query(`SELECT COUNT(*) FROM ${table} WHERE id = ANY($1)`, [ids]);
  if (Number(found.rows[0].count) !== ids.length) return fail(404, 'Some ids were not found');

  for (let i = 0; i < ids.length; i++) {
    await pool.query(`UPDATE ${table} SET sort_order = $1, updated_at = NOW() WHERE id = $2`, [i + 1, ids[i]]);
  }
  return ok({ message: 'Order saved', categories: await buildMenu(true) });
}

// ---- add-ons of an item ----
// add-ons can come as an array (JSON) or as a JSON text (form-data)
export function readOptions(body: any) {
  if (body.options === undefined) return undefined;
  let options = body.options;
  if (typeof options === 'string') {
    try {
      options = JSON.parse(options);
    } catch (err) {
      throw new HttpError(400, 'options must be valid JSON');
    }
  }
  if (!Array.isArray(options)) throw new HttpError(400, 'options must be an array');
  for (const o of options) {
    if (!o.name || !String(o.name).trim()) throw new HttpError(400, 'Each add-on needs a name');
    if (o.price !== undefined && (isNaN(o.price) || Number(o.price) < 0)) throw new HttpError(400, 'Add-on price is invalid');
  }
  return options;
}

// replace all add-ons of an item with the new list
export async function saveOptions(itemId: string, options: any[]) {
  await pool.query('DELETE FROM menu_item_options WHERE menu_item_id = $1', [itemId]);
  for (const o of options) {
    await pool.query('INSERT INTO menu_item_options (menu_item_id, name, price, is_active) VALUES ($1, $2, $3, $4)', [
      itemId, String(o.name).trim(), o.price ?? 0, o.is_active ?? true,
    ]);
  }
}
