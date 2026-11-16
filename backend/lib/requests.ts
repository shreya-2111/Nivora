import { pool } from './db';

export const REQUEST_FLOW: Record<string, string[]> = {
  NEW: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
  ACCEPTED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  REJECTED: [],
  CANCELLED: [],
};

export const SELECT_REQUESTS = `SELECT s.*, r.room_number, r.floor AS room_floor, c.name AS category_name
  FROM service_requests s
  JOIN rooms r ON r.id = s.room_id
  JOIN service_categories c ON c.id = s.service_category_id`;

export const formatRequest = (s: any) => ({
  id: s.id,
  request_number: s.request_number,
  room: { id: s.room_id, room_number: s.room_number, floor: s.room_floor },
  service_category: { id: s.service_category_id, name: s.category_name },
  custom_request: s.custom_request,
  status: s.status,
  created_at: s.created_at,
  updated_at: s.updated_at,
});

export async function getRequest(id: string) {
  const result = await pool.query(`${SELECT_REQUESTS} WHERE s.id = $1`, [id]);
  return result.rows[0] ? formatRequest(result.rows[0]) : null;
}
