import { pool } from './db';

// allowed next statuses for each current status
export const ORDER_FLOW: Record<string, string[]> = {
  NEW: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
  ACCEPTED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  REJECTED: [],
  CANCELLED: [],
};

export const round2 = (n: number) => Math.round(n * 100) / 100;

export const SELECT_ORDERS = `SELECT o.*, r.room_number, r.floor AS room_floor
                              FROM orders o JOIN rooms r ON r.id = o.room_id`;

// Takes order rows from the DB and adds the items + add-ons to each order.
export async function addItemsToOrders(orderRows: any[]) {
  if (orderRows.length === 0) return [];
  const ids = orderRows.map((o) => o.id);
  const items = (await pool.query('SELECT * FROM order_items WHERE order_id = ANY($1) ORDER BY created_at', [ids])).rows;
  const itemIds = items.map((i) => i.id);
  const options = itemIds.length
    ? (await pool.query('SELECT * FROM order_item_options WHERE order_item_id = ANY($1)', [itemIds])).rows
    : [];

  return orderRows.map((o) => ({
    id: o.id,
    order_number: o.order_number,
    room: { id: o.room_id, room_number: o.room_number, floor: o.room_floor },
    status: o.status,
    subtotal: o.subtotal,
    total: o.total,
    special_instructions: o.special_instructions,
    created_at: o.created_at,
    updated_at: o.updated_at,
    items: items
      .filter((i) => i.order_id === o.id)
      .map((i) => {
        const itemOptions = options.filter((x) => x.order_item_id === i.id);
        const optionsTotal = itemOptions.reduce((sum, x) => sum + x.option_price, 0);
        return {
          id: i.id,
          menu_item_id: i.menu_item_id,
          name: i.item_name_snapshot, // name at the time of ordering
          unit_price: i.unit_price,   // price at the time of ordering
          quantity: i.quantity,
          special_instructions: i.special_instructions,
          options: itemOptions.map((x) => ({ name: x.option_name_snapshot, price: x.option_price })),
          line_total: round2((i.unit_price + optionsTotal) * i.quantity),
        };
      }),
  }));
}

export async function getOrder(id: string) {
  const result = await pool.query(`${SELECT_ORDERS} WHERE o.id = $1`, [id]);
  return (await addItemsToOrders(result.rows))[0] || null;
}
